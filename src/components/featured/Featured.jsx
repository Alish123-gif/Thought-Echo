import React from 'react'
import styles from './featured.module.css'
import Image from 'next/image'
const Featured = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>
                <b>Ali reporting in</b>—echoes of insight, inspiration, and innovation.
            </h1>
            <div className={styles.post}>
                <div className={styles.imgContainer}>
                    <Image
                        className={`${styles.image}`}
                        src="/p1.jpeg"
                        alt="Featured Image"
                        fill
                    />
                </div>
                <div className={styles.textContainer}>
                    <h2 className={styles.postTitle}>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consequuntur, asperiores?</h2>
                    <p className={styles.postDesc}>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Debitis minus nulla culpa soluta, labore odio, nisi laboriosam magni corporis quo architecto a reiciendis dicta magnam aliquid perspiciatis assumenda nobis libero.</p>
                    <button className={styles.button}>Read More</button>
                </div>
            </div>
        </div>
    )
}

export default Featured