"use client";
import Header from "./form-components/Header";
import TextInput from "./form-components/TextInput";
import styles from "./page.module.css";
import { useEffect, useRef, useState } from "react";
import Checkbox from "./form-components/Checkbox";
import SubHeader from "./form-components/SubHeader";

export default function Home() {
  const [noShow, setNoShow] = useState(false);
  const form = useRef();
  function onNoShowChange(e) {
    let checked = e.target.checked;
    setNoShow(checked);
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
                
              </div>
            </div>
          </>
        )}
      </form>
    </div>
  );
}