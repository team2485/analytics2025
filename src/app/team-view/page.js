"use client";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import VBox from "./components/VBox";
import HBox from "./components/HBox";
import Comments from "./components/Comments";
import TwoByTwo from "./components/TwoByTwo";
import FourByTwo from "./components/FourByTwo";

export default function TeamViewPage() {
    return <Suspense>
        <TeamView/>
      </Suspense>
  }

  function TeamView() {
    const Colors = [
      ["#116677", "#84C9D7", "#8CCCD9", "#C4EEF6"],
      ["#003F7E", "#84AED7", "#A2C8ED", "#D8EAFB"],
      ["#15007E", "#9D8CF3", "#BFB2FF", "#DDD6FF"],
      ["#9F5EB5", "#C284D7", "#DBA2ED", "#F3D8FB"],
    ]

    return (
      <div className={styles.MainDiv}>
        <div className={styles.leftColumn}>
          <h1 style={{color: Colors[0][0]}}>Team 2485 View</h1>
          <h3>Team Name</h3>
          <div className={styles.EPAS}>
            <div className={styles.EPA}>
              <div className={styles.scoreBreakdownContainer}>
                <div style={{background: Colors[0][1]}} className={styles.epaBox}>0</div>
                <div className={styles.epaBreakdown}>
                  <div style={{background: Colors[0][3]}}>A: 0</div>
                  <div style={{background: Colors[0][3]}}>T: 0</div>
                  <div style={{background: Colors[0][3]}}>E: 0</div>
                </div>
              </div>
            </div>
            <div className={styles.Last3EPA}>
              <div className={styles.scoreBreakdownContainer}>
                <div style={{background: "orange"}} className={styles.Last3EpaBox}>0</div>
                <div className={styles.epaBreakdown}>
                  <div style={{background: "yellow"}}>A: 0</div>
                  <div style={{background: "green"}}>T: 0</div>
                  <div style={{background: "red"}}>E: 0</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }