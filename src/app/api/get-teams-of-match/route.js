import { NextResponse } from "next/server";
import _ from 'lodash';

export const revalidate = 60; //caches for 60 seconds, 1 minutes

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const matchNumber = searchParams.get("match");
  if (_.isNumber(+matchNumber) == false) {
    return NextResponse.json(
      { message: "Invalid match number" },
      { status: 400 }
    );
  }

  const matchData = await fetch("https://frc-api.firstinspires.org/v3.0/2024/schedule/CURIE?tournamentLevel=Qualification",{
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + process.env.FIRST_AUTH_TOKEN,
      }}
    ).then((resp) => {
      if (resp.status !== 200) {
        return { Schedule: [] };
      }
      return resp.json();
    }).then((data) => data.Schedule);
  
  let matchArr = matchData.filter(match => match.matchNumber == matchNumber);
  
  if (matchArr.length == 1) {
    let teams = matchArr[0].teams.map(teamData => teamData.teamNumber);
    return NextResponse.json({team1: teams[3], team2: teams[4], team3: teams[5], team4: teams[0], team5: teams[1], team6: teams[2]}, {status: 200});
  } else {
    return NextResponse.json({ message: "Failed to find match" }, { status: 200 })
  }
}
