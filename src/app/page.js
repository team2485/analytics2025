"use client";
import Header from "./form-components/Header";
import TextInput from "./form-components/TextInput";
import styles from "./page.module.css";
import { useEffect, useRef, useState } from "react";
import Checkbox from "./form-components/Checkbox";
import SubHeader from "./form-components/SubHeader";
import Qualitative from "./form-components/Qualitative";
import CommentBox from "./form-components/CommentBox";

export default function Home() {
  const [noShow, setNoShow] = useState(false);
  const [breakdown, setBreakdown] = useState(false);
  const [defense, setDefense] = useState(false);
  const form = useRef();
  
  function onNoShowChange(e) {
    let checked = e.target.checked;
    setNoShow(checked);
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
        <div>match type radio button</div>
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
                  <span>L1</span><div>Success Input</div><div>Fail Input</div>
                </div>
                <div className={styles.L2}>
                  <span>L2</span><div>Success Input</div><div>Fail Input</div>
                </div>
                <div className={styles.L3}>
                  <span>L3</span><div>Success Input</div><div>Fail Input</div>
                </div>
                <div className={styles.L4}>
                  <span>L4</span><div>Success Input</div><div>Fail Input</div>
                </div>
              </div>
              <SubHeader subHeaderName={"Algae Removed"}/>
              <div className={styles.HBox}>
                <div>Success Input</div>
              </div>
              <SubHeader subHeaderName={"Processor"} />
              <div className={styles.HBox}>
                <div>Success Input</div><div>Fail Input</div>
              </div>
              <SubHeader subHeaderName={"Net"} />
              <div className={styles.HBox}>
                <div>Success Input</div><div>Fail Input</div>
              </div>
            </div>
            <div className={styles.Auto}>
              <Header headerName={"Tele"}/>
              <div className={styles.Coral}>
                <SubHeader subHeaderName={"Coral"}/>
                <div className={styles.L1}>
                  <span>L1</span><div>Success Input</div><div>Fail Input</div>
                </div>
                <div className={styles.L2}>
                  <span>L2</span><div>Success Input</div><div>Fail Input</div>
                </div>
                <div className={styles.L3}>
                  <span>L3</span><div>Success Input</div><div>Fail Input</div>
                </div>
                <div className={styles.L4}>
                  <span>L4</span><div>Success Input</div><div>Fail Input</div>
                </div>
              </div>
              <SubHeader subHeaderName={"Algae Removed"}/>
              <div className={styles.HBox}>
                <div>Success Input</div>
              </div>
              <SubHeader subHeaderName={"Processor"} />
              <div className={styles.HBox}>
                <div>Success Input</div><div>Fail Input</div>
              </div>
              <SubHeader subHeaderName={"Net"} />
              <div className={styles.HBox}>
                <div>Success Input</div><div>Fail Input</div>
              </div>
              <SubHeader subHeaderName={"Human Player"}/>
              <Checkbox visibleName={"Human Player From Team?"} internalName={"humanplayer"}/>
              <div className={styles.HBox}>
                <div>Success Input</div><div>Fail Input</div>
              </div>
            </div>
            <div className={styles.Endgame}>
              <Header headerName={"Endgame"}/>
              <div>Endgame Placement</div>
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