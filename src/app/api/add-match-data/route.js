import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import _ from "lodash";

export async function POST(req) {
  let body = await req.json();
  console.log(body);

  // **🔍 Pre-Match Validation**
  if (
    !(_.isString(body.scoutname) &&
      _.isNumber(body.scoutteam) &&
      _.isNumber(body.team) &&
      _.isNumber(body.match))
  ) {
    return NextResponse.json({ message: "Invalid Pre-Match Data!" }, { status: 400 });
  }

  // **🚫 No-Show Case - Just Insert Basic Data**
  if (body.noshow) {
    console.log("no show!");
    let resp = await sql`
      INSERT INTO phr2025 (ScoutName, ScoutTeam, Team, Match, NoShow)
      VALUES (${body.scoutname}, ${body.scoutteam}, ${body.team}, ${body.match}, ${body.noshow})`;
    return NextResponse.json({ message: "Success!" }, { status: 201 });
  }

  // **🔍 Auto Period Validation**
  if (
    !(_.isNumber(body.auto.coral.total) &&
      _.isNumber(body.auto.coral.success) &&
      _.isNumber(body.auto.algae.removed) &&
      _.isNumber(body.auto.algae.avgProcessor) &&
      _.isNumber(body.auto.algae.avgNet) &&
      _.isNumber(body.auto.algae.successProcessor) &&
      _.isNumber(body.auto.algae.successNet))
  ) {
    return NextResponse.json({ message: "Invalid Auto Data!" }, { status: 400 });
  }

  // **🔍 Teleop Period Validation**
  if (
    !(_.isNumber(body.tele.coral.total) &&
      _.isNumber(body.tele.coral.success) &&
      _.isNumber(body.tele.algae.removed) &&
      _.isNumber(body.tele.algae.avgProcessor) &&
      _.isNumber(body.tele.algae.avgNet) &&
      _.isNumber(body.tele.algae.successProcessor) &&
      _.isNumber(body.tele.algae.successNet) &&
      _.isNumber(body.tele.avgHp) &&
      _.isNumber(body.tele.successHp))
  ) {
    return NextResponse.json({ message: "Invalid Tele Data!" }, { status: 400 });
  }

  // **🔍 Endgame Validation**
  if (
    !(_.isNumber(body.endPlacement.none) &&
      _.isNumber(body.endPlacement.park) &&
      _.isNumber(body.endPlacement.deep) &&
      _.isNumber(body.endPlacement.shallow) &&
      _.isNumber(body.endPlacement.parkandFail) &&
      _.isNumber(body.attemptCage) &&
      _.isNumber(body.successCage))
  ) {
    return NextResponse.json({ message: "Invalid Endgame Data!" }, { status: 400 });
  }

  // Qualitative Metrics Validation**
  if (
    !(_.isArray(body.qualitative) &&
      body.qualitative.every((q) => _.isString(q.name) && _.isNumber(q.rating)))
  ) {
    return NextResponse.json({ message: "Invalid Qualitative Data!" }, { status: 400 });
  }

  // Comments Validation**
  if (
    !(_.isString(body.generalComments) &&
      (_.isString(body.breakdownComments) || _.isNull(body.breakdownComments)) &&
      (_.isString(body.defenseComments) || _.isNull(body.defenseComments)))
  ) {
    return NextResponse.json({ message: "Invalid Comments!" }, { status: 400 });
  }

  console.log(body.defenseComments);

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


