"use client";
import { useState } from 'react'
import styles from './NumericInput.module.css'

export default function NumericInput ({ visibleName, internalName, noteType, min, max }) {
    min = min || 0;
    max = max || 99999;

    const [value, setValue] = useState(0);
    function increment() {
        if (value + 1 <= max) {
            setValue(value+1);
        }
    }
    function decrement() {
        if (value - 1 >= min) {
            setValue(value-1);
        }
    }
    function onInputChange(e) {
        if (e.target.value >= min && e.target.value <= max) {
            setValue(e.target.value);
        }
    }
    return (
        <div className={styles.NumericInput}>
            <label className={styles.label} htmlFor={internalName}>{visibleName}:</label>
            <div className={styles.input}>
                <svg className={styles.svg} aria-hidden="true" onClick={decrement} focusable="false" data-prefix="fas" data-icon="minus-circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zM124 296c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h264c6.6 0 12 5.4 12 12v56c0 6.6-5.4 12-12 12H124z"></path></svg>
                <input className={styles[noteType]} type="number" id={internalName} name={internalName} value={value} onChange={onInputChange}></input>
                <svg className={styles.svg} aria-hidden="true" onClick={increment} focusable="false" data-prefix="fas" data-icon="plus-circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm144 276c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92h-92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z"></path></svg>
            </div>
            <br></br>
        </div>
    )
}