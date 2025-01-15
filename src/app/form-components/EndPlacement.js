import { useEffect, useState } from 'react';
import styles from './EndPlacement.module.css'

export default function EndPlacement () {

    const [endLocation, setEndLocation] = useState(0);
    const [multicage, setMultiCage] = useState(false);

    useEffect(() => {
        if (multicage && (endLocation != 3 ||endLocation != 4)) setMultiCage(false);
        console.log(endLocation);
    }, [multicage, endLocation]);

    return (
        <div className={styles.endPossibilities}>
            <div className={styles.option} onClick={(e) => {e.target.querySelector("input")?.click();}}>
                <input name="endlocation" type="radio" id="None" value={0} defaultChecked onChange={(e) => setEndLocation(e.target.value)}></input>
                <label htmlFor="None">None</label>
            </div>
            <div className={styles.option} onClick={(e) => {e.target.querySelector("input")?.click();}}>
                <input name="endlocation" type="radio" id="Park" value={1} onChange={(e) => setEndLocation(e.target.value)}></input>
                <label htmlFor="Park">Park</label>
            </div>
            <div className={styles.option} onClick={(e) => {e.target.querySelector("input")?.click();}}>
                <input name="endlocation" type="radio" id="FailAndPark" value={2} onChange={(e) => setEndLocation(e.target.value)}></input>
                <label htmlFor="FailAndPark">Fail + Park</label>
            </div>
            <div className={styles.option} onClick={(e) => {e.target.querySelector("input")?.click();}}>
                <input name="endlocation" type="radio" id="ShallowSuccess" value={3} onChange={(e) => setEndLocation(e.target.value)}></input>
                <label htmlFor="ShallowSuccess">Shallow Cage</label>
            </div>
            <div className={styles.option} onClick={(e) => {e.target.querySelector("input")?.click();}}>
                <input name="endlocation" type="radio" id="DeepSuccess" value={4} onChange={(e) => setEndLocation(e.target.value)}></input>
                <label htmlFor="DeepSuccess">Deep Cage</label>
            </div>
            { (endLocation == 3 || endLocation == 4) &&
                <>
                    <div className={styles.checkOption} onClick={(e) => {e.target.querySelector("input")?.click();}}>
                        <input type="checkbox" id="MultiCage" name="multicage" onChange={(e) => {setMultiCage(e.target.checked)}}></input>
                        <label htmlFor="multicage">Multi-Cage Climb?</label>
                    </div>
                </>
            }
        </div>
    )
}