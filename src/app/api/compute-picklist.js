import { NextResponse } from "next/server";
import { sql } from '@vercel/postgres';
import { tidy, mutate, arrange, desc, mean, select, summarizeIf, summarizeAll, max, groupBy } from '@tidyjs/tidy';
import { calcAuto, calcTele, calcEnd, calcEPA } from "@/util/calculations"; // Update this file with new calculations

export async function POST(request) {
  const requestBody = await request.json(); // e.g.   [ ['EPA', '1'], ['Defense', '0.5'] ]

  let data = await sql`SELECT * FROM new_game_table;`; // Update with new database table name
  let rows = data.rows;

  // ============================
  //  FRC API FETCH - COMMENTED OUT FOR NOW 
  // ============================

  /*
  const frcAPITeamRankings = await fetch("https://frc-api.firstinspires.org/v3.0/2025/rankings/CURIE", {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + process.env.FIRST_AUTH_TOKEN, // Make sure to store the API key in .env
    }
  }).then(resp => {
    if (resp.status !== 200) {
      return { Rankings: [] }; // Return an empty array if the API fails
    }
    return resp.json();
  }).then(data => data.Rankings);
  */

  /*
  // Add FRC API Rankings to team data
  teamTable = teamTable.map(teamData => {
    let firstRanking = -1;
    let rankedData = frcAPITeamRankings.filter(rankedTeamData => rankedTeamData.teamNumber == teamData.team);
    if (rankedData.length == 1) {
      firstRanking = rankedData[0].rank;
    }
    return {
      ...teamData,
      firstRanking,
    };
  });
  */

  function byAveragingNumbers(index) {
    if (['breakdown', 'leave', 'noshow'].includes(index)) {
      return (arr) => arr.some(row => row[index] == true);
    }
    if (['scoutname', 'generalcomments', 'breakdowncomments', 'defensecomments'].includes(index)) {
      return (arr) => arr.map(row => row[index]).join();
    }
    if (['maneuverability', 'defenseevasion', 'coral', 'algae', 'cage', 'consistency'].includes(index)) {
      return (arr) => {
        let values = arr.filter(row => row[index] != -1 && row[index] != null && row[index] !== undefined).map(row => row[index]);
        if (values.length == 0) return -1;
        return values.reduce((sum, val) => sum + val, 0) / values.length;
      };
    }
    return mean(index);
  }

  let teamTable = tidy(rows,
    groupBy(['team', 'match'], [summarizeAll(byAveragingNumbers)])
  );
  
  teamTable = teamTable.filter(dr => dr.noshow == false);
  
  teamTable = tidy(teamTable, groupBy(['team'], [summarizeAll(byAveragingNumbers)]));

  function calcConsistency(dr) {
    let arr = [dr.coral, dr.algae, dr.cage, dr.consistency].filter(a => a != -1);
    if (arr.length == 0) return 0;
    return arr.reduce((sum, value) => sum + value, 0) / arr.length;
  }

  teamTable = tidy(teamTable,
    mutate({
      auto: calcAuto,
      tele: calcTele,
      end: calcEnd,
      epa: calcEPA, // New EPA calculation
      consistency: calcConsistency,
      defense: (d) => Math.max(d.defense, 0)
    }),
    select(['team', 'auto', 'tele', 'end', 'epa', 'cage', 'consistency', 'coral', 'algae', 'defense'])
  );

  const maxes = tidy(teamTable, summarizeIf((vector) => Number.isFinite(vector[0]), max))[0];

  teamTable = tidy(teamTable, mutate({
      auto: d => d.auto / maxes.auto,
      tele: d => d.tele / maxes.tele,
      end: d => d.end / maxes.end,
      epa: d => d.epa / maxes.epa,
      cage: d => d.cage / maxes.cage,
      consistency: d => d.consistency / maxes.consistency,
      coral: d => d.coral / maxes.coral,
      algae: d => d.algae / maxes.algae,
      defense: d => d.defense / maxes.defense,
      score: d => {
        let sum = 0;
        requestBody.forEach(weightPair => {
          let [weightName, weightValue] = weightPair;
          sum += (d[weightName] * weightValue) || 0;
        });
        return sum;
      }
    }),
    arrange(desc('score'))
  );

  // teamTable = teamTable.map(teamData => {
  //   let firstRanking = -1;
  //   let rankedData = frcAPITeamRankings.filter(rankedTeamData => rankedTeamData.teamNumber == teamData.team);
  //   if (rankedData.length == 1) {
  //     firstRanking = rankedData[0].rank;
  //   }
  //   return {
  //     ...teamData,
  //     firstRanking,
  //   }
  // });

  return NextResponse.json(teamTable, { status: 200 });
}