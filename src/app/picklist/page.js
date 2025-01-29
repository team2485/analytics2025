'use client';

import styles from "./page.module.css";
import { useEffect, useState, useRef } from "react";

export default function Picklist() {
  const [fields, setFields] = useState([]);
  const [picklist, setPicklist] = useState([]);
  const [maxScore, setMaxScore] = useState(1);
  const [teamsToExclude, setTeamsToExclude] = useState(new Array(24));
  const [allianceData, setAllianceData] = useState({});
  const [weights, setWeights] = useState({});
  const [teamRatings, setTeamRatings] = useState({});
  const [weightsChanged, setWeightsChanged] = useState(false);

  const weightsFormRef = useRef();
  const alliancesFormRef = useRef();

  const greenToRedColors = ["#9ADC83", "#BECC72", "#E1BB61", "#F0A56C", "#FF8E76"];

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlWeights = Object.fromEntries(urlParams);
    setWeights(urlWeights);

    const urlAlliances = {};
    let urlTeamsToExclude = teamsToExclude;
    for (const [key, value] of urlParams.entries()) {
      if (key.startsWith('A')) {
        const [, allianceNumber, teamPosition] = key.match(/A(\d+)T(\d+)/);
        if (!urlAlliances[allianceNumber]) {
          urlAlliances[allianceNumber] = [];
        }
        urlAlliances[allianceNumber][parseInt(teamPosition) - 1] = value;
        urlTeamsToExclude[((allianceNumber - 1) * 4) + (teamPosition-1)] = +value;
      }
    }
    setAllianceData(urlAlliances);
    setTeamsToExclude(urlTeamsToExclude);
    const storedRatings = localStorage.getItem('teamRatings');
    if (storedRatings) {
      setTeamRatings(JSON.parse(storedRatings));
    }
  }, []);

  useEffect(() => {
    if (Object.keys(teamRatings).length > 0) {
      localStorage.setItem('teamRatings', JSON.stringify(teamRatings));
    }
  }, [teamRatings]);

  async function recalculate(event) {
    const formData = new FormData(weightsFormRef.current);
    const weightEntries = [...formData.entries()];
    const newWeights = Object.fromEntries(weightEntries);
    setWeights(newWeights);

    const urlParams = new URLSearchParams([...weightEntries, ...Object.entries(allianceData).flatMap(([allianceNumber, teams]) => teams.map((team, index) => [`T${allianceNumber}A${index + 1}`, team]))]);
    window.history.replaceState(null, '', `?${urlParams.toString()}`);

    const picklist = await fetch('/api/compute-picklist', {
      method: 'POST',
      body: JSON.stringify(weightEntries)
    }).then(resp => resp.json());

    setPicklist(picklist);
    setMaxScore(picklist[0].score);
    setWeightsChanged(false);
  };

  function updateAlliancesData(allianceNumber, allianceTeams) {
    let formData = new FormData(alliancesFormRef.current);
    let teams = [...formData.entries()].map(entry => +entry[1]);
    setTeamsToExclude(teams);

    let updateAllianceData = {
      ...allianceData,
      [allianceNumber]: allianceTeams
    }

    const urlParams = new URLSearchParams([...Object.entries(weights), ...Object.entries(updateAllianceData).flatMap(([allianceNumber, teams]) => teams.map((team, index) => [`A${allianceNumber}T${index + 1}`, team]))]);
    window.history.replaceState(null, '', `?${urlParams.toString()}`);
  };

  const Weights = () => {
    const handleWeightChange = (e) => {
      setWeightsChanged(true);
      const { name, value } = e.target;
      setWeights(prevWeights => ({ ...prevWeights, [name]: parseFloat(value) }));
    }

    // BIG MUST: CHANGE THE BACKEND LOGIC FOR EACH OF THESE NEW VALUE NAMES
    return <table className={styles.weightsTable}>
      <tbody>
        <tr>
          <td><label htmlFor="epa">EPA:</label></td>
          <td><input id="epa" type="number" value={weights.epa || 0} name="epa" onChange={handleWeightChange}></input></td>
          <td><label htmlFor="end">End:</label></td>
          <td><input id="end" type="number" value={weights.end || 0} name="end" onChange={handleWeightChange}></input></td>
          <td><label htmlFor="climb">Climb:</label></td>
          <td><input id="climb" type="number" value={weights.climb || 0} name="climb" onChange={handleWeightChange}></input></td>
        </tr>
        <tr>
          <td><label htmlFor="auto">Auto:</label></td>
          <td><input id="auto" type="number" value={weights.auto || 0} name="auto" onChange={handleWeightChange}></input></td>
          <td><label htmlFor="coral">Coral:</label></td>
          <td><input id="coral" type="number" value={weights.coral || 0} name="coral" onChange={handleWeightChange}></input></td>
          <td><label htmlFor="stability">Stability:</label></td>
          <td><input id="stability" type="number" value={weights.stability || 0} name="stability" onChange={handleWeightChange}></input></td>
        </tr>
        <tr>
          <td><label htmlFor="tele">Tele:</label></td>
          <td><input id="tele" type="number" value={weights.tele || 0} name="tele" onChange={handleWeightChange}></input></td>
          <td><label htmlFor="processor">Processor:</label></td>
          <td><input id="processor" type="number" value={weights.processor || 0} name="processor" onChange={handleWeightChange}></input></td>
          <td><label htmlFor="defense">Defense:</label></td>
          <td><input id="defense" type="number" value={weights.defense || 0} name="defense" onChange={handleWeightChange}></input></td>
        </tr>
      </tbody>
    </table>
  }

  const AllianceRow = ({ allianceNumber, allianceData, handleAllianceChange }) => {
    const firstValue = allianceData ? allianceData[0] : '';
    const secondValue = allianceData ? allianceData[1] : '';
    const thirdValue = allianceData ? allianceData[2] : '';
    return (
      <tr>
        <td>A{allianceNumber}</td>
        <td><label htmlFor={`A${allianceNumber}T1`}></label><input name={`A${allianceNumber}T1`} type="number" defaultValue={firstValue}
          onBlur={e => {
            handleAllianceChange(allianceNumber, [e.target.value, secondValue, thirdValue]);
          }}></input></td>
        <td><label htmlFor={`A${allianceNumber}T2`}></label><input name={`A${allianceNumber}T2`} type="number" defaultValue={secondValue}
          onBlur={e => {
            handleAllianceChange(allianceNumber, [firstValue, e.target.value, thirdValue])
          }}></input></td>
        <td><label htmlFor={`A${allianceNumber}T3`}></label><input name={`A${allianceNumber}T3`} type="number" defaultValue={thirdValue}
          onBlur={e => {
            handleAllianceChange(allianceNumber, [firstValue, secondValue, e.target.value])
          }}></input></td>
      </tr>
    )
  };

  const handleAllianceChange = (allianceNumber, allianceTeams) => {
    setAllianceData({
      ...allianceData,
      [allianceNumber]: allianceTeams
    });
    updateAlliancesData(allianceNumber, allianceTeams);
  };

  function PicklistTable() {
    const valueToColor = (value) => {
      if (value > 0.8) return greenToRedColors[0];
      if (value > 0.6) return greenToRedColors[1];
      if (value > 0.4) return greenToRedColors[2];
      if (value > 0.2) return greenToRedColors[3];
      return greenToRedColors[4];
    };

    function handleThumbsUp(team) {
      setTeamRatings({ ...teamRatings, [team]: true });
    };

    function handleThumbsDown(team) {
      setTeamRatings({ ...teamRatings, [team]: false });
    };

    function handleMeh(team) {
      setTeamRatings({ ...teamRatings, [team]: undefined });
    };

    if (!picklist || picklist.length === 0) {
      return (
        <div className={styles.picklistContainer}>
          <h1>Picklist</h1>
          <span>Hit recalculate to view the picklist according to the weights you entered...</span>
        </div>
      );
    }

    const roundToThree = (x) => Math.round(x * 1000) / 1000;

    return (
      <div className={styles.picklistContainer}>
        <h1>Picklist</h1>
        {/* <div className={styles.picklistTableContainer}> */}
          <table className={styles.picklistTable} id="teamTable">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Team</th>
                <th>Score</th>
                <th>EPA</th>
                <th>Auto</th>
                <th>Tele</th>
                <th>End</th>
                <th>Climb</th>
                <th>Stability</th>
                <th>Coral</th>
                <th>Processor</th>
                <th>Defense</th>
                <th>Rating</th>

              </tr>
            </thead>
            <tbody>
              {picklist.map((teamData, index) => {
                if (teamsToExclude.includes(teamData.team)) {
                  return <tr key={teamData.team} style={{display: "none"}}></tr>
                } else {
                  return (
                    <tr key={teamData.team}>
                      <td>#{index + 1}{teamData.firstRanking !== -1 ? ` (${teamData.firstRanking - index - 1 > 0 ? "+" : ""}${teamData.firstRanking - index - 1})` : ""}</td>
                      <td><a href={`/team-view?team=${teamData.team}`}>{teamData.team}
                        {teamRatings[teamData.team] === true && '✅'}
                        {teamRatings[teamData.team] === false && '❌'}
                        </a>
                      </td>
                      <td style={{ backgroundColor: valueToColor(teamData.score / maxScore) }}>{roundToThree(teamData.score)}</td>
                      <td style={{ backgroundColor: valueToColor(teamData.epa) }}>{roundToThree(teamData.epa)}</td>
                      <td style={{ backgroundColor: valueToColor(teamData.auto) }}>{roundToThree(teamData.auto)}</td>
                      <td style={{ backgroundColor: valueToColor(teamData.tele) }}>{roundToThree(teamData.tele)}</td>
                      <td style={{ backgroundColor: valueToColor(teamData.end) }}>{roundToThree(teamData.end)}</td>
                      <td style={{ backgroundColor: valueToColor(teamData.climb) }}>{roundToThree(teamData.climb)}</td>
                      <td style={{ backgroundColor: valueToColor(teamData.stability) }}>{roundToThree(teamData.stability)}</td>
                      <td style={{ backgroundColor: valueToColor(teamData.coral) }}>{roundToThree(teamData.coral)}</td>
                      <td style={{ backgroundColor: valueToColor(teamData.processor) }}>{roundToThree(teamData.processor)}</td>
                      <td style={{ backgroundColor: valueToColor(teamData.defense) }}>{roundToThree(teamData.defense)}</td>
                      <td>
                        {teamRatings[teamData.team] !== true &&
                          <button onClick={() => handleThumbsUp(teamData.team)}>✅</button>
                        }
                        {teamRatings[teamData.team] !== false &&
                          <button onClick={() => handleThumbsDown(teamData.team)}>❌</button>
                        }
                        {teamRatings[teamData.team] !== undefined &&
                          <button onClick={() => handleMeh(teamData.team)}>🫳</button>
                        }
                      </td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        {/* </div> */}
      </div>
    );
  };

  return (
    <div className={styles.MainDiv}>
      <div>
        <form ref={weightsFormRef} className={styles.weightsForm}>
          <div className={styles.weights}>
            <h1>Weights</h1>
            <Weights></Weights>
          </div>
          <button type="button" onClick={recalculate} style={{
            marginBottom: '30px',
            fontSize: "20px",
          }} className={weightsChanged ? styles.recalculateIsMad : ""}>Recalculate Picklist</button>
        </form>
        <div className={styles.alliances}>
          <h1>Alliances</h1>
          <form ref={alliancesFormRef}>
            <table className={styles.allianceTable}>
              <thead>
                <tr key="head">
                  <th></th>
                  <th>T1</th>
                  <th>T2</th>
                  <th>T3</th>
                </tr>
              </thead>
              <tbody>
                <AllianceRow allianceNumber={"1"} allianceData={allianceData["1"]} handleAllianceChange={handleAllianceChange}></AllianceRow>
                <AllianceRow allianceNumber={"2"} allianceData={allianceData["2"]} handleAllianceChange={handleAllianceChange}></AllianceRow>
                <AllianceRow allianceNumber={"3"} allianceData={allianceData["3"]} handleAllianceChange={handleAllianceChange}></AllianceRow>
                <AllianceRow allianceNumber={"4"} allianceData={allianceData["4"]} handleAllianceChange={handleAllianceChange}></AllianceRow>
                <AllianceRow allianceNumber={"5"} allianceData={allianceData["5"]} handleAllianceChange={handleAllianceChange}></AllianceRow>
                <AllianceRow allianceNumber={"6"} allianceData={allianceData["6"]} handleAllianceChange={handleAllianceChange}></AllianceRow>
                <AllianceRow allianceNumber={"7"} allianceData={allianceData["7"]} handleAllianceChange={handleAllianceChange}></AllianceRow>
                <AllianceRow allianceNumber={"8"} allianceData={allianceData["8"]} handleAllianceChange={handleAllianceChange}></AllianceRow>
              </tbody>
            </table>
          </form>
        </div>
      </div>
      <PicklistTable></PicklistTable>
    </div>
  )
}