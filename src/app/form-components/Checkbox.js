"use client";
import styles from "./Checkbox.module.css";
import { useState } from "react";

export default function Checkbox ({ visibleName, internalName, changeListener }) {
    const [checked, setChecked] = useState(false);
    return (
        <div className={styles.boxContainer}>
            <div className={styles.box}>
                <input type="checkbox" id={internalName} name={internalName} checked={checked} onChange={(e) => {
                    setChecked(e.target.checked);
                    if (changeListener) changeListener(e);
                }}></input>
                <label htmlFor={internalName}>{visibleName}</label>
            </div>
        </div>
    )
}