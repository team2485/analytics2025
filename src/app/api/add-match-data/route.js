import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import _ from "lodash";

export async function POST(req) {
  let body = await req.json();
  console.log(body);

  if (!(_.isString(body.scoutname) && _.isNumber(body.scoutteam) && _.isNumber(body.team) && _.isNumber(body.match) && _.isNumber(body.matchType))) {
    return NextResponse.json({ message: "Invalid Pre-Match Data!" }, { status: 400 });
  }
  
  // If no-show, add a basic row
  if (body.noshow) {
    console.log("no show!");
    let resp = await sql`
      INSERT INTO phr2025 (ScoutName, ScoutTeam, Team, Match, MatchType, NoShow)
      VALUES (${body.scoutname}, ${body.scoutteam}, ${body.team}, ${body.match}, ${body.matchtype}, ${body.noshow})
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
        ScoutName, ScoutTeam, Team, Match, MatchType, Breakdown, NoShow, Leave, AutoL1Scored, AutoL1Failed, AutoL2Scored, AutoL2Failed, AutoL3Scored, AutoL3Failed, AutoL4Scored, AutoL4Failed, AutoCoralScored, AutoCoralFailed, AutoAlgaeRemoved, AutoProcessorScored, AutoProcessorFailed, AutoNetScored, AutoNetFailed, TeleL1Scored, TeleL1Failed, TeleL2Scored, TeleL2Failed, TeleL3Scored, TeleL3Failed, TeleL4Scored, TeleL4Failed, TeleCoralScored, TeleCoralFailed, TeleAlgaeRemoved, TeleProcessorScored, TeleProcessorFailed, TeleNetScored, TeleNetFailed, HPScored, HPFailed, EndLocation, CoralSpeed, ProcessorSpeed, NetSpeed, AlgaeRemovalSpeed, ClimbSpeed, Maneuverability, DefensePlayed, DefenseEvasion, Aggression, CageHazard, CoralGrndIntake, CoralStationIntake, Lollipop, AlgaeGrndIntake, AlgaeHighReefIntake, AlgaeLowReefIntake, GeneralComments, BreakdownComments, DefenseComments
    )
    VALUES (
        ${body.scoutname}, ${body.scoutteam}, ${body.team}, ${body.match}, ${body.matchtype}, ${body.breakdown}, ${body.noshow}, ${body.leave}, 
        ${body.autol1scored}, ${body.autol1failed}, ${body.autol2scored}, ${body.autol2failed}, ${body.autol3scored}, ${body.autol3failed}, ${body.autol4scored}, ${body.autol4failed}, 
        ${body.autocoralscored}, ${body.autocoralfail}, ${body.autoalgaeremoved}, ${body.autoprocessorscored}, ${body.autoprocessorfailed}, ${body.autonetscored}, ${body.autonetfailed}, 
        ${body.telel1scored}, ${body.telel1failed}, ${body.telel2scored}, ${body.telel2failed}, ${body.telel3scored}, ${body.telel3failed}, ${body.telel4scored}, ${body.telel4failed}, 
        ${body.telecoralscored}, ${body.telecoralfail}, ${body.telealgaeremoved}, ${body.teleprocessorscored}, ${body.teleprocessorfailed}, ${body.telenetscored}, ${body.telenetfailed}, 
        ${body.hpscored}, ${body.hpfail}, ${body.endlocation}, ${body.coralspeed}, ${body.processorspeed}, ${body.netspeed}, ${body.algaeremovalspeed}, 
        ${body.climbspeed}, ${body.maneuverability}, ${body.defenseplayed}, ${body.defenseevasion}, ${body.aggression}, ${body.cagehazard}, 
        ${body.coralgrndintake}, ${body.coralstationintake}, ${body.lollipop}, ${body.algaegrndintake}, ${body.algaehighreefintake}, ${body.algaelowreefintake}, 
        ${body.generalcomments}, ${body.breakdowncomments}, ${body.defensecomments}
      )`;      

  return NextResponse.json({ message: "Success!" }, { status: 201 });
}


