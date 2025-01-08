import styles from './TextInput.module.css'
export default function TextInput ({ visibleName, internalName, defaultValue, type="text" }) {
    return (
        <div className={styles.TextInput}>
            <label htmlFor={internalName}>{visibleName}</label>
            <br></br>
            <input className="preMatchInput" type={type} id={internalName} name={internalName} defaultValue={defaultValue}></input>
            <br></br>
        </div>
    )
}