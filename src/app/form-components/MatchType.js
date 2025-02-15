"use client";
import { useState } from 'react';
import styles from './MatchType.module.css';

export default function MatchType({ onMatchTypeChange }) {
    const [selectedType, setSelectedType] = useState("2"); // Default to Qual

    const handleChange = (e) => {
        setSelectedType(e.target.value);
        onMatchTypeChange(e.target.value);
    };

    return (
        <div className={styles.MatchType}>
            <div className={styles.radioGroup}>
                <label>
                    <input
                        type="radio"
                        name="matchType"
                        value="0"
                        checked={selectedType === "0"}
                        onChange={handleChange}
                    />
                    Pre-Comp
                </label>
                <label>
                    <input
                        type="radio"
                        name="matchType"
                        value="1"
                        checked={selectedType === "1"}
                        onChange={handleChange}
                    />
                    Practice
                </label>
                <label>
                    <input
                        type="radio"
                        name="matchType"
                        value="2"
                        checked={selectedType === "2"}
                        onChange={handleChange}
                    />
                    Qual
                </label>
                <label>
                    <input
                        type="radio"
                        name="matchType"
                        value="3"
                        checked={selectedType === "3"}
                        onChange={handleChange}
                    />
                    Elim
                </label>
            </div>
        </div>
    );
}