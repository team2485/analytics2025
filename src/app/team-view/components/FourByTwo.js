"use client";
import styles from "./FourByTwo.module.css"

export default function FourByTwo({HC1, HC2, HR1, R1C1, R1C2, HR2, R2C1, R2C2, HR3, R3C1, R3C2, HR4, R4C1, R4C2, color1, color2, color3}) {
    return (
      <table className={styles.FourByTwo}>
        <colgroup>
          <col span="1" style={{backgroundColor: color1}}></col>
          <col span="2" style={{backgroundColor: color3}}></col>
        </colgroup>
        <thead>
            <tr><th style={{height: "20px", backgroundColor: "white", borderLeftColor: "white", borderTopColor: "white"}}></th><th style={{backgroundColor: color2}}>{HC1}</th><th style={{backgroundColor: color2}}>{HC2}</th></tr>
        </thead>
        <tbody>
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
        <tr style={{height: "20px"}}>
          <td>{HR3}</td>
          <td>{R3C1}</td>
          <td>{R3C2}</td>
        </tr>
        <tr style={{height: "20px"}}>
          <td>{HR4}</td>
          <td>{R4C1}</td>
          <td>{R4C2}</td>
        </tr>
        </tbody>
      </table>
    )
  }