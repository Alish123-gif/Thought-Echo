import React from 'react'
import Pagination from '../pagination/Pagination'
import styles from './cardList.module.css'
import Image from 'next/image'
const CardList = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Recent Posts</h1>
            <div className={styles.posts}>
                <div className={styles.post}>
                    <div className={styles.imageContainer}>
                        {/* <Image
                            src="/p1.jpeg"
                            alt=""
                            width={2000}
                            height={2000} /> */}
                    </div>
                </div>
            </div>
            <Pagination />
        </div>
    )
}

export default CardList