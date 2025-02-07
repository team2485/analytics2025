import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { calcAuto, calcTele, calcEnd } from "@/util/calculations";

export const revalidate = 300; // Cache for 300 seconds (5 minutes)

export async function GET() {
    let data = await sql`SELECT * FROM phr2025;`;
    const rows = data.rows;

    let responseObject = {};
    rows.forEach((row) => {
      if (!row.noshow) {
        let auto = calcAuto(row);
        let tele = calcTele(row);
        let end = calcEnd(row);

        if (responseObject[row.team] == undefined) {
          responseObject[row.team] = {
            team: row.team,
            teamName: "🤖", // Default name while FRC API is commented out
            auto: [auto], 
            tele: [tele], 
            end: [end],
            avgNotes: {
              coral: [row.autoCoralSuccess + row.teleCoralSuccess],
              algae: [row.autoAlgaeRemoved + row.teleAlgaeRemoved],
              processor: [row.autoAlgaeAvgProcessor + row.teleAlgaeAvgProcessor],
              net: [row.autoAlgaeAvgNet + row.teleAlgaeAvgNet],
            },
            passedNotes: [row.teleAvgHp],
            endgame: {
              none: row.endNone,
              park: row.endPark,
              deep: row.endDeep,
              shallow: row.endShallow,
              fail: row.endParkFail,
            },
            attemptCage: [row.attemptCage],
            successCage: [row.successCage],
            qualitative: {
              coralSpeed: [row.coralSpeed],
              processorSpeed: [row.processorSpeed],
              netSpeed: [row.netSpeed],
              algaeRemovalSpeed: [row.algaeRemovalSpeed],
              climbSpeed: [row.climbSpeed],
              maneuverability: [row.maneuverability],
              defensePlayed: [row.defensePlayed],
              defenseEvasion: [row.defenseEvasion],
              aggression: [row.aggression],
              cageHazard: [row.cageHazard],
            }
          };
        } else {
          let teamData = responseObject[row.team];
          teamData.auto.push(auto);
          teamData.tele.push(tele);
          teamData.end.push(end);
          teamData.passedNotes.push(row.teleAvgHp);
          teamData.avgNotes.coral.push(row.autoCoralSuccess + row.teleCoralSuccess);
          teamData.avgNotes.algae.push(row.autoAlgaeRemoved + row.teleAlgaeRemoved);
          teamData.avgNotes.processor.push(row.autoAlgaeAvgProcessor + row.teleAlgaeAvgProcessor);
          teamData.avgNotes.net.push(row.autoAlgaeAvgNet + row.teleAlgaeAvgNet);
          teamData.attemptCage.push(row.attemptCage);
          teamData.successCage.push(row.successCage);

          if (row.endNone) teamData.endgame.none++;
          if (row.endPark) teamData.endgame.park++;
          if (row.endDeep) teamData.endgame.deep++;
          if (row.endShallow) teamData.endgame.shallow++;
          if (row.endParkFail) teamData.endgame.fail++;

          teamData.qualitative.coralSpeed.push(row.coralSpeed);
          teamData.qualitative.processorSpeed.push(row.processorSpeed);
          teamData.qualitative.netSpeed.push(row.netSpeed);
          teamData.qualitative.algaeRemovalSpeed.push(row.algaeRemovalSpeed);
          teamData.qualitative.climbSpeed.push(row.climbSpeed);
          teamData.qualitative.maneuverability.push(row.maneuverability);
          teamData.qualitative.defensePlayed.push(row.defensePlayed);
          teamData.qualitative.defenseEvasion.push(row.defenseEvasion);
          teamData.qualitative.aggression.push(row.aggression);
          teamData.qualitative.cageHazard.push(row.cageHazard);
        }
      }
    });

    // **🔢 Function to Calculate Averages**
    const average = (array) => {
      let count = array.length;
      if (count == 0) return -1;
      let sum = array.reduce((acc, value) => acc + value, 0);
      return Math.round(sum * 10 / count) / 10;
    };

    // **📊 Compute Averages for Each Team**
    for (let team in responseObject) {
      let teamObject = responseObject[team];
      teamObject.auto = average(teamObject.auto);
      teamObject.tele = average(teamObject.tele);
      teamObject.end = average(teamObject.end);
      teamObject.passedNotes = average(teamObject.passedNotes);
      teamObject.avgNotes.coral = average(teamObject.avgNotes.coral);
      teamObject.avgNotes.algae = average(teamObject.avgNotes.algae);
      teamObject.avgNotes.processor = average(teamObject.avgNotes.processor);
      teamObject.avgNotes.net = average(teamObject.avgNotes.net);
      teamObject.attemptCage = average(teamObject.attemptCage);
      teamObject.successCage = average(teamObject.successCage);

      let { none, park, deep, shallow, fail } = teamObject.endgame;
      let locationSum = none + park + deep + shallow + fail;
      if (locationSum === 0) {
        teamObject.endgame = { none: 100, park: 0, deep: 0, shallow: 0, fail: 0 };
      } else {
        teamObject.endgame = {
          none: Math.round(100 * none / locationSum),
          park: Math.round(100 * park / locationSum),
          deep: Math.round(100 * deep / locationSum),
          shallow: Math.round(100 * shallow / locationSum),
          fail: Math.round(100 * fail / locationSum),
        };
      }

      teamObject.qualitative.coralSpeed = average(teamObject.qualitative.coralSpeed);
      teamObject.qualitative.processorSpeed = average(teamObject.qualitative.processorSpeed);
      teamObject.qualitative.netSpeed = average(teamObject.qualitative.netSpeed);
      teamObject.qualitative.algaeRemovalSpeed = average(teamObject.qualitative.algaeRemovalSpeed);
      teamObject.qualitative.climbSpeed = average(teamObject.qualitative.climbSpeed);
      teamObject.qualitative.maneuverability = average(teamObject.qualitative.maneuverability);
      teamObject.qualitative.defensePlayed = average(teamObject.qualitative.defensePlayed);
      teamObject.qualitative.defenseEvasion = average(teamObject.qualitative.defenseEvasion);
      teamObject.qualitative.aggression = average(teamObject.qualitative.aggression);
      teamObject.qualitative.cageHazard = average(teamObject.qualitative.cageHazard);
    }

    return NextResponse.json(responseObject, { status: 200 });
}