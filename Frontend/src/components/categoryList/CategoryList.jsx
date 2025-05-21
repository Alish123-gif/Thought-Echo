import React from 'react'
import styles from './categoryList.module.css'
import Link from 'next/link'
import Image from 'next/image'
const CategoryList = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Categories</h1>
            <div className={styles.categories}>
                <Link href="/blog?cat=style" className={`${styles.category} ${styles.style}`}>
                    <Image
                        className={styles.image}
                        src="/style.png"
                        alt=""
                        width={32} height={32} />
                    style
                </Link>
                <Link href="/blog?cat=style" className={`${styles.category} ${styles.coding}`}>
                    <Image
                        className={styles.image}
                        src="/coding.png"
                        alt=""
                        width={32} height={32} />
                    coding
                </Link>
                <Link href="/blog?cat=style" className={`${styles.category} ${styles.culture}`}>
                    <Image
                        className={styles.image}
                        src="/culture.png"
                        alt=""
                        width={32} height={32} />
                    culture
                </Link>
                <Link href="/blog?cat=style" className={`${styles.category} ${styles.travel}`}>
                    <Image
                        className={styles.image}
                        src="/travel.png"
                        alt=""
                        width={32} height={32} />
                    travel
                </Link>
                <Link href="/blog?cat=style" className={`${styles.category} ${styles.food}`}>
                    <Image
                        className={styles.image}
                        src="/food.png"
                        alt=""
                        width={32} height={32} />
                    food
                </Link>
            </div>
        </div>
    )
}

export default CategoryList