"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { getPosts, getFeaturedPosts } from "@/utils/api";
import { enrichPostsWithCategoriesOptimized } from "@/utils/postHelpers";
import styles from "./menuPosts.module.css";
import LoadingSpinner from "../ui/LoadingSpinner";

const MenuPosts = ({ withImage, type = "popular", limit = 4 }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                setError(null);

                let data;
                if (type === "featured") {
                    data = await getFeaturedPosts(limit);
                } else {
                    // For popular posts, get recent posts
                    const response = await getPosts({
                        page: 1,
                        limit: limit,
                        published: 'true'
                    });
                    data = response.posts || [];
                }

                // Enrich posts with category data and fix image field inconsistency
                const enrichedPosts = await enrichPostsWithCategoriesOptimized(data);
                setPosts(enrichedPosts);
            } catch (err) {
                console.error('Error fetching menu posts:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [type, limit]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
        });
    };

    const truncateTitle = (title, maxLength = 60) => {
        if (!title) return '';
        return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
    };

    const getCategoryStyle = (category) => {
        const categoryName = category?.toLowerCase() || 'default';
        return styles[categoryName] || styles.default;
    };

    if (loading) {
        return (
            <div className={styles.items}>
                <LoadingSpinner />
            </div>
        );
    }

    if (error || !posts.length) {
        return (
            <div className={styles.items}>
                <div className={styles.noPostsMessage}>
                    {error ? 'Failed to load posts' : 'No posts available'}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.items}>
            {posts.map((post) => (
                <Link key={post.id} href={`/post/${post.slug}`} className={styles.item}>                    {withImage && post.imageUrl && (
                    <div className={styles.imageContainer}>
                        <Image
                            src={post.imageUrl}
                            alt={post.title || "Post Image"}
                            fill
                            className={styles.image}
                            sizes="(max-width: 480px) 55px, (max-width: 640px) 60px, (max-width: 768px) 70px, (max-width: 1024px) 75px, 80px"
                            priority={false}
                        />
                    </div>
                )}
                    <div className={styles.textContainer}>
                        <span className={`${styles.category} ${getCategoryStyle(post.category)}`}>
                            {post.category || 'Uncategorized'}
                        </span>
                        <h3 className={styles.postTitle}>
                            {truncateTitle(post.title)}
                        </h3>
                        <div className={styles.detail}>
                            <span className={styles.username}>{post.author?.name || 'Anonymous'}</span>
                            <span className={styles.date}> - {formatDate(post.createdAt)}</span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default MenuPosts;