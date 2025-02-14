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
  console.log(rows)

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


  function rowsToArray(x, index) {
    return x.map(row => row[index]).filter(val => val != null);
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
  console.log(rows[0].autol1success)

  function standardDeviation(arr, key) {
    const values = arr.map(row => row[key]).filter(v => v !== null && v !== undefined);
    const avg = mean(values);
    const variance = values.reduce((sum, value) => sum + Math.pow(value - avg, 2), 0) / values.length;
    return Math.sqrt(variance) || 0; // Avoid NaN if only one value
  }

  let returnObject = tidy(teamTable, summarize({
    team: first('team'),
    name: () => teamName,
    avgEpa: mean('epa'),
    avgAuto: mean('auto'),
    avgTele: mean('tele'),
    avgEnd: mean('end'),
    //add real data (mabe need to do calculations)
    last3Epa: arr => arr.slice(-3).reduce((sum, row) => sum + row.epa, 0) / Math.min(3, arr.length),
    last3Auto: arr => arr.slice(-3).reduce((sum, row) => sum + row.auto, 0) / Math.min(3, arr.length),
    last3Tele: arr => arr.slice(-3).reduce((sum, row) => sum + row.tele, 0) / Math.min(3, arr.length),
    last3End: arr => arr.slice(-3).reduce((sum, row) => sum + row.end, 0) / Math.min(3, arr.length),


    epaOverTime: arr => tidy(arr, select(['epa', 'match'])),
  
    consistency: arr => {
      let breakdownRate = percentValue(arr, 'breakdown', true) * 100;
      let epaStdDev = standardDeviation(arr, 'epa');
      return 100 - (breakdownRate + epaStdDev);
    },

    defense: arr => percentValue(arr, 'defenseplayed', true),
    lastBreakdown: arr => arr.filter(e => e.breakdowncomments !== null).reduce((a, b) => b.match, "N/A"),
    noShow: arr => percentValue(arr, 'noshow', true),
    breakdown: arr => percentValue(arr, 'breakdown', true),
    matchesScouted: () => matchesScouted,
    scouts: arr => rowsToArray(arr, 'scoutname'),
    generalComments: arr => rowsToArray(arr, 'generalcomments'),
    breakdownComments: arr => rowsToArray(arr, 'breakdowncomments'),
    defenseComments: arr => rowsToArray(arr, 'defensecomments'),
    autoOverTime: arr => tidy(arr, select(['match', 'auto'])),
    teleOverTime: arr => tidy(arr, select(['match', 'tele'])),
    leave: arr => arr.filter(e => e.leave === true).length / arr.length || 0,


    auto: arr => ({
      coral: {
        
        total: (() => rows.reduce((sum, row) => sum + ((row.autol1success || 0) + (row.autol2success || 0) + (row.autol3success || 0) + (row.autol4success || 0)), 0))(),

        success: (() => {
          const totalSuccess = rows.reduce((sum, row) => sum + ((row.autol1success || 0) + (row.autol2success || 0) + (row.autol3success || 0) + (row.autol4success || 0)), 0);
          const totalAttempts = rows.reduce((sum, row) => sum + ((row.autol1success || 0) + (row.autol2success || 0) + (row.autol3success || 0) + (row.autol4success || 0) + (row.autol1fail || 0) + (row.autol2fail || 0) + (row.autol3fail || 0) + (row.autol4fail || 0)), 0);
          return totalAttempts > 0 ? (totalSuccess / totalAttempts) * 100 : 0;
        })(),
        avgL1: (() => rows.length ? rows.reduce((sum, row) => sum + (row.telel1success || 0), 0) / rows.length : 0)(),
        avgL2: (() => rows.length ? rows.reduce((sum, row) => sum + (row.telel2success || 0), 0) / rows.length : 0)(),
        avgL3: (() => rows.length ? rows.reduce((sum, row) => sum + (row.telel3success || 0), 0) / rows.length : 0)(),
        avgL4: (() => rows.length ? rows.reduce((sum, row) => sum + (row.telel4success || 0), 0) / rows.length : 0)(),

        successL1: (() => {
          const successes = rows.reduce((sum, row) => sum + (row.telel1success || 0), 0);
          const totalAttempts = successes + rows.reduce((sum, row) => sum + (row.telel1fail || 0), 0);
          return totalAttempts > 0 ? (successes / totalAttempts) * 100 : 0;
        })(),

        successL2: (() => {
          const successes = rows.reduce((sum, row) => sum + (row.telel2success || 0), 0);
          const totalAttempts = successes + rows.reduce((sum, row) => sum + (row.telel2fail || 0), 0);
          return totalAttempts > 0 ? (successes / totalAttempts) * 100 : 0;
        })(),

        successL3: (() => {
          const successes = rows.reduce((sum, row) => sum + (row.telel3success || 0), 0);
          const totalAttempts = successes + rows.reduce((sum, row) => sum + (row.telel3fail || 0), 0);
          return totalAttempts > 0 ? (successes / totalAttempts) * 100 : 0;
        })(),

        successL4: (() => {
          const successes = rows.reduce((sum, row) => sum + (row.telel4success || 0), 0);
          const totalAttempts = successes + rows.reduce((sum, row) => sum + (row.telel4fail || 0), 0);
          return totalAttempts > 0 ? (successes / totalAttempts) * 100 : 0;
        })(),

        
      },
      algae: {
        removed: (() => rows.length ? rows.reduce((sum, row) => sum + (row.autoalgaeremoved || 0), 0) / rows.length : 0)(),
        avgProcessor: (() => rows.length ? rows.reduce((sum, row) => sum + (row.autoprocessorsuccess || 0), 0) / rows.length : 0)(),
        avgNet: (() => rows.length ? rows.reduce((sum, row) => sum + (row.autonetsuccess || 0), 0) / rows.length : 0)(),
      
        successProcessor: (() => {
          const successes = rows.reduce((sum, row) => sum + (row.autoprocessorsuccess || 0), 0);
          const totalAttempts = successes + rows.reduce((sum, row) => sum + (row.autoprocessorfail || 0), 0);
          return totalAttempts > 0 ? (successes / totalAttempts) * 100 : 0;
        })(),
      
        successNet: (() => {
          const successes = rows.reduce((sum, row) => sum + (row.autonetsuccess || 0), 0);
          const totalAttempts = successes + rows.reduce((sum, row) => sum + (row.autonetfail || 0), 0);
          return totalAttempts > 0 ? (successes / totalAttempts) * 100 : 0;
        })(),
      },
      
    }),

    tele: arr => ({
      coral: {
        total: (() => rows.reduce((sum, row) => sum + ((row.telel1success || 0) + (row.telel2success || 0) + (row.telel3success || 0) + (row.telel4success || 0)), 0))(),
        success: (() => {
          const totalSuccess = rows.reduce((sum, row) => sum + ((row.telel1success || 0) + (row.telel2success || 0) + (row.telel3success || 0) + (row.telel4success || 0)), 0);
          const totalAttempts = rows.reduce((sum, row) => sum + ((row.telel1success || 0) + (row.telel2success || 0) + (row.telel3success || 0) + (row.telel4success || 0) + (row.telel1fail || 0) + (row.telel2fail || 0) + (row.telel3fail || 0) + (row.telel4fail || 0)), 0);
          return totalAttempts > 0 ? (totalSuccess / totalAttempts) * 100 : 0;
        })(),
        
        avgL1: (() => rows.length ? rows.reduce((sum, row) => sum + (row.telel1success || 0), 0) / rows.length : 0)(),
        avgL2: (() => rows.length ? rows.reduce((sum, row) => sum + (row.telel2success || 0), 0) / rows.length : 0)(),
        avgL3: (() => rows.length ? rows.reduce((sum, row) => sum + (row.telel3success || 0), 0) / rows.length : 0)(),
        avgL4: (() => rows.length ? rows.reduce((sum, row) => sum + (row.telel4success || 0), 0) / rows.length : 0)(),

        successL1: (() => {
          const successes = rows.reduce((sum, row) => sum + (row.telel1success || 0), 0);
          const totalAttempts = successes + rows.reduce((sum, row) => sum + (row.telel1fail || 0), 0);
          return totalAttempts > 0 ? (successes / totalAttempts) * 100 : 0;
        })(),

        successL2: (() => {
          const successes = rows.reduce((sum, row) => sum + (row.telel2success || 0), 0);
          const totalAttempts = successes + rows.reduce((sum, row) => sum + (row.telel2fail || 0), 0);
          return totalAttempts > 0 ? (successes / totalAttempts) * 100 : 0;
        })(),

        successL3: (() => {
          const successes = rows.reduce((sum, row) => sum + (row.telel3success || 0), 0);
          const totalAttempts = successes + rows.reduce((sum, row) => sum + (row.telel3fail || 0), 0);
          return totalAttempts > 0 ? (successes / totalAttempts) * 100 : 0;
        })(),

        successL4: (() => {
          const successes = rows.reduce((sum, row) => sum + (row.telel4success || 0), 0);
          const totalAttempts = successes + rows.reduce((sum, row) => sum + (row.telel4fail || 0), 0);
          return totalAttempts > 0 ? (successes / totalAttempts) * 100 : 0;
        })(),

        
      },
      algae: {
        removed: (() => rows.length ? rows.reduce((sum, row) => sum + (row.telealgaeremoved || 0), 0) / rows.length : 0)(),
        avgProcessor: (() => rows.length ? rows.reduce((sum, row) => sum + (row.teleprocessorsuccess || 0), 0) / rows.length : 0)(),
        avgNet: (() => rows.length ? rows.reduce((sum, row) => sum + (row.telenetsuccess || 0), 0) / rows.length : 0)(),
      
        successProcessor: (() => {
          const successes = rows.reduce((sum, row) => sum + (row.teleprocessorsuccess || 0), 0);
          const totalAttempts = successes + rows.reduce((sum, row) => sum + (row.teleprocessorfail || 0), 0);
          return totalAttempts > 0 ? (successes / totalAttempts) * 100 : 0;
        })(),
      
        successNet: (() => {
          const successes = rows.reduce((sum, row) => sum + (row.telenetsuccess || 0), 0);
          const totalAttempts = successes + rows.reduce((sum, row) => sum + (row.telenetfail || 0), 0);
          return totalAttempts > 0 ? (successes / totalAttempts) * 100 : 0;
        })(),
      },
      
      avgHp: (() => rows.length ? rows.reduce((sum, row) => sum + (row.hpsuccess || 0), 0) / rows.length : 0)(),

      successHp: (() => {
        const successes = rows.reduce((sum, row) => sum + (row.hpsuccess || 0), 0);
        const totalAttempts = successes + rows.reduce((sum, row) => sum + (row.hpfail || 0), 0);
        return totalAttempts > 0 ? (successes / totalAttempts) * 100 : 0;
      })(),


    }),

    endPlacement: arr => ({
      none: percentValue(rows, 'endlocation', 0),
      park: percentValue(rows, 'endlocation', 1),
      shallow: percentValue(rows, 'endlocation', 2),
      deep: percentValue(rows, 'endlocation', 3),
      parkandFail: percentValue(rows, 'endlocation', 4),
    }),
    //do we still want?
    //do we still want
    //do we still want
    //do we still want
    //do we still want
    //do we still want
    //do we still want
    //do we still want

    attemptCage: arr => percentValue(rows, 'cageattempt', true),
    successCage: arr => percentValue(rows, 'cagesuccess', true),
    

    qualitative: arr => [
      { name: "Coral Speed", rating: rows.length ? rows.reduce((sum, row) => sum + (row.coralspeed || 0), 0) / rows.length : 0 },
      { name: "Processor Speed", rating: rows.length ? rows.reduce((sum, row) => sum + (row.processorspeed || 0), 0) / rows.length : 0 },
      { name: "Net Speed", rating: rows.length ? rows.reduce((sum, row) => sum + (row.netspeed || 0), 0) / rows.length : 0 },
      { name: "Algae Removal Speed", rating: rows.length ? rows.reduce((sum, row) => sum + (row.algaeremovalspeed || 0), 0) / rows.length : 0 },
      { name: "Climb Speed", rating: rows.length ? rows.reduce((sum, row) => sum + (row.climbspeed || 0), 0) / rows.length : 0 },
      { name: "Maneuverability", rating: rows.length ? rows.reduce((sum, row) => sum + (row.maneuverability || 0), 0) / rows.length : 0 },
      { name: "Defense Played", rating: rows.length ? rows.reduce((sum, row) => sum + (row.defenseplayed || 0), 0) / rows.length : 0 },
      { name: "Defense Evasion", rating: rows.length ? rows.reduce((sum, row) => sum + (row.defenseevasion || 0), 0) / rows.length : 0 },
      { name: "Aggression*", rating: rows.length ? 5 - (rows.reduce((sum, row) => sum + (row.aggression || 0), 0) / rows.length) : 0 },
      { name: "Cage Hazard*", rating: rows.length ? 5 - (rows.reduce((sum, row) => sum + (row.cagehazard || 0), 0) / rows.length) : 0 },
    ],

    // coralGroundIntake: rows.some(row => row.coralgrndintake === true) ? true : false,
    // coralStationIntake: rows.some(row => row.coralstationintake === true) ? true : false,
    // algaeGroundIntake: rows.some(row => row.algaegrndintake === true) ? true : false,
    // algaeLowReefIntake: rows.some(row => row.algaelowreefintake === true) ? true : false,
    // algaeHighReefIntake: rows.some(row => row.algaehighreefintake === true) ? true : false,
    // lollipop: rows.some(row => row.lollipop === true) ? true : false,



    
  }));
  returnObject[0] = {
    ...returnObject[0],
    coralGroundIntake: rows.some(row => row.coralgrndintake === true),
    coralStationIntake: rows.some(row => row.coralstationintake === true),
    algaeGroundIntake: rows.some(row => row.algaegrndintake === true),
    algaeLowReefIntake: rows.some(row => row.algaelowreefintake === true),
    algaeHighReefIntake: rows.some(row => row.algaehighreefintake === true),
    lollipop: rows.some(row => row.lollipop === true),
  };

  console.log("Backend End Placement:", returnObject[0]);


  return NextResponse.json(returnObject[0], { status: 200 });
}