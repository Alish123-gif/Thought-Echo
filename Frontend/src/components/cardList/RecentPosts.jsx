"use client";
import React, { useState, useEffect, useCallback } from 'react'
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
    title = "Recent Posts",
    initialData = null
}) => {
    const [posts, setPosts] = useState(initialData?.posts || []);
    const [loading, setLoading] = useState(!initialData);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(initialData?.pagination?.totalPages || 0);
    const [totalPosts, setTotalPosts] = useState(initialData?.pagination?.totalPosts || 0);// Extract fetch logic into a separate function for reuse
    const fetchPosts = useCallback(async () => {
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
            } const data = await getPosts(params);

            // Check if posts already have category data (from optimized endpoint)
            let postsWithCategories;
            if (data.posts?.[0]?.category?.name) {
                // Posts already have category data
                postsWithCategories = data.posts.map(post => ({
                    ...post,
                    category: post.category?.name || 'Uncategorized',
                    image: post.imageUrl || post.image
                }));
            } else {
                // Use the utility function to enrich posts with category data
                postsWithCategories = await enrichPostsWithCategoriesOptimized(data.posts || []);
            }

            setPosts(postsWithCategories);
            setTotalPages(data.totalPages || 0);
            setTotalPosts(data.totalPosts || 0);
        } catch (err) {
            console.error('Error fetching posts:', err);
            setError(err.message || 'Failed to load posts');
        } finally {
            setLoading(false);
        }
    }, [currentPage, limit, category, initialData]);

    useEffect(() => {
        // Only fetch data if we don't have initial data or if params changed
        if (!initialData || category) {
            fetchPosts();
        }
    }, [fetchPosts, initialData]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };    // Retry function that only re-fetches data
    const handleRetry = () => {
        fetchPosts();
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <h1 className={styles.title}>{title}</h1>
                <div className={styles.loadingContainer}>
                    <LoadingSpinner />
                </div>        </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <h1 className={styles.title}>{title}</h1>
                <div className={styles.errorContainer}>
                    <DataMessage
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
            <h1 className={styles.title}>{title}</h1>
            <div className={styles.posts}>
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