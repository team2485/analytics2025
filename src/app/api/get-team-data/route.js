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
    auto: rec => rec.auto || 0,
    tele: rec => rec.tele || 0,
    end: rec => rec.end || 0,
    epa: rec => rec.auto + rec.tele + rec.end || 0
  }), arrange([asc('match')]));

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
    noShow: arr => percentValue(arr, 'noshow', true),
    defense: arr => percentValue(arr, 'defenseplayed', true),
    breakdown: arr => percentValue(arr, 'breakdown', true),
    lastBreakdown: arr => arr.filter(e => e.breakdowncomments !== null).reduce((a, b) => b.match, "N/A"),
    scouts: arr => rowsToArray(arr, 'scoutname'),
    generalComments: arr => rowsToArray(arr, 'generalcomments'),
    breakdownComments: arr => rowsToArray(arr, 'breakdowncomments'),
    defenseComments: arr => rowsToArray(arr, 'defensecomments'),

    auto: arr => ({
      leave: percentValue(arr, 'leave', true),
      autoOverTime: tidy(arr, select(['auto', 'match'])),
      coral: {
        total: median('autoL1success') + median('autoL2success') + median('autoL3success') + median('autoL4success'),
        success: percentValue(arr, 'autoL1success', true),
        avgL1: median('autoL1success'),
        avgL2: median('autoL2success'),
        avgL3: median('autoL3success'),
        avgL4: median('autoL4success'),
      },
      algae: {
        removed: median('autoalgaeremoved'),
        avgProcessor: median('autoprocessorsuccess'),
        avgNet: median('autonetsuccess'),
      },
    }),

    tele: arr => ({
      teleOverTime: tidy(arr, select(['tele', 'match'])),
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
      { name: "Coral Speed", rating: mean(rowsToArray(arr, 'coralspeed')) },
      { name: "Processor Speed", rating: mean(rowsToArray(arr, 'processorspeed')) },
      { name: "Net Speed", rating: mean(rowsToArray(arr, 'netspeed')) },
      { name: "Algae Removal Speed", rating: mean(rowsToArray(arr, 'algaeremovalspeed')) },
      { name: "Climb Speed", rating: mean(rowsToArray(arr, 'climbspeed')) },
      { name: "Maneuverability", rating: mean(rowsToArray(arr, 'maneuverability')) },
      { name: "Defense Played", rating: mean(rowsToArray(arr, 'defenseplayed')) },
      { name: "Defense Evasion", rating: mean(rowsToArray(arr, 'defenseevasion')) },
      { name: "Aggression*", rating: 5 - mean(rowsToArray(arr, 'aggression')) },
      { name: "Cage Hazard*", rating: 5 - mean(rowsToArray(arr, 'cagehazard')) },
    ],
  }));

  return NextResponse.json(returnObject[0], { status: 200 });
}