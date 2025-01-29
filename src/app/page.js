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
                <div className={styles.L1}>
                  <h2>L1</h2>
                  <NumericInput 
                    visibleName={"Success"}
                    pieceType={"Success"}
                    internalName={"autoL1success"}/>
                  <NumericInput 
                    visibleName={"Fail"}
                    pieceType={"Fail"}
                    internalName={"autoL1fail"}/>
                </div>
                <div className={styles.L2}>
                  <h2>L2</h2>
                  <NumericInput 
                    pieceType={"Success"}
                    internalName={"autoL2success"}/>
                  <NumericInput 
                    pieceType={"Fail"}
                    internalName={"autoL2fail"}/>
                </div>
                <div className={styles.L3}>
                  <h2>L3</h2>
                  <NumericInput 
                    pieceType={"Success"}
                    internalName={"autoL3success"}/>
                  <NumericInput 
                    pieceType={"Fail"}
                    internalName={"autoL3fail"}/>
                </div>
                <div className={styles.L4}>
                  <h2>L4</h2>
                  <NumericInput 
                    pieceType={"Success"}
                    internalName={"autoL4success"}/>
                  <NumericInput 
                    pieceType={"Fail"}
                    internalName={"autoL4fail"}/>
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
            </div>
            <div className={styles.Auto}>
              <Header headerName={"Tele"}/>
              <div className={styles.Coral}>
                <SubHeader subHeaderName={"Coral"}/>
                <div className={styles.L1}>
                  <h2>L1</h2>
                  <NumericInput 
                    visibleName={"Success"}
                    pieceType={"Success"}
                    internalName={"teleL1success"}/>
                  <NumericInput 
                    visibleName={"Fail"}
                    pieceType={"Fail"}
                    internalName={"teleL1fail"}/>
                </div>
                <div className={styles.L2}>
                  <h2>L2</h2>
                  <NumericInput 
                    pieceType={"Success"}
                    internalName={"teleL2success"}/>
                  <NumericInput 
                    pieceType={"Fail"}
                    internalName={"teleL2fail"}/>
                </div>
                <div className={styles.L3}>
                  <h2>L3</h2>
                  <NumericInput 
                    pieceType={"Success"}
                    internalName={"teleL3success"}/>
                  <NumericInput 
                    pieceType={"Fail"}
                    internalName={"teleL3fail"}/>
                </div>
                <div className={styles.L4}>
                  <h2>L4</h2>
                  <NumericInput 
                    pieceType={"Success"}
                    internalName={"teleL4success"}/>
                  <NumericInput 
                    pieceType={"Fail"}
                    internalName={"teleL4fail"}/>
                </div>
              </div>
              <div className={styles.AlgaeRemoved}>
                <SubHeader subHeaderName={"Algae Removed"}/>
                <div className={styles.HBox}>
                  <NumericInput 
                    pieceType={"Counter"}
                    internalName={"telealgaeremoved"}/>
                </div>
              </div>
              <div className={styles.Processor}>
                <SubHeader subHeaderName={"Processor"} />
                <div className={styles.HBox}>
                  <NumericInput 
                    visibleName={"Success"}
                    pieceType={"Success"}
                    internalName={"teleprocessorsuccess"}/>
                  <NumericInput 
                    visibleName={"Fail"}
                    pieceType={"Fail"}
                    internalName={"teleprocessorfail"}/>
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