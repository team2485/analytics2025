"use client";
import styles from "./TwoByTwo.module.css"

export default function TwoByTwo({HC1, HC2, HR1, R1C1, R1C2, HR2, R2C1, R2C2, color1, color2, color3}) {
    return (
      <table className={styles.TwoByTwo}>
        <colgroup>
          <col span="1" style={{backgroundColor: color1}}></col>
          <col span="2" style={{backgroundColor: color3}}></col>
        </colgroup>
        <th style={{height: "20px", backgroundColor: "white", borderLeftColor: "white", borderTopColor: "white"}}></th><th style={{backgroundColor: color2}}>{HC1}</th><th style={{backgroundColor: color2}}>{HC2}</th>
        <tr style={{height: "20px"}}>
          <td >{HR1}</td>
          <td>{R1C1}</td>
          <td>{R1C2}</td>
        </tr>
        <tr style={{height: "20px"}}>
          <td>{HR2}</td>
          <td>{R2C1}</td>
          <td>{R2C2}</td>
        </tr>
      </table>
    )
  }