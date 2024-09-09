import Image from 'next/image'
import styles from './card.module.css'
import Link from 'next/link'

const Card = () => {
    return (
        <div className={styles.container}>
            <div className={styles.imageContainer}>
                <Image
                    className={styles.image}
                    src="/p1.jpeg"
                    alt=""
                    fill />
            </div>
            <div className={styles.textContainer}>
                <div className={styles.detail}>
                    <span className={styles.date}>11.09.2024 - </span>
                    <span className={`${styles.category} ${styles.coding}`}>Coding</span>
                </div>
                <h1 className={styles.title}>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Suscipit, nobis?</h1>
                <p className={styles.desc}>Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Non ipsam perspiciatis exercitationem doloribus eius
                    tenetur, voluptas minima asperiores repudiandae vel
                    repellat sapiente, blanditiis quaerat iure possimus
                    deserunt laboriosam pariatur inventore.
                </p>
                <Link className={`${styles.readMore} ${styles.coding}`} href="/">
                    Read More
                </Link>
            </div>
        </div>
    )
}

export default Card