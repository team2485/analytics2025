// import { NextResponse } from "next/server";

// export async function GET(request) {
//     const { searchParams } = new URL(request.url)
//     const team = searchParams.get("team");
//     const match = searchParams.get("match");
//     const matchScheduleForTeam = await fetch("https://frc-api.firstinspires.org/v3.0/2024/schedule/CURIE?tournamentLevel=Qualification", {   
//         headers: {
//             "Authorization" : "Basic " + process.env.FIRST_AUTH_TOKEN,
//         }
//     }).then(resp => {
//         if(resp.status !== 200) {
//             return {}
//         }
//         return resp.json();
//     }).then(data => data.Schedule)
//     if (matchScheduleForTeam == undefined || matchScheduleForTeam.length == 0) {
//         return NextResponse.json({valid: true}, {status: 200});
//     }
//     console.log(matchScheduleForTeam)
//     let matchesWithTeamAndMatch = matchScheduleForTeam.filter(matchDetails => matchDetails.matchNumber == match && matchDetails.teams.map(teamData => {
//         return teamData.teamNumber;
//     }).includes(1*team))
//     let valid = (matchesWithTeamAndMatch.length > 0)
//     return NextResponse.json({valid}, {status: 200})
// }

