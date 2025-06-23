import Image from "next/image";
import styles from "./card.module.css";
import Link from "next/link";

const Card = ({ post }) => {
    if (!post) {
        return (
            <div className={styles.container}>
                <div className={styles.textContainer}>
                    <div className={styles.desc}>No post data available</div>
                </div>
            </div>
        );
    }

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Truncate description
    const truncateDescription = (text, maxLength = 150) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    return (
        <div className={styles.container}>            {post.imageUrl && (
            <div className={styles.imageContainer}>
                <Image
                    src={post.imageUrl}
                    alt={post.title || "Post Image"}
                    fill
                    className={styles.image}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={false}
                />
            </div>
        )}
            <div className={styles.textContainer}>
                <div className={styles.detail}>
                    <span className={styles.date}>{formatDate(post.createdAt)} - </span>
                    <span className={styles.category}>
                        {typeof post.category === 'object' ? post.category.name : post.category || 'Uncategorized'}
                    </span>
                </div>
                <Link href={`/post/${post.slug}`}>
                    <h1>{post.title}</h1>
                </Link>
                <div className={styles.desc}>
                    {truncateDescription(post.description)}
                </div>
                <Link href={`/post/${post.slug}`} className={styles.link}>
                    Read More
                </Link>
            </div>
        </div>
    );
};

export default Card;