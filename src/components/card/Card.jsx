import Image from "next/image";
import styles from "./card.module.css";
import Link from "next/link";

const Card = () => {
    return (
        <div className={styles.container}>
            <div className={styles.imageContainer}>
                <Image src="/p1.jpeg" alt="Example Image" fill className={styles.image} />
            </div>
            <div className={styles.textContainer}>
                <div className={styles.detail}>
                    <span className={styles.date}>2023-10-01 - </span>
                    <span className={styles.category}>coding</span>
                </div>
                <Link href="/posts/example-slug">
                    <h1>Example Title</h1>
                </Link>
                <div className={styles.desc}>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Doloremque nesciunt, aliquam velit unde voluptates quis suscipit deserunt non molestiae quidem aut? Numquam nobis quaerat est quas magni nihil ut sint, quasi corporis voluptatem illo blanditiis fuga facilis, nesciunt non eaque quidem. Quisquam
                </div>
                <Link href="/posts/example-slug" className={styles.link}>
                    Read More
                </Link>
            </div>
        </div>
    );
};

export default Card;