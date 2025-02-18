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
      scoutname, scoutteam, team, match, matchtype, breakdown, noshow, leave, autol1success, autol1fail, autol2success, autol2fail, autol3success, autol3fail, autol4success, autol4fail, autocoralsuccess, autocoralfail, autoalgaeremoved, autoprocessorsuccess, autoprocessorfail, autonetsuccess, autonetfail, telel1success, telel1fail, telel2success, telel2fail, telel3success, telel3fail, telel4success, telel4fail, telecoralsuccess, telecoralfail, telealgaeremoved, teleprocessorsuccess, teleprocessorfail, telenetsuccess, telenetfail, hpsuccess, hpfail, endlocation, coralspeed, processorspeed, netspeed, algaeremovalspeed, climbspeed, maneuverability, defenseplayed, defenseevasion, aggression, cagehazard, coralgrndintake, coralstationintake, lollipop, algaegrndintake, algaehighreefintake, algaelowreefintake, generalcomments, breakdowncomments, defensecomments
    )
    VALUES (
      ${body.scoutname}, ${body.scoutteam}, ${body.team}, ${body.match}, ${body.matchtype}, ${body.breakdown}, ${body.noshow}, ${body.leave}, 
      ${body.autol1success}, ${body.autol1fail}, ${body.autol2success}, ${body.autol2fail}, ${body.autol3success}, ${body.autol3fail}, ${body.autol4success}, ${body.autol4fail}, 
      ${body.autocoralsuccess}, ${body.autocoralfail}, ${body.autoalgaeremoved}, ${body.autoprocessorsuccess}, ${body.autoprocessorfail}, ${body.autonetsuccess}, ${body.autonetfail}, 
      ${body.telel1success}, ${body.telel1fail}, ${body.telel2success}, ${body.telel2fail}, ${body.telel3success}, ${body.telel3fail}, ${body.telel4success}, ${body.telel4fail}, 
      ${body.telecoralsuccess}, ${body.telecoralfail}, ${body.telealgaeremoved}, ${body.teleprocessorsuccess}, ${body.teleprocessorfail}, ${body.telenetsuccess}, ${body.telenetfail}, 
      ${body.hpsuccess}, ${body.hpfail}, ${body.endlocation}, ${body.coralspeed}, ${body.processorspeed}, ${body.netspeed}, ${body.algaeremovalspeed}, 
      ${body.climbspeed}, ${body.maneuverability}, ${body.defenseplayed}, ${body.defenseevasion}, ${body.aggression}, ${body.cagehazard}, 
      ${body.coralgrndintake}, ${body.coralstationintake}, ${body.lollipop}, ${body.algaegrndintake}, ${body.algaehighreefintake}, ${body.algaelowreefintake}, 
      ${body.generalcomments}, ${body.breakdowncomments}, ${body.defensecomments}
      )`;      

  return NextResponse.json({ message: "Success!" }, { status: 201 });
}


