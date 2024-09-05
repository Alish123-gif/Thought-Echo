import React from 'react'
import Pagination from '../pagination/Pagination'
import styles from './CardList.module.css'
const CardList = () => {
    return (
        <div className={styles.container}>
            Card List
            <Pagination />
        </div>
    )
}

export default CardList