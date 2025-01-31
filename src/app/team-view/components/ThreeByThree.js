"use client";
import styles from "./FourByTwo.module.css"

export default function ThreeByThree({HC1, HC2, HC3, HC4, HC5, HC6, HR1, R1C1, R1C2, R2C3, R2C4, R3C5, R3C6, HR2, R2C1, R2C2, HR3, R3C1, R3C2, R1C3, R3C3, color1, color2, color3 }) {
    return (
      <table className={styles.ThreeByThree}>
        <colgroup>
          <col span="1" style={{backgroundColor: color1}}></col>
          <col span="2" style={{backgroundColor: color3}}></col>
        </colgroup>
        <thead>
            <tr><th style={{height: "20px", backgroundColor: "white", borderLeftColor: "white", borderTopColor: "white"}}></th><th style={{backgroundColor: color2}}>{HC1}</th><th style={{backgroundColor: color2}}>{HC2}</th></tr>
        </thead>
        <tbody>
        <tr style={{height: "20px"}}>
          <td>{HR1}</td>
          <td>{HC1}</td>
          <td>{R1C1}</td>
          <td>{HC2}</td>
          <td>{R1C2}</td>
        </tr>
        <tr style={{height: "20px"}}>
          <td>{HR2}</td>
          <td>{HC3}</td>
          <td>{R2C3}</td>
          <td>{HC4}</td>
          <td>{R2C4}</td>
        </tr>
        <tr style={{height: "20px"}}>
          <td>{HR3}</td>
          <td>{HC5}</td>
          <td>{R3C5}</td>
          <td>{HC6}</td>
          <td>{R3C6}</td>
        </tr>
        </tbody>
      </table>
    )
  }