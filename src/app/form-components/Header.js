import styles from "./Header.module.css";

export default function Header ({ headerName }) {
    return (
        <div className={styles.header}>
            <span>{headerName}</span>
            <hr></hr>
            
        </div>
    )
}