"use client";
import React, { useState, useEffect } from 'react'
import Pagination from '../pagination/Pagination'
import styles from './recentPosts.module.css'
import Card from '../card/Card'
import { getPosts } from '@/utils/api'
import { enrichPostsWithCategoriesOptimized } from '@/utils/postHelpers'
import LoadingSpinner from '../ui/LoadingSpinner'
import DataMessage from '../ui/DataMessage'

const RecentPosts = ({
    category = '',
    limit = 6,
    showPagination = true,
    title = "Recent Posts"
}) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);

    // Extract fetch logic into a separate function for reuse
    const fetchPosts = async () => {
        try {
            setLoading(true);
            setError(null);

            const params = {
                page: currentPage,
                limit: limit,
                published: 'true'
            };

            if (category) {
                params.category = category;
            }

            const data = await getPosts(params);

            // Use the utility function to enrich posts with category data
            const postsWithCategories = await enrichPostsWithCategoriesOptimized(data.posts || []);

            setPosts(postsWithCategories);
            setTotalPages(data.totalPages || 0);
            setTotalPosts(data.totalPosts || 0);
        } catch (err) {
            console.error('Error fetching posts:', err);
            setError(err.message || 'Failed to load posts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [currentPage, limit, category]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Retry function that only re-fetches data
    const handleRetry = () => {
        fetchPosts();
    }; if (loading) {
        return (
            <div className={styles.container}>
                <h1 className={styles.title}>{title}</h1>
                <div className={styles.loadingContainer}>
                    <LoadingSpinner />
                </div>
            </div>
        );
    } if (error) {
        return (
            <div className={styles.container}>
                <h1 className={styles.title}>{title}</h1>
                <div className={styles.errorContainer}>                    <DataMessage
                    type="error"
                    title="Error Loading Posts"
                    message={error}
                    showRetry={true}
                    onRetry={handleRetry}
                />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{title}</h1>            <div className={styles.posts}>
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <Card key={post.id} post={post} />
                    ))
                ) : (
                    <div className={styles.emptyState}>
                        <h3>No posts found</h3>
                        <p>
                            {category
                                ? `No posts available in the "${category}" category at the moment.`
                                : 'No posts have been published yet. Check back later for updates!'
                            }
                        </p>
                    </div>
                )}
            </div>
            {showPagination && totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalPosts={totalPosts}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
};

export default RecentPosts