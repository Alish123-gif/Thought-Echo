"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { getPostBySlug } from "@/utils/api";
import styles from "./postDetails.module.css";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import DataMessage from "@/components/ui/DataMessage";
import Image from "next/image";
import Link from "next/link";

const PostDetailsPage = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);    // Extract fetch logic into a separate function for reuse
    const fetchPost = useCallback(async () => {
        if (!slug) return;
        try {
            setLoading(true);
            setError(null);
            const data = await getPostBySlug(slug);
            setPost(data);
        } catch (err) {
            console.error('Error fetching post:', err);
            setError(err.message || "Failed to load post details");
        } finally {
            setLoading(false);
        }
    }, [slug]);

    // Retry function that only re-fetches data
    const handleRetry = () => {
        fetchPost();
    };

    useEffect(() => {
        fetchPost();
    }, [fetchPost]); if (loading) return <LoadingSpinner />;
    if (error) return <DataMessage type="error" title="Error Loading Post" message={error} showRetry={true} onRetry={handleRetry} />;
    if (!post) return null; return (
        <div className={styles.container}>
            {post.imageUrl && (
                <div className={styles.imageContainer}>
                    <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className={styles.image}
                        priority
                    />
                </div>
            )}
            <div className={styles.header}>
                {post.category && (
                    <Link href={`/posts?category=${post.category.slug || post.category.id || post.category}`} style={{ textDecoration: 'none' }}>
                        <span className={styles.category}>
                            {typeof post.category === 'object' ? post.category.name : post.category}
                        </span>
                    </Link>
                )}
                <h1 className={styles.title}>{post.title}</h1>
                <div className={styles.meta}>
                    {post.author && (
                        <Link href={`/profile/${post.authorId}`} style={{ textDecoration: 'none' }}>
                            <span className={styles.author}>By {post.author.name || "Unknown"}</span>
                        </Link>
                    )}
                    {!post.author && <span className={styles.author}>By Unknown</span>}
                    <span className={styles.date}>
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </span>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.description}>{post.description}</div>
                <div
                    className={styles.body}
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {post.tags && post.tags.length > 0 && (
                    <div className={styles.tags}>
                        {post.tags.map((tag) => (
                            <Link href={`/posts?tag=${tag}`} key={tag} style={{ textDecoration: 'none' }}>
                                <span className={styles.tag}>#{tag}</span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostDetailsPage;
