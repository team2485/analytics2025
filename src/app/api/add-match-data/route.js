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
      ScoutName, ScoutTeam, Team, Match, NoShow,
      AutoCoralTotal, AutoCoralSuccess, AutoAlgaeRemoved, AutoAlgaeAvgProcessor, AutoAlgaeAvgNet, AutoAlgaeSuccessProcessor, AutoAlgaeSuccessNet,
      TeleCoralTotal, TeleCoralSuccess, TeleAlgaeRemoved, TeleAlgaeAvgProcessor, TeleAlgaeAvgNet, TeleAlgaeSuccessProcessor, TeleAlgaeSuccessNet,
      TeleAvgHp, TeleSuccessHp,
      EndNone, EndPark, EndDeep, EndShallow, EndParkFail, AttemptCage, SuccessCage,
      CoralSpeed, ProcessorSpeed, NetSpeed, AlgaeRemovalSpeed, ClimbSpeed, Maneuverability, DefensePlayed, DefenseEvasion, Aggression, CageHazard,
      GeneralComments, BreakdownComments, DefenseComments
    )
    VALUES (
      ${body.scoutname}, ${body.scoutteam}, ${body.team}, ${body.match}, ${body.noshow},
      ${body.auto.coral.total}, ${body.auto.coral.success}, ${body.auto.algae.removed}, ${body.auto.algae.avgProcessor}, ${body.auto.algae.avgNet}, ${body.auto.algae.successProcessor}, ${body.auto.algae.successNet},
      ${body.tele.coral.total}, ${body.tele.coral.success}, ${body.tele.algae.removed}, ${body.tele.algae.avgProcessor}, ${body.tele.algae.avgNet}, ${body.tele.algae.successProcessor}, ${body.tele.algae.successNet},
      ${body.tele.avgHp}, ${body.tele.successHp},
      ${body.endPlacement.none}, ${body.endPlacement.park}, ${body.endPlacement.deep}, ${body.endPlacement.shallow}, ${body.endPlacement.parkandFail}, ${body.attemptCage}, ${body.successCage},
      ${body.qualitative.find((q) => q.name === "Coral Speed")?.rating || 0},
      ${body.qualitative.find((q) => q.name === "Processor Speed")?.rating || 0},
      ${body.qualitative.find((q) => q.name === "Net Speed")?.rating || 0},
      ${body.qualitative.find((q) => q.name === "Algae Removal Speed")?.rating || 0},
      ${body.qualitative.find((q) => q.name === "Climb Speed")?.rating || 0},
      ${body.qualitative.find((q) => q.name === "Maneuverability")?.rating || 0},
      ${body.qualitative.find((q) => q.name === "Defense Played")?.rating || 0},
      ${body.qualitative.find((q) => q.name === "Defense Evasion")?.rating || 0},
      ${body.qualitative.find((q) => q.name === "Aggression*")?.rating || 0},
      ${body.qualitative.find((q) => q.name === "Cage Hazard*")?.rating || 0},
      ${body.generalComments}, ${body.breakdownComments}, ${body.defenseComments}
    )`;

  return NextResponse.json({ message: "Success!" }, { status: 201 });
}