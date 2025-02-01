"use client";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import VBox from "./components/VBox";
import HBox from "./components/HBox";
import Comments from "./components/Comments";
import TwoByTwo from "./components/TwoByTwo";
import ThreeByThree from "./components/ThreeByThree";
import FourByTwo from "./components/FourByTwo";
import EPALineChart from './components/EPALineChart';
import PiecePlacement from "./components/PiecePlacement";
import Endgame from "./components/Endgame";
import Qualitative from "./components/Qualitative";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, RadarChart, PolarRadiusAxis, PolarAngleAxis, PolarGrid, Radar, Legend } from 'recharts';

export default function TeamViewPage() {
    return (
        <Suspense>
            <TeamView />
        </Suspense>
    );
}

function TeamView() {
    // const [data, setData] = useState(null);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);
    // const searchParams = useSearchParams();
    // const team = searchParams.get("team");
    
    let data={
      team: 2485,
      name: "Overclocked",
      avgEpa: 73,
      avgAuto: 20,
      avgTele: 56,
      avgEnd: 12,
      last3Epa: 43,
      last3Auto: 5,
      last3Tele: 21,
      last3End: 2,
      epaOverTime: [{match: 3, epa: 60},{match: 10, epa: 43},{match: 13, epa: 12}],
      epaRegression: [{match: 3, epa: 60}, {match: 13, epa: 12}], //not sure how we should do this one
      consistancy: 98,
      defense: 11,
      lastBreakdown: 2,
      noShow: 1,
      breakdown: 9,
      matchesScouted: 3,
      scouts: ["Yael", "Ella", "Max"],
      generalComments: ["pretty good", "fragile intake","hooray!"],
      breakdownComments: ["stopped moving"],
      defenseComments: ["defended coral human player station"],
      autoOverTime: [{match: 8, epa: 60},{match: 10, epa: 10},{match: 13, epa: 2}],
      leave: 93,
      auto: {
        coral: {
          total: 7,
          success: 88,
          avgL1: 3,
          avgL2: 4,
          avgL3: 7,
          avgL4: 1,
          successL1: 90,
          successL2: 87,
          successL3: 23,
          successL4: 100
        },
        algae: {
          removed: 1,
          avgProcessor: 0,
          avgNet: 1,
          successProcessor: 0,
          successNet: 100,
        },
      },
      teleOverTime: [{match: 8, epa: 30}, {match: 10, epa: 78}, {match: 13, epa: 42}],
      tele: {
        coral: {
          total: 15,
          success: 82,
          avgL1: 9,
          avgL2: 3,
          avgL3: 6,
          avgL4: 2,
          successL1: 93,
          successL2: 81,
          successL3: 29,
          successL4: 80
        },
        algae: {
          removed: 3,
          avgProcessor: 2,
          avgNet: 4,
          successProcessor: 76,
          successNet: 11,
        },
        avgHp: 3,
        successHp: 13,
      },
      endPlacement: {
        none: 10,
        park: 20,
        deep: 12,
        shallow: 38,
        parkandFail: 10,
      },
      attemptCage: 94,
      successCage: 68,
      qualitative: [
        {name: "Coral Speed", rating: 5},
        {name: "Processor Speed", rating: 4},
        {name: "Net Speed", rating: 3},
        {name: "Algae Removal Speed", rating: 5},
        {name: "Climb Speed", rating: 3},
        {name: "Maneuverability", rating: 4},
        {name: "Defense Played", rating: 5},
        {name: "Defense Evasion", rating: 0},
        {name: "Aggression*", rating: 1},
        {name: "Cage Hazard*", rating: 2},
      ],
      coralGroundIntake: true,
      coralStationIntake: true,
      algaeGroundIntake: false,
      algaeLowReefIntake: false,
      algaeHighReefIntake: true,
      lollipop: true,
    }
    // Fetch team data from backend
    // function fetchTeamData(team) {
    //     setLoading(true);
    //     setError(null);

    //     fetch(`/api/get-team-data?team=${team}`)
    //         .then(response => {
    //             if (!response.ok) {
    //                 throw new Error("Failed to fetch data");
    //             }
    //             return response.json();
    //         })
    //         .then(data => {
    //             setData(data);
    //             setLoading(false);
    //         })
    //         .catch(error => {
    //             console.error("Fetch error:", error);
    //             setError(error.message);
    //             setLoading(false);
    //         });
    // }

    // useEffect(() => {
    //     if (team) {
    //         fetchTeamData(team);
    //     }
    // }, [team]);

    // if (!team) {
    //     return (
    //         <div>
    //             <form className={styles.teamInputForm}>
    //                 <span>{error}</span>
    //                 <label htmlFor="team">Team: </label>
    //                 <input id="team" name="team" placeholder="Team #" type="number"></input>
    //                 <br></br>
    //                 <button>Go!</button>
    //             </form>
    //         </div>
    //     );
    // }

    // if (loading) {
    //     return (
    //         <div>
    //             <h1>Loading...</h1>
    //         </div>
    //     );
    // }

    // if (!data) {
    //     return (
    //         <div>
    //             <h1>No data found for team {team}</h1>
    //         </div>
    //     );
    // }

    const Colors = [
        //light to dark
        ["#CCFBF7", "#76E3D3", "#63929C", "#117772"], //green
        ["#D7F2FF", "#9EDCFB", "#6CC9F7", "#0A6D9F"], //blue
        ["#D7D8FF", "#999CFC", "#8488FF", "#2022AA"], //blue-purple
        ["#F3D8FB", "#DBA2ED", "#C37DDB", "#8E639C"], //pink-purple
        ["#FFDDF3", "#EDA2DB", "#DD64C0", "#9C6392"], //pink
    ];

    const endgamePieData = [
        { x: 'None', y: data.endPlacement.none },
        { x: 'Park', y: data.endPlacement.park },
        { x: 'Fail', y: data.endPlacement.parkandFail },
        { x: 'Shallow', y: data.endPlacement.shallow },
        { x: 'Deep', y: data.endPlacement.deep }
    ];

    return (
        <div className={styles.MainDiv}>
            <div className={styles.leftColumn}>
                <h1 style={{ color: Colors[0][0] }}>Team {data.team} View</h1>
                <h3>{data.name}</h3>
                <div className={styles.EPAS}>
                    <div className={styles.EPA}>
                        <div className={styles.scoreBreakdownContainer}>
                            <div style={{ background: Colors[0][1] }} className={styles.epaBox}>{data.avgEpa}</div>
                            <div className={styles.epaBreakdown}>
                                <div style={{ background: Colors[0][3] }}>A: {data.avgAuto}</div>
                                <div style={{ background: Colors[0][3] }}>T: {data.avgTele}</div>
                                <div style={{ background: Colors[0][3] }}>E: {data.avgEnd}</div>
                            </div>
                            <div className={styles.Last3EPA}> 
                            <div style={{background: "orange"}} className={styles.Last3EpaBox}>{data.last3Epa}</div>
                              <div className={styles.epaBreakdown}>
                                <div style={{background: "yellow"}}>A: {data.last3Auto}</div>
                                <div style={{background: "green"}}>T: {data.last3Tele}</div>
                                <div style={{background: "red"}}>E: {data.last3End}</div>
                              </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.graphContainer}>
                    <h4 className={styles.graphTitle}>EPA Over Time</h4>
                    <EPALineChart data={data.epaOverTime} color={Colors[0][0]} />
                </div>
                <div className={styles.graphContainer}>
                    <h4 className={styles.graphTitle}>Piece Placement</h4>
                    <PiecePlacement
                        L1={data.auto.coral.avgL1 + data.tele.coral.avgL1}
                        L2={data.auto.coral.avgL2 + data.tele.coral.avgL2}
                        L3={data.auto.coral.avgL3 + data.tele.coral.avgL3}
                        L4={data.auto.coral.avgL4 + data.tele.coral.avgL4}
                        net={data.auto.algae.avgNet + data.tele.algae.avgNet}
                        processor={data.auto.algae.avgProcessor + data.tele.algae.avgProcessor}
                        HP={data.tele.avgHp}
                    />
                </div>
                <div className={styles.valueBoxes}>
                    <VBox title={"Matches Scouted"} value={data.matchesScouted} />
                    <VBox title={"No Show"} value={data.noShow} />
                    <VBox title={"Defense"} value={data.defense} />
                    <VBox title={"Consistency"} value={data.consistancy} />
                    <VBox title={"Breakdown"} value={data.breakdown} />
                    <VBox title={"Last Breakdown"} value={data.lastBreakdown} />
                    <Comments title={"General Comments"} value={data.generalComments.join(" | ")} />
                    <Comments title={"Breakdown Comments"} value={data.breakdownComments.join(" | ")} />
                    <Comments title={"Defense Comments"} value={data.defenseComments.join(" | ")} />
                </div>
                <HBox title={"Scouts"} value={data.scouts.join(" | ")} />
            </div>
      <div className={styles.rightColumn}>
        <div className={styles.topRow}>
        <div className={styles.auto}>
          <div className={styles.fourByTwoContainer}>
            <FourByTwo
              HC1="Success"
              HC2="Avg Coral"
              HR1="L4"
              R1C1={`${data.auto.coral.successL4}%`}
              R1C2={data.auto.coral.avgL4}
              HR2="L3"
              R2C1={`${data.auto.coral.successL3}%`}
              R2C2={data.auto.coral.avgL3}
              HR3="L2"
              R3C1={`${data.auto.coral.successL2}%`}
              R3C2={data.auto.coral.avgL2}
              HR4="L1"
              R4C1={`${data.auto.coral.successL1}%`}
              R4C2={data.auto.coral.avgL1}
            />
          </div>
          <div className={styles.graphContainer}>
            <h4 className={styles.graphTitle}>Auto Over Time</h4>
            <EPALineChart 
              data={data.autoOverTime} 
              color={Colors[0][0]} 
            />
          </div>
          <div className={styles.valueBoxes}>
              <VBox title={"Leave"} value={data.leave} />
              <VBox title={"Total"} value={data.auto.coral.total} />
              <VBox title={"Success"} value={data.auto.coral.success} />
              <VBox title={"Algae Removed"} value={data.auto.algae.removed} />
          </div>
          <div className={styles.twoByTwoContainer}>
              <TwoByTwo
                HC1="Success"
                HC2="Avg Algae"
                HR1="Processor"
                R1C1={`${data.auto.algae.successProcessor}%`}
                R1C2={data.auto.algae.avgProcessor}
                HR2="Net"
                R2C1={`${data.auto.algae.successNet}%`}
                R2C2={data.auto.algae.avgNet}
              />
          </div>
        </div>
        <div className={styles.tele}>
          <div className={styles.fourByTwoContainer}>
            <FourByTwo
              HC1="Success"
              HC2="Avg Coral"
              HR1="L4"
              R1C1={`${data.tele.coral.successL4}%`}
              R1C2={data.tele.coral.avgL4}
              HR2="L3"
              R2C1={`${data.tele.coral.successL3}%`}
              R2C2={data.tele.coral.avgL3}
              HR3="L2"
              R3C1={`${data.tele.coral.successL2}%`}
              R3C2={data.tele.coral.avgL2}
              HR4="L1"
              R4C1={`${data.tele.coral.successL1}%`}
              R4C2={data.tele.coral.avgL1}
            />
          </div>
          <div className={styles.graphContainer}>
            <h4 className={styles.graphTitle}>Tele Over Time</h4>
            <EPALineChart 
              data={data.teleOverTime} 
              color={Colors[0][0]} 
            />
          </div>
            <div className={styles.valueBoxes}>
              <VBox title={"HP Scored"} value={data.tele.avgHp} />
              <VBox title={"Success"} value={data.tele.successHp} />
              <VBox title={"Total"} value={data.tele.coral.total} />
              <VBox title={"Success"} value={data.tele.coral.success} />
              <VBox title={"Algae Removed"} value={data.tele.algae.removed} />
            </div>
            <div className={styles.tele}>
              <div className={styles.twoByTwoContainer}>
                <TwoByTwo
                  HC1="Success"
                  HC2="Avg Algae"
                  HR1="Processor"
                  R1C1={`${data.tele.algae.successProcessor}%`}
                  R1C2={data.tele.algae.avgProcessor}
                  HR2="Net"
                  R2C1={`${data.tele.algae.successNet}%`}
                  R2C2={data.tele.algae.avgNet}
                />
            </div>
          </div>
        </div>
        </div>
        <div className={styles.bottomRow}>
        <div className={styles.endgame}>
          <div className={styles.twoByTwoContainer}>
            <TwoByTwo
              HC1="Attempt"
              HC2="Success"
              HR1="Cage"
              R1C1={`${data.attemptCage}%`}
              R1C2={`${data.successCage}%`}
            />
          </div> 
          <div className={styles.graphContainer}>
            <h4 className={styles.graphTitle}>Endgame Placement</h4>
            <Endgame 
              data={endgamePieData} 
              color={Colors[0][0]} 
            />
          </div>
        </div>
        <div className={styles.qualitative}>
          <div className={styles.radarContainer}>
            <h4 className={styles.graphTitle} >Qualitative Ratings</h4>
            <Qualitative data={data.qualitative}/>
            <p>*Inverted so outside is good</p>
          </div>
          <table className={styles.Intake}> 
            <tbody>
              <tr>
                  <td className={styles.intakeName} style={{backgroundColor: Colors[3][1], width: "40px"}} rowSpan="2">Coral Intake</td>
                  <td className={styles.intakeName} style={{backgroundColor: Colors[3][2], width: "50px", height: "10px"}}>Ground</td>
                  <td className={styles.intakeName} style={{backgroundColor: Colors[3][2], width: "50px"}}>Source</td>
              </tr>
              <tr>
                  <td className={styles.intakeCheck} style={{backgroundColor: Colors[3][3], width: "50px", height: "30px"}}><input id="groundcheck" type="checkbox" readOnly checked={data.coralGroundIntake}></input></td>
                  <td className={styles.intakeCheck} style={{backgroundColor: Colors[3][3], width: "50px", height: "30px"}}><input id="sourcecheck" type="checkbox" readOnly checked={data.coralStationIntake}></input></td>
              </tr>
              <tr>
                  <td className={styles.intakeName} style={{backgroundColor: Colors[3][1], width: "40px"}} rowSpan="2">Algae Intake</td>
                  <td className={styles.intakeName} style={{backgroundColor: Colors[3][2], width: "50px", height: "10px"}}>Ground</td>
                  <td className={styles.intakeName} style={{backgroundColor: Colors[3][2], width: "50px"}}>Lollipop</td>
              </tr>
              <tr>
                  <td className={styles.intakeCheck} style={{backgroundColor: Colors[3][3], width: "50px", height: "30px"}}><input id="groundcheck" type="checkbox" readOnly checked={data.algaeGroundIntake}></input></td>
                  <td className={styles.intakeCheck} style={{backgroundColor: Colors[3][3], width: "50px", height: "30px"}}><input id="sourcecheck" type="checkbox" readOnly checked={data.lollipop}></input></td>
              </tr>
              <tr>
                  <td className={styles.intakeName} style={{backgroundColor: Colors[3][1], width: "40px"}} rowSpan="2">Reef Intake</td>
                  <td className={styles.intakeName} style={{backgroundColor: Colors[3][2], width: "50px", height: "10px"}}>Low</td>
                  <td className={styles.intakeName} style={{backgroundColor: Colors[3][2], width: "50px"}}>High</td>
              </tr>
              <tr>
                  <td className={styles.intakeCheck} style={{backgroundColor: Colors[3][3], width: "50px", height: "30px"}}><input id="groundcheck" type="checkbox" readOnly checked={data.algaeLowReefIntake}></input></td>
                  <td className={styles.intakeCheck} style={{backgroundColor: Colors[3][3], width: "50px", height: "30px"}}><input id="sourcecheck" type="checkbox" readOnly checked={data.algaeHighReefIntake}></input></td>
              </tr>
            </tbody>
          </table>
        </div>
        </div>
      </div>
    </div>

    )
  }