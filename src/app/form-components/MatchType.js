"use client";
import { useState, useEffect } from 'react';
import styles from './MatchType.module.css';

export default function MatchType({ onMatchTypeChange, defaultValue }) {
    const [selectedType, setSelectedType] = useState(defaultValue);

    useEffect(() => {
        if (defaultValue) {
            setSelectedType(defaultValue);
            onMatchTypeChange(defaultValue)
        }
    }, [setSelectedType, onMatchTypeChange]);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setSelectedType(newValue);
        onMatchTypeChange(newValue);
    };
    console.log("matchtype",selectedType);
    console.log("default value",defaultValue)

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