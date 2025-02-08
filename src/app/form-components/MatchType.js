 "use client";
 import styles from './MatchType.module.css';
 
 export default function MatchType () {
    return (
        <div className={styles.MatchType}>
        <div className={styles.radioGroup}>
        <label>
            <input
              type="radio"
              name="precomp"
              value="0"
            />
            Pre-Comp
          </label>
          <label>
            <input
              type="radio"
              name="practice"
              value="1"
            />
            Practice
          </label>
          <label>
            <input
              type="radio"
              name="qual"
              value="2"
              defaultChecked
            />
            Qual
          </label>
          <label>
            <input
              type="radio"
              name="elim"
              value="3"
            />
            Elim
          </label>
        </div>
      </div>
    )
 }