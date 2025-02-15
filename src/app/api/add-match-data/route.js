import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import _ from "lodash";

export async function POST(req) {
  let body = await req.json();
  console.log(body);

  // Adjust match number based on match type
  let adjustedMatch = body.match;
  switch (body.matchType) {
    case 0: // pre-comp
      adjustedMatch = body.match - 100;
      break;
    case 1: // practice
      adjustedMatch = body.match - 50;
      break;
    case 2: // qual (no change)
      adjustedMatch = body.match;
      break;
    case 3: // elim
      adjustedMatch = body.match + 50;
      break;
  }

  if (!(_.isString(body.scoutname) && _.isNumber(body.scoutteam) && _.isNumber(body.team) && _.isNumber(adjustedMatch) && _.isNumber(body.matchType))) {
    return NextResponse.json({ message: "Invalid Pre-Match Data!" }, { status: 400 });
  }
  
  // If no-show, add a basic row
  if (body.noshow) {
    console.log("no show!");
    let resp = await sql`
      INSERT INTO phr2025 (ScoutName, ScoutTeam, Team, Match, MatchType, NoShow)
      VALUES (${body.scoutname}, ${body.scoutteam}, ${body.team}, ${adjustedMatch}, ${body.matchtype}, ${body.noshow})
    `;
    return NextResponse.json({ message: "Success!" }, { status: 201 });
  }
  
  // Check Auto Data
  if (
    !(
      _.isNumber(body.autoL1success) &&
      _.isNumber(body.autoL1fail) &&
      _.isNumber(body.autoL2success) &&
      _.isNumber(body.autoL2fail) &&
      _.isNumber(body.autoL3success) &&
      _.isNumber(body.autoL3fail) &&
      _.isNumber(body.autoL4success) &&
      _.isNumber(body.autoL4fail) &&
      _.isNumber(body.autoprocessorsuccess) &&
      _.isNumber(body.autoprocessorfail) &&
      _.isNumber(body.autonetsuccess) &&
      _.isNumber(body.autonetfail)
    )
  ) {
    return NextResponse.json({ message: "Invalid Auto Data!" }, { status: 400 });
  }
  
  // Check Tele Data
  if (
    !(
      _.isNumber(body.teleL1success) &&
      _.isNumber(body.teleL1fail) &&
      _.isNumber(body.teleL2success) &&
      _.isNumber(body.teleL2fail) &&
      _.isNumber(body.teleL3success) &&
      _.isNumber(body.teleL3fail) &&
      _.isNumber(body.teleL4success) &&
      _.isNumber(body.teleL4fail) &&
      _.isNumber(body.telealgaeremoved) &&
      _.isNumber(body.teleprocessorsuccess) &&
      _.isNumber(body.teleprocessorfail) &&
      _.isNumber(body.telenetsuccess) &&
      _.isNumber(body.telenetfail)
    )
  ) {
    return NextResponse.json({ message: "Invalid Tele Data!" }, { status: 400 });
  }
  
  // Check Endgame Data
  if (
    !(
      _.isNumber(body.endlocation) &&
      _.isNumber(body.coralspeed) &&
      _.isNumber(body.processorspeed) &&
      _.isNumber(body.netspeed) &&
      _.isNumber(body.algaeremovalspeed) &&
      _.isNumber(body.climbspeed)    )
  ) {
    return NextResponse.json({ message: "Invalid Endgame Data!" }, { status: 400 });
  }
  
  // Check Qualitative Data
  
  // Check Comments
  if (
    !(
      _.isString(body.generalcomments) &&
      (_.isString(body.breakdowncomments) || _.isNull(body.breakdowncomments)) &&
      (_.isString(body.defensecomments) || _.isNull(body.defensecomments))
    )
  ) {
    return NextResponse.json({ message: "Invalid Comments!" }, { status: 400 });
  }
  
  console.log(body.defensecomments);
  
  // Insert Data into Database**
  let resp = await sql`
    INSERT INTO phr2025 (
        ScoutName, ScoutTeam, Team, Match, MatchType, Breakdown, NoShow, Leave, AutoL1Success, AutoL1fail, AutoL2Success, AutoL2fail, AutoL3Success, AutoL3fail, AutoL4Success, AutoL4fail, AutoCoralSuccess, AutoCoralfail, AutoAlgaeRemoved, AutoProcessorSuccess, AutoProcessorfail, AutoNetSuccess, AutoNetfail, TeleL1Success, TeleL1fail, TeleL2Success, TeleL2fail, TeleL3Success, TeleL3fail, TeleL4Success, TeleL4fail, TeleCoralSuccess, TeleCoralfail, TeleAlgaeRemoved, TeleProcessorSuccess, TeleProcessorfail, TeleNetSuccess, TeleNetfail, HPSuccess, HPfail, EndLocation, CoralSpeed, ProcessorSpeed, NetSpeed, AlgaeRemovalSpeed, ClimbSpeed, Maneuverability, DefensePlayed, DefenseEvasion, Aggression, CageHazard, CoralGrndIntake, CoralStationIntake, Lollipop, AlgaeGrndIntake, AlgaeHighReefIntake, AlgaeLowReefIntake, GeneralComments, BreakdownComments, DefenseComments
    )
    VALUES (
        ${body.scoutname}, ${body.scoutteam}, ${body.team}, ${body.match}, ${body.matchtype}, ${body.breakdown}, ${body.noshow}, ${body.leave}, 
        ${body.autol1Success}, ${body.autol1fail}, ${body.autol2Success}, ${body.autol2fail}, ${body.autol3Success}, ${body.autol3fail}, ${body.autol4Success}, ${body.autol4fail}, 
        ${body.autocoralSuccess}, ${body.autocoralfail}, ${body.autoalgaeremoved}, ${body.autoprocessorSuccess}, ${body.autoprocessorfail}, ${body.autonetSuccess}, ${body.autonetfail}, 
        ${body.telel1Success}, ${body.telel1fail}, ${body.telel2Success}, ${body.telel2fail}, ${body.telel3Success}, ${body.telel3fail}, ${body.telel4Success}, ${body.telel4fail}, 
        ${body.telecoralSuccess}, ${body.telecoralfail}, ${body.telealgaeremoved}, ${body.teleprocessorSuccess}, ${body.teleprocessorfail}, ${body.telenetSuccess}, ${body.telenetfail}, 
        ${body.hpSuccess}, ${body.hpfail}, ${body.endlocation}, ${body.coralspeed}, ${body.processorspeed}, ${body.netspeed}, ${body.algaeremovalspeed}, 
        ${body.climbspeed}, ${body.maneuverability}, ${body.defenseplayed}, ${body.defenseevasion}, ${body.aggression}, ${body.cagehazard}, 
        ${body.coralgrndintake}, ${body.coralstationintake}, ${body.lollipop}, ${body.algaegrndintake}, ${body.algaehighreefintake}, ${body.algaelowreefintake}, 
        ${body.generalcomments}, ${body.breakdowncomments}, ${body.defensecomments}
      )`;      

  return NextResponse.json({ message: "Success!" }, { status: 201 });
}


