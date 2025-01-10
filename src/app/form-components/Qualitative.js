"use client";
import { useEffect, useState } from 'react'
import styles from './Qualitative.module.css'

export default function Qualitative ({ visibleName, internalName, description, symbol="★"}) {
    const [rating, setRating] = useState(-1);

    const ratingDescriptions = [
        "Low ",
        "Relatively Low ",
        "Just Below Average ",
        "Just Above Average ",
        "Relatively High ",
        "High "
    ];

    return (
        <div className={styles.qual}>
            <br></br>
            <label htmlFor={internalName}>{visibleName}</label>
            <input type="hidden" name={internalName} value={rating}/>
            <hr></hr>
            <div className={styles.ratings}>
                {[0,1,2,3,4,5].map(ratingValue => {
                    return <div className={styles.symbol + (ratingValue <= rating ? " " + styles.selected : "")} key={ratingValue} onClick={() => setRating(ratingValue)}>{symbol}</div>
                })}
            </div>
            
            {(description == "Amp Speed" || description == "Speaker Speed" || description == "Trap Speed") && rating === -1 && (
                        <div>
                            Not Applicable 
                        </div>
            )}
            {rating === -1 && description == "Maneuverability" && (

                <div>
                    Did Not Move 
                </div>
            )}
             {rating === -1 && description == "Onstage Speed" && (

                <div>
                    Did Not Try To Go Onstage 
                </div>
            )}
             {rating === -1 && description == "Harmony Speed" && (

                <div>
                    Did Not Try To Harmonize 
                </div>
            )}
            {rating === -1 && description == "Ability To Play Defense" && (

                <div>
                    Did Not Defend  
                </div>
            )}

            {rating === -1 && description == "Defense Evasion Ability" && (

                <div>
                    Was Not Defended Against  
                </div>
            )}


            {rating === -1 && description == "Aggression" && (

                <div>
                    Did Not Move 
                </div>
            )}

            {rating === -1 && description == "Stagehazard" && (

                <div>
                    Did Not Interact With Teamates On Stage
                </div>
                
            )}
            {rating >= 0 && (

                <div>
                    {ratingDescriptions[rating]} {description}
                </div>
            )}

           


            <button type="button" className="Clear" onClick={() => setRating(-1)}>Clear</button>
        </div>
    )
}
