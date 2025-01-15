 "use client";
 import styles from './MatchType.module.css';
 
 export default function MatchType () {
    return (
        <div className={styles.MatchType}>
        <div className={styles.radioGroup}>
        <label>
            <input
              type="radio"
              name="matchtype"
              value="precomp"
            />
            Pre-Comp
          </label>
          <label>
            <input
              type="radio"
              name="matchtype"
              value="practice"
            />
            Practice
          </label>
          <label>
            <input
              type="radio"
              name="matchtype"
              value="qual"
              defaultChecked
            />
            Qual
          </label>
          <label>
            <input
              type="radio"
              name="matchtype"
              value="elim"
            />
            Elim
          </label>
        </div>
      </div>
    )
 }