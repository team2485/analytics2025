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
              value="0"
            />
            Pre-Comp
          </label>
          <label>
            <input
              type="radio"
              name="matchtype"
              value="1"
            />
            Practice
          </label>
          <label>
            <input
              type="radio"
              name="matchtype"
              value="2"
              defaultChecked
            />
            Qual
          </label>
          <label>
            <input
              type="radio"
              name="matchtype"
              value="3"
            />
            Elim
          </label>
        </div>
      </div>
    )
 }