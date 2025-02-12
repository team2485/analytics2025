import { NextResponse } from "next/server";
import { sql } from '@vercel/postgres';
import _ from 'lodash';
import { tidy, mutate, mean, select, summarizeAll, groupBy, summarize, first, n, median, total, arrange, asc } from '@tidyjs/tidy';

export const revalidate = 300; // Cache for 5 minutes

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const team = searchParams.get('team');

  if (!_.isNumber(+team)) {
    return NextResponse.json({ message: "ERROR: Invalid team number" }, { status: 400 });
  }

  // Fetch team data from database
  let data = await sql`SELECT * FROM phr2025 WHERE team = ${team};`;
  const rows = data.rows;


  if (rows.length === 0) {
    return NextResponse.json({ message: `ERROR: No data for team ${team}` }, { status: 404 });
  }

  function byAveragingNumbers(index) {
    if (['noshow', 'leave', 'breakdown', 'defense', 'cageattempt'].includes(index)) {
      return arr => arr.some(row => row[index] === true);
    }
    if (['scoutname', 'generalcomments', 'breakdowncomments', 'defensecomments'].includes(index)) {
      return arr => arr.map(row => row[index]).filter(a => a != null).join(" - ") || null;
    }
    if (['coralspeed', 'processorspeed', 'netspeed', 'algaeremovalspeed', 'climbspeed', 'maneuverability', 'defenseplayed', 'defenseevasion', 'aggression', 'cagehazard'].includes(index)) {
      return arr => {
        let filtered = arr.filter(row => row[index] != -1 && row[index] != null).map(row => row[index]);
        return filtered.length === 0 ? -1 : mean(filtered);
      };
    }
    return mean(index);
  }

  let teamTable = tidy(rows, groupBy(['match'], [summarizeAll(byAveragingNumbers)]));

  // Compute auto, tele, endgame
  teamTable = tidy(teamTable, mutate({
    auto: rec => rec.autol1success + rec.autol2success + rec.autol3success + rec.autol4success + rec.autoprocessorsuccess + rec.autonetsuccess || 0,
    tele: rec => rec.telel1success + rec.telel2success + rec.telel3success + rec.telel4success + rec.teleprocessorsuccess + rec.telenetsuccess || 0,
    end: rec => rec.endlocation || 0,
    epa: rec => (rec.autol1success + rec.autol2success + rec.autol3success + rec.autol4success + 
                 rec.autoprocessorsuccess + rec.autonetsuccess + 
                 rec.telel1success + rec.telel2success + rec.telel3success + rec.telel4success +
                 rec.teleprocessorsuccess + rec.telenetsuccess) || 0
}));


  function rowsToArray(rows, index) {
    return rows.map(row => row[index]).filter(val => val != null);
  }

  function percentValue(arr, index, value) {
    return arr.filter(e => e[index] === value).length / arr.length;
  }

  // fetch team name from blue alliance api, commented our for now while testing getting from the backend
  const teamName = await fetch(`https://www.thebluealliance.com/api/v3/team/frc${team}/simple`, {
    headers: {
      "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY,
      "Accept": "application/json"
    },
  })
  .then(resp => {
    if (resp.status !== 200) {
      console.error(`TBA API Error: Received status ${resp.status}`);
      return null;  // Return null if the request fails
    }
    return resp.json();
  })
  .then(data => {
    if (!data || !data.nickname) { 
      console.warn(`TBA API Warning: No nickname found for team ${team}`);
      return "Unknown Team";  // Provide a default fallback
    }
    return data.nickname;
  });

  console.log("Processed Team Table:", teamTable);

  const matchesScouted = teamTable.length;

  let returnObject = tidy(teamTable, summarize({
    team: first('team'),
    teamName: () => teamName,
    avgEpa: mean('epa'),
    avgAuto: mean('auto'),
    avgTele: mean('tele'),
    avgEnd: mean('end'),
    matchesScouted: () => matchesScouted,
    epaOverTime: arr => tidy(arr, select(['epa', 'match'])),
    autoOverTime: arr => tidy(arr, select(['match', 'auto'])),
    teleOverTime: arr => tidy(arr, select(['match', 'tele'])),
    noShow: arr => percentValue(arr, 'noshow', true),
    defense: arr => percentValue(arr, 'defenseplayed', true),
    breakdown: arr => percentValue(arr, 'breakdown', true),
    lastBreakdown: arr => arr.filter(e => e.breakdowncomments !== null).reduce((a, b) => b.match, "N/A"),
    scouts: arr => rowsToArray(arr, 'scoutname'),
    generalComments: arr => rowsToArray(arr, 'generalcomments'),
    breakdownComments: arr => rowsToArray(arr, 'breakdowncomments'),
    defenseComments: arr => rowsToArray(arr, 'defensecomments'),

    auto: arr => ({
      leave: percentValue(arr, 'leave', true) || 0,
      coral: {
        total: (median('autoL1success') || 0) + (median('autoL2success') || 0) + (median('autoL3success') || 0) + (median('autoL4success') || 0),
        success: percentValue(arr, 'autoL1success', true) || 0,
        avgL1: median('autoL1success') || 0,
        avgL2: median('autoL2success') || 0,
        avgL3: median('autoL3success') || 0,
        avgL4: median('autoL4success') || 0,
      },
      algae: {
        removed: median('autoalgaeremoved') || 0,
        avgProcessor: median('autoprocessorsuccess') || 0,
        avgNet: median('autonetsuccess') || 0,
      },
    }),

    tele: arr => ({
      coral: {
        total: median('teleL1success') + median('teleL2success') + median('teleL3success') + median('teleL4success'),
        success: percentValue(arr, 'teleL1success', true),
        avgL1: median('teleL1success'),
        avgL2: median('teleL2success'),
        avgL3: median('teleL3success'),
        avgL4: median('teleL4success'),
      },
      algae: {
        removed: median('telealgaeremoved'),
        avgProcessor: median('telealgaeprocessor'),
        avgNet: median('telealgaenet'),
      },
      avgHp: median('hpsuccess'),
    }),

    endPlacement: arr => ({
      none: percentValue(arr, 'endlocation', 0),
      park: percentValue(arr, 'endlocation', 1),
      shallow: percentValue(arr, 'endlocation', 2),
      deep: percentValue(arr, 'endlocation', 3),
      parkandFail: percentValue(arr, 'endlocation', 4),
    }),

    attemptCage: arr => percentValue(arr, 'cageattempt', true),
    successCage: arr => percentValue(arr, 'cagesuccess', true),


    qualitative: arr => [
      { name: "Coral Speed", rating: mean(rowsToArray(arr, 'coralspeed')) || 0 },
      { name: "Processor Speed", rating: mean(rowsToArray(arr, 'processorspeed')) || 0 },
      { name: "Net Speed", rating: mean(rowsToArray(arr, 'netspeed')) || 0 },
      { name: "Algae Removal Speed", rating: mean(rowsToArray(arr, 'algaeremovalspeed')) || 0 },
      { name: "Climb Speed", rating: mean(rowsToArray(arr, 'climbspeed')) || 0 },
      { name: "Maneuverability", rating: mean(rowsToArray(arr, 'maneuverability')) || 0 },
      { name: "Defense Played", rating: mean(rowsToArray(arr, 'defenseplayed')) || 0 },
      { name: "Defense Evasion", rating: mean(rowsToArray(arr, 'defenseevasion')) || 0 },
      { name: "Aggression*", rating: 5 - (mean(rowsToArray(arr, 'aggression')) || 0) },
      { name: "Cage Hazard*", rating: 5 - (mean(rowsToArray(arr, 'cagehazard')) || 0) },
    ],
  }));
  console.log("Graph Data:", returnObject[0].autoOverTime);


  return NextResponse.json(returnObject[0], { status: 200 });
}