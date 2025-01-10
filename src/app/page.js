"use client";
import Header from "./form-components/Header";
import TextInput from "./form-components/TextInput";
import styles from "./page.module.css";
import { useEffect, useRef, useState } from "react";
import Checkbox from "./form-components/Checkbox";

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
            </div>
          </>
        )}
      </form>
    </div>
  );
}
