"use client";
import styles from "./Comments.module.css"

export default function Comments({title, value, color1, color2}) {
    return (
      <div className={styles.commentsBox}>
        <table style={{width: "350px"}}>
          <tr style={{backgroundColor: color1}}>{title}</tr>
          <tr style={{backgroundColor: color2}}><td>{value}</td></tr>
        </table>
      </div>
    )
  }