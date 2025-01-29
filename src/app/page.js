"use client";
import { useEffect, useRef, useState } from "react";
import Header from "./form-components/Header";
import TextInput from "./form-components/TextInput";
import styles from "./page.module.css";
import NumericInput from "./form-components/NumericInput";
import Checkbox from "./form-components/Checkbox";
import CommentBox from "./form-components/CommentBox";
import EndPlacement from "./form-components/EndPlacement";
import Qualitative from "./form-components/Qualitative";
import SubHeader from "./form-components/SubHeader";
import MatchType from "./form-components/MatchType";


export default function Home() {
  const [noShow, setNoShow] = useState(false);
  const [humanplayer, setHumanPlayer] = useState(false);
  const [breakdown, setBreakdown] = useState(false);
  const [defense, setDefense] = useState(false);
  const [HP, setHP] = useState(false);
  const form = useRef();
  
  function onNoShowChange(e) {
    let checked = e.target.checked;
    setNoShow(checked);
  }

  function onHumanPlayerChange(e) {
    let checked = e.target.checked;
    setHumanPlayer(checked);
  }

  function onBreakdownChange(e) {
    let checked = e.target.checked;
    setBreakdown(checked);
  }
  function onDefenseChange(e) {
    let checked = e.target.checked;
    setDefense(checked);
  }
  function onHPChange(e) {
    let checked = e.target.checked;
    setHP(checked);
  }


  // added from last years code (still review)
  async function submit(e) {
    e.preventDefault();
    //disable submit
    let submitButton = document.querySelector("#submit");//todo: get changed to a useRef
    submitButton.disabled = true;
    //import values from form to data variable
    let data = {noshow: false, leave: false, harmony: false, gndintake: false, srcintake: false, breakdown: false, defense: false, stageplacement: -1, breakdowncomments: null, defensecomments: null };
    [...new FormData(form.current).entries()].forEach(([name, value]) => {
      if (value == 'on') {
        data[name] = true;
      } else {
        if (!isNaN(value) && value != "") {
          data[name] = +value;
        } else {
          data[name] = value;
        }
      }
    });
    //clear unneeded checkbox values
    data.breakdown = undefined;
    data.defense = undefined;

    //check pre-match data
    let preMatchInputs = document.querySelectorAll(".preMatchInput"); //todo: use the data object
    for (let preMatchInput of preMatchInputs) {
      if(preMatchInput.value == "" || preMatchInput.value <= "0") {
        alert("Invalid Pre-Match Data!");
        submitButton.disabled = false;
        return;
      } 
    }
    //check team and match
    if (data.match < 200) {
      let valid = await fetch("/api/get-valid-team?team=" + data.team + "&match=" + data.match)
        .then((resp) => resp.json())
        .then((data) => data.valid)
      if (valid == false) {
        alert("Invalid Team and Match Combination!");
        submitButton.disabled = false;
        return;
      }
    }

    //confirm and submit
    if (confirm("Are you sure you want to submit?") == true) {
      fetch('/api/add-match-data', {
        method: "POST",
        body: JSON.stringify(data)
      }).then((response)=> {
        if(response.status === 201) {
          return response.json();
        } else {
          return response.json().then(err => Promise.reject(err.message));
        }
      }) 
      .then(data => {
        alert("Thank you!");
        const jsConfetti = new JSConfetti();
        jsConfetti.addConfetti({
          confettiColors: ['yellow'],
       })
        if (typeof document !== 'undefined')  {
          let ScoutName = document.querySelector("input[name='scoutname']").value;
          let ScoutTeam = document.querySelector("input[name='scoutteam']").value;
          let Match = document.querySelector("input[name='match']").value;
          let scoutProfile = { 
            scoutname: ScoutName, 
            scoutteam: ScoutTeam, 
            match: Number(Match)+1 
          };
          localStorage.setItem("ScoutProfile", JSON.stringify(scoutProfile));
        }
        setTimeout(() => {
          location.reload()
        }, 2000);
      })
      .catch(error => {
        alert(error);
        submitButton.disabled = false;
      });

    } else {
      //user didn't want to submit
      submitButton.disabled = false;
    };
  }

  return (
    <div className={styles.MainDiv}>
      <form ref={form} name="Scouting Form">
        <Header headerName={"Match Info"} />
        <div className={styles.MatchInfo}>
        <TextInput 
            visibleName={"Scout Name:"} 
            internalName={"scoutname"} 
            defaultValue={""}
          />
          <TextInput 
            visibleName={"Team #:"} 
            internalName={"scoutteam"} 
            defaultValue={""}
            type={"number"}
          />
          <TextInput
            visibleName={"Team Scouted:"}
            internalName={"team"}
            defaultValue={""}
            type={"number"}
          />
          <TextInput 
            visibleName={"Match #:"} 
            internalName={"match"} 
            defaultValue={""}
            type={"number"}
          />
        </div>
        <MatchType />
        <Checkbox
          visibleName={"No Show"}
          internalName={"noshow"}
          changeListener={onNoShowChange}
        />
        {!noShow && (
          <>
            <div className={styles.Auto}>
              <Header headerName={"Auto"}/>
              <Checkbox visibleName={"Leave"} internalName={"leave"} />
              <div className={styles.Coral}>
                <SubHeader subHeaderName={"Coral"}/>
                <table className={styles.Table}>
                <thead >
                <tr>
                    <th></th>
                      <th>Success</th>
                      <th>Fail</th>
                    </tr>
                </thead>
                  <tbody>
                  <tr>
                    <td><h2>L4</h2></td>
                    <td><NumericInput 
                      pieceType={"Success"}
                      internalName={"autoL4success"}/>
                      </td>
                    <td><NumericInput 
                      pieceType={"Fail"}
                      internalName={"autoL4fail"}/>
                      </td>
                    </tr> 
                  <tr>
                  <td><h2>L3</h2></td>
                  <td><NumericInput 
                    pieceType={"Success"}
                    internalName={"autoL3success"}/>
                    </td>
                  <td><NumericInput 
                    pieceType={"Fail"}
                    internalName={"autoL3fail"}/>
                    </td>
                  </tr>
                   <tr>
                  <td><h2>L2</h2></td>
                  <td><NumericInput 
                    pieceType={"Success"}
                    internalName={"autoL2success"}/>
                    </td>
                  <td><NumericInput 
                    pieceType={"Fail"}
                    internalName={"autoL2fail"}/>
                    </td>
                  </tr>
                   <tr>
                  <td><h2>L1</h2></td>
                  <td><NumericInput 
                    pieceType={"Success"}
                    internalName={"autoL1success"}/>
                    </td>
                  <td><NumericInput 
                    pieceType={"Fail"}
                    internalName={"autoL1fail"}/>
                    </td>
                  </tr>
                  </tbody>
                </table>
                </div>
              </div>
              <div className={styles.AlgaeRemoved}>
                <SubHeader subHeaderName={"Algae Removed"}/>
                <div className={styles.HBox}>
                  <NumericInput 
                    pieceType={"Counter"}
                    internalName={"autoalgaeremoved"}/>
                </div>
              </div>
              <div className={styles.Processor}>
                <SubHeader subHeaderName={"Processor"} />
                <div className={styles.HBox}>
                  <NumericInput 
                    visibleName={"Success"}
                    pieceType={"Success"}
                    internalName={"autoprocessorsuccess"}/>
                  <NumericInput 
                    visibleName={"Fail"}
                    pieceType={"Fail"}
                    internalName={"autoprocessorfail"}/>
                </div>
              </div>
              <div className={styles.Net}>
                <SubHeader subHeaderName={"Net"} />
                <div className={styles.HBox}>
                  <NumericInput 
                    visibleName={"Success"}
                    pieceType={"Success"}
                    internalName={"autonetsuccess"}/>
                  <NumericInput 
                    visibleName={"Fail"}
                    pieceType={"Fail"}
                    internalName={"autonetfail"}/>
                </div>
              </div>
            <div className={styles.Auto}>
              <Header headerName={"Tele"}/>
              <div className={styles.Coral}>
                <SubHeader subHeaderName={"Coral"}/>
                <table className={styles.Table}>
                <thead>
                <tr>
                    <th></th>
                      <th>Success</th>
                      <th>Fail</th>
                    </tr>
                </thead>
                  <tbody>
                  <tr>
                    <td><h2>L4</h2></td>
                    <td><NumericInput 
                      pieceType={"Success"}
                      internalName={"teleL4success"}/>
                      </td>
                    <td><NumericInput 
                      pieceType={"Fail"}
                      internalName={"teleL4fail"}/>
                      </td>
                    </tr> 
                  <tr>
                  <td><h2>L3</h2></td>
                  <td><NumericInput 
                    pieceType={"Success"}
                    internalName={"teleL3success"}/>
                    </td>
                  <td><NumericInput 
                    pieceType={"Fail"}
                    internalName={"teleL3fail"}/>
                    </td>
                  </tr>
                   <tr>
                  <td><h2>L2</h2></td>
                  <td><NumericInput 
                    pieceType={"Success"}
                    internalName={"teleL2success"}/>
                    </td>
                  <td><NumericInput 
                    pieceType={"Fail"}
                    internalName={"teleL2fail"}/>
                    </td>
                  </tr>
                   <tr>
                  <td><h2>L1</h2></td>
                  <td><NumericInput 
                    pieceType={"Success"}
                    internalName={"teleL1success"}/>
                    </td>
                  <td><NumericInput 
                    pieceType={"Fail"}
                    internalName={"teleL1fail"}/>
                    </td>
                  </tr>
                  </tbody>
                </table>
                </div>
              </div>
              <div className={styles.Net}>
                <SubHeader subHeaderName={"Net"} />
                <div className={styles.HBox}>
                <NumericInput 
                      visibleName={"Success"}
                      pieceType={"Success"}
                      internalName={"telenetsuccess"}/>
                    <NumericInput 
                      visibleName={"Fail"}
                      pieceType={"Fail"}
                      internalName={"telenetfail"}/>
                </div>
              </div>
              <div className={styles.HumanPlayer}>
              <SubHeader subHeaderName={"Human Player"}/>
              <Checkbox visibleName={"Human Player From Team?"} internalName={"humanplayer"} changeListener={onHumanPlayerChange}/>
              { humanplayer &&
                <div className={styles.HBox}>
                  <NumericInput 
                    visibleName={"Success"}
                    pieceType={"Success"}
                    internalName={"hpsuccess"}/>
                  <NumericInput 
                    visibleName={"Fail"}
                    pieceType={"Fail"}
                    internalName={"hpfail"}/>
                </div>
              }
              </div>
            <div className={styles.Endgame}>
              <Header headerName={"Endgame"}/>
              <EndPlacement/>
            </div>
            <div className={styles.PostMatch}>
              <br></br>
              <div className={styles.Qual}>
                <Qualitative                   
                  visibleName={"Coral Speed"}
                  internalName={"coralspeed"}
                  description={"Coral Speed"}/>
                <Qualitative                   
                  visibleName={"Processor Speed"}
                  internalName={"processorspeed"}
                  description={"Processor Speed"}/>
                <Qualitative                   
                  visibleName={"Net Speed"}
                  internalName={"netspeed"}
                  description={"Net Speed"}/>
                <Qualitative                   
                  visibleName={"Algae Removal Speed"}
                  internalName={"algaeremovalspeed"}
                  description={"Algae Removal Speed"}/>
                <Qualitative                   
                  visibleName={"Climb Speed"}
                  internalName={"climbspeed"}
                  description={"Climb Speed"}/>
                <Qualitative                   
                  visibleName={"Maneuverability"}
                  internalName={"maneuverability"}
                  description={"Maneuverability"}/>
                <Qualitative                   
                  visibleName={"Defense Played"}
                  internalName={"defenseplayed"}
                  description={"Ability to Play Defense"}/>
                <Qualitative                   
                  visibleName={"Defense Evasion"}
                  internalName={"defenseevasion"}
                  description={"Defense Evasion Ability"}/>
                <Qualitative
                  visibleName={"Aggression"}
                  internalName={"aggression"}
                  description={"Aggression"}
                  symbol={"ⵔ"}/>
                <Qualitative
                  visibleName={"Cage Hazard"}
                  internalName={"cagehazard"}
                  description={"Cage Hazard"}
                  symbol={"ⵔ"}/>
              </div>
              <br></br>
              <span className={styles.subsubheading}>Intake</span>
              <hr className={styles.subsubheading}></hr>
              <div className={styles.Intake}>
                <Checkbox
                  visibleName={"Coral Ground"}
                  internalName={"coralgndintake"}
                />
                <Checkbox
                  visibleName={"Coral Station"}
                  internalName={"coralstationintake"}
                />
                <Checkbox
                  visibleName={"Algae Ground"}
                  internalName={"algaegndintake"}
                />
                <Checkbox
                  visibleName={"Algae Reef"}
                  internalName={"algaereefintake"}
                />
              </div>
              <Checkbox visibleName={"Broke down?"} internalName={"breakdown"} changeListener={onBreakdownChange} />
              { breakdown &&
                <CommentBox
                  visibleName={"Breakdown Elaboration"}
                  internalName={"breakdowncomments"}
                />
              }
              <Checkbox visibleName={"Played Defense?"} internalName={"defense"} changeListener={onDefenseChange}/>
              { defense &&
                <CommentBox
                  visibleName={"Defense Elaboration"}
                  internalName={"defensecomments"}
                />
              }
              <CommentBox
                visibleName={"General Comments"}
                internalName={"generalcomments"}
              />
            </div>
          </>
        )}
        <br></br>
        <button id="submit" type="submit">SUBMIT</button>
      </form>
    </div>
  );
}