'use client';
import { Suspense, useState, useEffect } from "react";
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, ResponsiveContainer, Cell, LineChart, Line, RadarChart, PolarRadiusAxis, PolarAngleAxis, PolarGrid, Radar, Legend } from 'recharts';
import { VictoryPie } from "victory";
import Link from "next/link";
import styles from "./page.module.css"
import { useSearchParams } from "next/navigation";
import PiecePlacement from "./components/PiecePlacement";
import dynamic from 'next/dynamic';
import Endgame from "./components/Endgame";


export default function MatchViewPage() {
  return <Suspense>
    <MatchView></MatchView>
  </Suspense>
}

function MatchView() {
  const [allData, setAllData] = useState(null);
  const searchParams = useSearchParams();
  const COLORS = [
    ["#B7F7F2", "#A1E7E1", "#75C6BF", "#58ada6", "#458782"],
    ["#8AB8FD", "#7D99FF", "#6184DD", "#306BDD", "#2755b0"],
    ["#E1BFFA", "#E1A6FE", "#CA91F2", "#b273d9", "#A546DF"],
    ["#FFC6F6", "#ECA6E0", "#ED75D9", "#db51c5", "#C342AE"],
    ["#FABFC4", "#FEA6AD", "#F29199", "#E67983", "#db606b"],
    ["#FFE3D3", "#EBB291", "#E19A70", "#D7814F", "#c26d3c"],
  ];

  const defaultTeam = {
    team: 404,
    teamName: "Invisibotics 👻",
    auto: 0,
    tele: 0,
    end: 0,
    avgPieces: {
      L1: 0,
      L2: 0,
      L3: 0,
      L4: 0,
      net: 0, 
      processor: 0,
      HP: 0,
    },
    removedAlgae: 0,
    endgame: { none: 100, park: 0, shallow: 0, deep: 0, fail: 0, multicage:0 },
    qualitative: { coralspeed: 0, processorspeed: 0, netspeed: 0, algaeremovalspeed: 0, climbspeed: 0, maneuverability: 0, defenseplayed: 0, defenseevasion: 0, aggression: 0, cagehazard: 0 }
  };

  // Static data instead of fetching
  const data = {
    team1: {
      team: 2485,
      teamName: "Overclocked",
      auto: 30,
      tele: 22,
      end: 10,
      avgPieces: {
        L1: 3,
        L2: 2,
        L3: 5,
        L4: 7,
        net:10, 
        processor: 1,
        HP: 0,
      },
      removedAlgae: 4,
      endgame: { none: 10, park: 13, shallow: 35, deep: 7, fail: 15, multicage: 20 },
      qualitative: { coralspeed: 5, processorspeed: 2, netspeed: 3, algaeremovalspeed: 5, climbspeed: 0, maneuverability: 1, defenseplayed: 4, defenseevasion: 2, aggression: 4, cagehazard: 3 }
    },
    team2: {
      team: 404,
      teamName: "Invisibotics 👻",
      auto: 0,
      tele: 0,
      end: 0,
      avgPieces: {
        L1: 0,
        L2: 0,
        L3: 0,
        L4: 0,
        net:0, 
        processor: 0,
        HP: 0,
      },
      removedAlgae: 0,
      endgame: { none: 100, park: 0, shallow: 0, deep: 0, fail: 0, multicage:0 },
      qualitative: { coralspeed: 0, processorspeed: 0, netspeed: 0, algaeremovalspeed: 0, climbspeed: 0, maneuverability: 0, defenseplayed: 0, defenseevasion: 0, aggression: 0, cagehazard: 0 }
    },
    team3: {
      team: 404,
      teamName: "Invisibotics 👻",
      auto: 0,
      tele: 0,
      end: 0,
      avgPieces: {
        L1: 0,
        L2: 0,
        L3: 0,
        L4: 0,
        net:0, 
        processor: 0,
        HP: 0,
      },
      removedAlgae: 0,
      endgame: { none: 100, park: 0, shallow: 0, deep: 0, fail: 0, multicage:0 },
      qualitative: { coralspeed: 0, processorspeed: 0, netspeed: 0, algaeremovalspeed: 0, climbspeed: 0, maneuverability: 0, defenseplayed: 0, defenseevasion: 0, aggression: 0, cagehazard: 0 }
    },
    team4: {
      team: 404,
      teamName: "Invisibotics 👻",
      auto: 0,
      tele: 0,
      end: 0,
      avgPieces: {
        L1: 0,
        L2: 0,
        L3: 0,
        L4: 0,
        net:0, 
        processor: 0,
        HP: 0,
      },
      removedAlgae: 0,
      endgame: { none: 100, park: 0, shallow: 0, deep: 0, fail: 0, multicage:0 },
      qualitative: { coralspeed: 0, processorspeed: 0, netspeed: 0, algaeremovalspeed: 0, climbspeed: 0, maneuverability: 0, defenseplayed: 0, defenseevasion: 0, aggression: 0, cagehazard: 0 }
    },
    team5: {
      team: 404,
      teamName: "Invisibotics 👻",
      auto: 0,
      tele: 0,
      end: 0,
      avgPieces: {
        L1: 0,
        L2: 0,
        L3: 0,
        L4: 0,
        net:0, 
        processor: 0,
        HP: 0,
      },
      removedAlgae: 0,
      endgame: { none: 100, park: 0, shallow: 0, deep: 0, fail: 0, multicage:0 },
      qualitative: { coralspeed: 0, processorspeed: 0, netspeed: 0, algaeremovalspeed: 0, climbspeed: 0, maneuverability: 0, defenseplayed: 0, defenseevasion: 0, aggression: 0, cagehazard: 0 }
    },
    team6: {
      team: 404,
      teamName: "Invisibotics 👻",
      auto: 0,
      tele: 0,
      end: 0,
      avgPieces: {
        L1: 0,
        L2: 0,
        L3: 0,
        L4: 0,
        net:0, 
        processor: 0,
        HP: 0,
      },
      removedAlgae: 0,
      endgame: { none: 100, park: 0, shallow: 0, deep: 0, fail: 0, multicage:0 },
      qualitative: { coralspeed: 0, processorspeed: 0, netspeed: 0, algaeremovalspeed: 0, climbspeed: 0, maneuverability: 0, defenseplayed: 0, defenseevasion: 0, aggression: 0, cagehazard: 0 }
    },
  };


//setData based on teams selected
useEffect(() => {
  if (searchParams && allData) {
    //search by teams
    let [team1, team2, team3, team4, team5, team6] = [
      searchParams.get("team1"),
      searchParams.get("team2"),
      searchParams.get("team3"),
      searchParams.get("team4"),
      searchParams.get("team5"),
      searchParams.get("team6")
    ];
    setData({
      team1: allData[team1],
      team2: allData[team2],
      team3: allData[team3],
      team4: allData[team4],
      team5: allData[team5],
      team6: allData[team6]
    });
  }
}, [searchParams, allData]);

//until url loads show loading
if (!data || searchParams == null) {
  return (
    <div>
      <h1>Loading...</h1>
    </div>
  );
}

//show form if systems are not a go
if (searchParams.get("go") != "go") {
  return (
    <div>
      <form className={styles.teamForm}>
        <span>View by Teams...</span>
        <div className={styles.horizontalBox}>
          <div>
            <label htmlFor="team1">Red 1:</label>
            <br />
            <input id="team1" name="team1" defaultValue={searchParams.get("team1")}></input>
          </div>
          <div>
            <label htmlFor="team2">Red 2:</label>
            <br />
            <input id="team2" name="team2" defaultValue={searchParams.get("team2")}></input>
          </div>
          <div>
            <label htmlFor="team3">Red 3:</label>
            <br />
            <input id="team3" name="team3" defaultValue={searchParams.get("team3")}></input>
          </div>
          <div>
            <label htmlFor="team4">Blue 1:</label>
            <br />
            <input id="team4" name="team4" defaultValue={searchParams.get("team4")}></input>
          </div>
          <div>
            <label htmlFor="team5">Blue 2:</label>
            <br />
            <input id="team5" name="team5" defaultValue={searchParams.get("team5")}></input>
          </div>
          <div>
            <label htmlFor="team6">Blue 3:</label>
            <br />
            <input id="team6" name="team6" defaultValue={searchParams.get("team6")}></input>
          </div>
          <input type="hidden" name="go" value="go"></input>
        </div>
        <button>Go!</button>
      </form>
    </div>
  );
}


  function AllianceButtons({t1, t2, t3, colors}) {
    return <div className={styles.allianceBoard}>
      <Link href={`/team-view?team=${t1.team}`}>
        <button style={{background: colors[0][1]}}>{t1.team}</button>
      </Link>
      <Link href={`/team-view?team=${t2.team}`}>
        <button style={{background: colors[1][1]}}>{t2.team}</button>
      </Link>
      <Link href={`/team-view?team=${t3.team}`}>
        <button style={{background: colors[2][1]}}>{t3.team}</button>
      </Link>
    </div>
  }

  function AllianceDisplay({teams, opponents, colors}) {
    const auto = (teams[0]?.auto || 0) + (teams[1]?.auto || 0) + (teams[2]?.auto || 0);
    const tele = (teams[0]?.tele || 0) + (teams[1]?.tele || 0) + (teams[2]?.tele || 0);
    const end = (teams[0]?.end || 0) + (teams[1]?.end || 0) + (teams[2]?.end || 0);

    const RGBColors = {
      red: "#FF9393",
      green: "#BFFEC1",
      yellow: "#FFDD9A"
    }

    const teamEPA = (team) => team ? team.auto + team.tele + team.end : 0;
    const opponentsEPA = teamEPA(opponents[0]) + teamEPA(opponents[1]) + teamEPA(opponents[2]);
    const currentAllianceEPA = auto + tele + end;
    let RP_WIN = RGBColors.red;
    if (currentAllianceEPA > opponentsEPA) RP_WIN = RGBColors.green;
    else if (currentAllianceEPA == opponentsEPA) RP_WIN = RGBColors.yellow;

    //ADD AUTO, CORAL, AND BARGE RPS

    return <div className={styles.lightBorderBox}>
      <div className={styles.scoreBreakdownContainer}>
        <div style={{background: colors[0]}} className={styles.EPABox}>{Math.round(10*(auto + tele + end))/10}</div>
        <div className={styles.EPABreakdown}>
          <div style={{background: colors[1]}}>A: {Math.round(10*auto)/10}</div>
          <div style={{background: colors[1]}}>T: {Math.round(10*tele)/10}</div>
          <div style={{background: colors[1]}}>E: {Math.round(10*end)/10}</div>
        </div>
      </div>
      <div className={styles.RPs}>
        <div style={{background: colors[1]}}>RPs:</div>
        <div style={{background: "red"}}>Auto</div>
        <div style={{background: "red"}}>Coral</div>
        <div style={{background: "red"}}>Barge</div>
        <div style={{background: RP_WIN}}>Victory</div>
      </div>
    </div>
    
  }

  function TeamDisplay({teamData, colors, matchMax}) {

    const PiecePlacement = dynamic(() => import('./components/PiecePlacement'), { ssr: false });
    const endgameData = [
      { x: 'None', y: teamData.endgame.none },
      { x: 'Fail', y: teamData.endgame.fail},
      { x: 'Park', y: teamData.endgame.park },
      { x: 'Shallow', y: teamData.endgame.shallow },
      { x: 'Deep', y: teamData.endgame.deep },
      { x: 'Multi', y: teamData.endgame.multicage },
    ];

    /* <VictoryPie
          padding={100}
          data={endgameData}
          colorScale={colors}
          labels={({ datum }) => `${datum.x}: ${Math.round(datum.y)}%`}
        />
        
              <div className={styles.graphContainer}>
          <RadarChart outerRadius={75} width={370} height={300} data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="qual" fontSize={14}/>
            <PolarRadiusAxis angle={10} domain={[0, 5]} />
            <Radar name={data.team1?.team || "-1"} dataKey="team1" stroke={COLORS[3][0]} fill={COLORS[3][3]} fillOpacity={0.3} />
            <Radar name={data.team2?.team || "-1"} dataKey="team2" stroke={COLORS[4][0]} fill={COLORS[4][3]} fillOpacity={0.3} />
            <Radar name={data.team3?.team || "-1"} dataKey="team3" stroke={COLORS[5][0]} fill={COLORS[5][3]} fillOpacity={0.3} />
            <Legend />
          </RadarChart>
        </div>
        <div className={styles.graphContainer}>
          <RadarChart outerRadius={75} width={370} height={300} data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="qual" fontSize={14}/>
            <PolarRadiusAxis angle={10} domain={[0, 5]} />
            <Radar name={data.team4?.team || "-1"} dataKey="team4" stroke={COLORS[0][0]} fill={COLORS[0][3]} fillOpacity={0.3} />
            <Radar name={data.team5?.team || "-1"} dataKey="team5" stroke={COLORS[1][0]} fill={COLORS[1][3]} fillOpacity={0.3} />
            <Radar name={data.team6?.team || "-1"} dataKey="team6" stroke={COLORS[2][0]} fill={COLORS[2][3]} fillOpacity={0.3} />
            <Legend />
          </RadarChart>
        </div>
        */

    return <div className={styles.lightBorderBox}>
      <h1 style={{color: colors[3]}}>{teamData.team}</h1>
      <h2 style={{color: colors[3]}}>{teamData.teamName}</h2>
      <div className={styles.scoreBreakdownContainer}>
        <div style={{background: colors[0]}} className={styles.EPABox}>
          {Math.round(10*(teamData.auto + teamData.tele + teamData.end))/10}
        </div>
        <div className={styles.EPABreakdown}>
          <div style={{background: colors[1]}}>A: {Math.round(10*teamData.auto)/10}</div>
          <div style={{background: colors[1]}}>T: {Math.round(10*teamData.tele)/10}</div>
          <div style={{background: colors[1]}}>E: {Math.round(10*teamData.end)/10}</div>
        </div>
      </div>
      <div className={styles.barchartContainer}>
        <h2>Average Piece Placement</h2>
        <PiecePlacement matchMax={matchMax} L1={teamData.avgPieces.L1}L2={teamData.avgPieces.L2}L3={teamData.avgPieces.L3} L4={teamData.avgPieces.L4} net={teamData.avgPieces.net}processor={teamData.avgPieces.processor}HP={teamData.avgPieces.HP}/>
      </div>
      <div className={styles.chartContainer}>
        <h2 style={{marginBottom: "-40px"}}>Endgame %</h2>
        <Endgame endgameData={endgameData}/>
      </div>
    </div>
  }
    let get = (alliance, thing) => {
    let sum = 0;
    if (alliance[0] && alliance[0][thing]) sum += alliance[0][thing];
    if (alliance[1] && alliance[1][thing]) sum += alliance[1][thing];
    if (alliance[2] && alliance[2][thing]) sum += alliance[2][thing];
    return sum;
  }
  const redAlliance = [data.team1 || defaultTeam, data.team2 || defaultTeam, data.team3 || defaultTeam];
  const blueAlliance = [data.team4 || defaultTeam, data.team5 || defaultTeam, data.team6 || defaultTeam];
  let blueScores = [0, get(blueAlliance, "auto")]
  blueScores.push(blueScores[1] + get(blueAlliance, "tele"))
  blueScores.push(blueScores[2] + get(blueAlliance, "end"))
  let redScores = [0, get(redAlliance, "auto")]
  redScores.push(redScores[1] + get(redAlliance, "tele"))
  redScores.push(redScores[2] + get(redAlliance, "end"));
  //getting radar data
  let radarData = [];
  for (let qual of ['coralspeed', 'processorspeed', 'netspeed', 'algaeremovalspeed', 'climbspeed', 'maneuverability', 'defenseplayed', 'defenseevasion', 'aggression', 'cagehazard']) {
    radarData.push({qual, 
      team1: data?.team1?.qualitative[qual] || 0,
      team2: data?.team2?.qualitative[qual] || 0,
      team3: data?.team3?.qualitative[qual] || 0,
      team4: data?.team4?.qualitative[qual] || 0,
      team5: data?.team5?.qualitative[qual] || 0,
      team6: data?.team6?.qualitative[qual] || 0,
      fullMark: 5});
  }
  console.log(radarData);

  let matchMax = 0;
  for (let teamData of [data.team1, data.team2, data.team3, data.team4, data.team5, data.team6]) {
   if (teamData) {
    matchMax = Math.max(teamData.avgPieces.L4, teamData.avgPieces.L3, teamData.avgPieces.L2, teamData.avgPieces.L1, teamData.avgPieces.net, teamData.avgPieces.processor, teamData.avgPieces.HP, matchMax)
  }
   }
  matchMax = Math.floor(matchMax) + 2; 

  return (
    <div>
      <div className={styles.matchNav}>
        <AllianceButtons t1={data.team1 || defaultTeam} t2={data.team2 || defaultTeam} t3={data.team3 || defaultTeam} colors={[COLORS[0], COLORS[1], COLORS[2]]}></AllianceButtons>
        <Link href={`/match-view?team1=${data.team1?.team || ""}&team2=${data.team2?.team || ""}&team3=${data.team3?.team || ""}&team4=${data.team4?.team || ""}&team5=${data.team5?.team || ""}&team6=${data.team6?.team || ""}`}><button style={{background: "#ffff88", color: "black"}}>Edit</button></Link>
        <AllianceButtons t1={data.team4 || defaultTeam} t2={data.team5 || defaultTeam} t3={data.team6 || defaultTeam} colors={[COLORS[3], COLORS[4], COLORS[5]]}></AllianceButtons>
      </div>
      <div className={styles.allianceEPAs}>
        <AllianceDisplay teams={redAlliance} opponents={blueAlliance} colors={["#FFE4E9", "#FDC3CA"]}></AllianceDisplay>
        <AllianceDisplay teams={blueAlliance} opponents={redAlliance} colors={["#D3DFFF", "#A9BDFF"]}></AllianceDisplay>
      </div>
      <div className={styles.allianceGraphs}>
        RADAR CHART
      </div>
      <div className={styles.matches}>
        <TeamDisplay teamData={data.team1 || defaultTeam} colors={COLORS[3]} matchMax={matchMax}></TeamDisplay>
        <TeamDisplay teamData={data.team2 || defaultTeam} colors={COLORS[4]} matchMax={matchMax}></TeamDisplay>
        <TeamDisplay teamData={data.team3 || defaultTeam} colors={COLORS[5]} matchMax={matchMax}></TeamDisplay>
      </div>
      <div className={styles.matches}>
        <TeamDisplay teamData={data.team4 || defaultTeam} colors={COLORS[0]} matchMax={matchMax}></TeamDisplay>
        <TeamDisplay teamData={data.team5 || defaultTeam} colors={COLORS[1]} matchMax={matchMax}></TeamDisplay>
        <TeamDisplay teamData={data.team6 || defaultTeam} colors={COLORS[2]} matchMax={matchMax}></TeamDisplay>
      </div>
    </div>
  )
}

