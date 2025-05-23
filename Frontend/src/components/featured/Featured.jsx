"use client"
import React, { useEffect, useState, useRef } from 'react'
import styles from './featured.module.css'
import Image from 'next/image'
import { getFeaturedPosts } from "@/utils/api";
import LoadingSpinner from '../ui/LoadingSpinner';
import DataMessage from '../ui/DataMessage';
import { ChevronLeftCircle, ChevronRightCircle } from 'lucide-react';
const Featured = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [postIndex, setPostIndex] = useState(0);
    const [animationDirection, setAnimationDirection] = useState(null);

    const handleChangePosts = (direction) => {
        // First remove animation to reset it
        setAnimationDirection(null);

        // Use setTimeout to ensure state updates in sequence
        setTimeout(() => {
            // Set direction for appropriate animation
            setAnimationDirection(direction);

            // Update post index based on direction
            setPostIndex((prevIndex) => {
                if (direction === 'left') {
                    return prevIndex === 0 ? posts.length - 1 : prevIndex - 1;
                } else {
                    return prevIndex === posts.length - 1 ? 0 : prevIndex + 1;
                }
            });
        }, 10);
    };

    const fetchFeaturedPosts = async () => {
        try {
            const response = await getFeaturedPosts();
            setPosts(response);
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchFeaturedPosts();
    }, []);
    useEffect(() => {
        // Reset animation after it completes
        if (animationDirection) {
            const timer = setTimeout(() => {
                setAnimationDirection(null);
            }, 500); // Match animation duration in CSS
            return () => clearTimeout(timer);
        }
    }, [animationDirection]);
    if (loading) {
        return <LoadingSpinner />;
    }
    if (error) {
        return <DataMessage type="warning" title="Error fetching featured posts" message={error} action={fetchFeaturedPosts} />;
    }
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>
                <b>Ali reporting in</b>—echoes of insight, inspiration, and innovation.
            </h1>
            <div className={styles.featuredContainer}>
                {posts.length > 1 && (
                    <button
                        className={styles.arrowButton}
                        onClick={() => handleChangePosts('left')}
                        aria-label="Previous featured post"
                        type="button"
                    >
                        <ChevronLeftCircle className={styles.arrowIcon} />
                    </button>
                )}
                <div
                    className={`${styles.post} ${animationDirection === 'left' ? styles.slideRight : animationDirection === 'right' ? styles.slideLeft : ''}`}
                >
                    <React.Fragment key={posts[postIndex].id}>
                        <div className={styles.imgContainer}>
                            <Image
                                className={styles.image}
                                src={posts[postIndex].imageUrl}
                                alt="Featured Image"
                                fill
                            />
                        </div>
                        <div className={styles.textContainer}>
                            <h2 className={styles.postTitle}>{posts[postIndex].title}</h2>
                            <p className={styles.postDesc}>{posts[postIndex].description}</p>
                            <button className={styles.button}>Read More</button>
                        </div>
                    </React.Fragment>
                </div>
                {posts.length > 1 && (
                    <button
                        className={styles.arrowButton}
                        onClick={() => handleChangePosts('right')}
                        aria-label="Next featured post"
                        type="button"
                    >
                        <ChevronRightCircle className={styles.arrowIcon} />
                    </button>
                )}
            </div>

        </div>
    )
}

export default Featured