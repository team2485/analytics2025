import { NextResponse } from "next/server";
import { sql } from '@vercel/postgres';
import { tidy, mutate, arrange, desc, mean, select, summarizeAll, max, groupBy } from '@tidyjs/tidy';
import { calcAuto, calcTele, calcEnd, calcEPA } from "@/util/calculations";

export async function POST(request) {
  const requestBody = await request.json(); // Weight inputs

  let data = await sql`SELECT * FROM phr2025;`;
  let rows = data.rows;

  // Average numerical fields and handle exceptions
  function averageField(index) {
    if (['breakdown', 'leave', 'noshow'].includes(index)) return arr => arr.some(row => row[index] === true);
    if (['scoutname', 'generalcomments', 'breakdowncomments', 'defensecomments'].includes(index)) return arr => arr.map(row => row[index]).join(', ');
    const validValues = arr => arr.map(row => row[index]).filter(val => val != null && !isNaN(val));
    return arr => validValues(arr).length > 0 ? validValues(arr).reduce((sum, v) => sum + v, 0) / validValues(arr).length : 0;
  }

  let teamTable = tidy(rows, groupBy(['team', 'match'], [summarizeAll(averageField)]));
  teamTable = teamTable.filter(dr => !dr.noshow);
  teamTable = tidy(teamTable, groupBy(['team'], [summarizeAll(averageField)]));

  const calcConsistency = (dr) => {
    const arr = [dr.coral, dr.algae, dr.cage, dr.consistency].filter(a => a >= 0);
    return arr.length > 0 ? arr.reduce((sum, value) => sum + value, 0) / arr.length : 0;
  };

  teamTable = tidy(teamTable, mutate({
    auto: d => calcAuto({
      autoL1success: d.autoL1success || 0,
      autoL2success: d.autoL2success || 0,
      autoL3success: d.autoL3success || 0,
      autoL4success: d.autoL4success || 0,
      autoprocessorsuccess: d.autoprocessorsuccess || 0,
      autonetsuccess: d.autonetsuccess || 0,
      leave: d.leave || false,
    }),
    tele: d => calcTele({
      teleL1success: d.teleL1success || 0,
      teleL2success: d.teleL2success || 0,
      teleL3success: d.teleL3success || 0,
      teleL4success: d.teleL4success || 0,
      telealgaeprocessor: d.telealgaeprocessor || 0,
      telealgaenet: d.telealgaenet || 0,
      hpsuccess: d.hpsuccess || 0,
    }),
    end: d => calcEnd({
      endlocation: d.endlocation || 0,
      cagesuccess: d.cagesuccess || 0,
    }),
    epa: d => calcEPA({
      autoL1success: d.autoL1success || 0,
      autoL2success: d.autoL2success || 0,
      autoL3success: d.autoL3success || 0,
      autoL4success: d.autoL4success || 0,
      autoprocessorsuccess: d.autoprocessorsuccess || 0,
      autonetsuccess: d.autonetsuccess || 0,
      leave: d.leave || false,
      teleL1success: d.teleL1success || 0,
      teleL2success: d.teleL2success || 0,
      teleL3success: d.teleL3success || 0,
      teleL4success: d.teleL4success || 0,
      telealgaeprocessor: d.telealgaeprocessor || 0,
      telealgaenet: d.telealgaenet || 0,
      hpsuccess: d.hpsuccess || 0,
      endlocation: d.endlocation || 0,
      cagesuccess: d.cagesuccess || 0,
    }),
    consistency: d => calcConsistency(d),
    defense: d => Math.max(d.defense || 0, 0)
}), select(['team', 'auto', 'tele', 'end', 'epa', 'cage', 'consistency', 'coral', 'algae', 'defense']));


  
 // Fetch TBA Rankings
 async function getTBARankings() {
  try {
    const response = await fetch(`https://www.thebluealliance.com/api/v3/event/2025caph/rankings`, {
      headers: {
        'X-TBA-Auth-Key': process.env.TBA_AUTH_KEY,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      console.error(`TBA API Error: ${response.status}`);
      return []; // Return empty array if API fails
    }

    const data = await response.json();
    return data.rankings.map(team => ({
      teamNumber: team.team_key.replace('frc', ''),
      rank: team.rank
    }));
  } catch (error) {
    console.error('Error fetching TBA rankings:', error);
    return [];
  }
}

// Get rankings and add them to team data
try {
  const tbaRankings = await getTBARankings();
  teamTable = teamTable.map(teamData => {
    const rankedData = tbaRankings.find(rankedTeam => 
      rankedTeam.teamNumber == teamData.team
    );
    
    return {
      ...teamData,
      tbaRank: rankedData ? rankedData.rank : -1
    };
  });
} catch (error) {
  console.error('Error updating rankings:', error);
  // Continue without rankings if there's an error
}

  console.log(teamTable)
  const maxes = tidy(teamTable, summarizeAll(max))[0];

  teamTable = tidy(teamTable, mutate({
    auto: d => maxes.auto ? d.auto / maxes.auto : 0,
    tele: d => maxes.tele ? d.tele / maxes.tele : 0,
    end: d => maxes.end ? d.end / maxes.end : 0,
    epa: d => maxes.epa ? d.epa / maxes.epa : 0,
    cage: d => maxes.cage ? d.cage / maxes.cage : 0,
    consistency: d => maxes.consistency ? d.consistency / maxes.consistency : 0,
    coral: d => maxes.coral ? d.coral / maxes.coral : 0,
    algae: d => maxes.algae ? d.algae / maxes.algae : 0,
    defense: d => maxes.defense ? d.defense / maxes.defense : 0,
    score: d => requestBody.reduce((sum, [key, weight]) => sum + ((d[key] || 0) * parseFloat(weight)), 0)
  }), arrange(desc('score')));

  return NextResponse.json(teamTable, { status: 200 });
}




// // Update team data with rankings
// async function updateTeamRankings(teamTable) {
//   const firstRankings = await getTBARankings;

//   return teamTable.map(teamData => {
//     let firstRanking = -1;
//     let rankedData = firstRankings.filter(rankedTeamData => 
//       rankedTeamData.teamNumber == teamData.team
//     );
    
//     if (rankedData.length == 1) {
//       firstRanking = rankedData[0].rank;
//     }
    
//     return {
//       ...teamData,
//       firstRanking,
//     };
//   });
// }

// const frcAPITeamRankings = await fetch("https://frc-api.firstinspires.org/v3.0/2025/rankings/CURIE", {
//   headers: {
//     'Content-Type': 'application/json',
//     'Authorization': 'Basic ' + process.env.FIRST_AUTH_TOKEN, // Make sure to store the API key in .env
//   }
// }).then(resp => {
//   if (resp.status !== 200) {
//     return { Rankings: [] }; // Return an empty array if the API fails
//   }
//   return resp.json();
// }).then(data => data.Rankings);
// */

// /*
// // Add FRC API Rankings to team data
// teamTable = teamTable.map(teamData => {
//   let firstRanking = -1;
//   let rankedData = frcAPITeamRankings.filter(rankedTeamData => rankedTeamData.teamNumber == teamData.team);
//   if (rankedData.length == 1) {
//     firstRanking = rankedData[0].rank;
//   }
//   return {
//     ...teamData,
//     firstRanking,
//   };
// });