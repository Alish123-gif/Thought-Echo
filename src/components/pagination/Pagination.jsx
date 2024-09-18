import React from 'react'
import styles from './pagination.module.css'
const Pagination = () => {
    return (
        <div className={styles.container}>
            <button className={styles.button}>back</button>
            <button className={styles.button}>next</button>
        </div>
    )
}

export default Pagination