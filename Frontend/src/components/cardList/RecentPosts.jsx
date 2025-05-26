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

    useEffect(() => {
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
                } const data = await getPosts(params);

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

        fetchPosts();
    }, [currentPage, limit, category]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <h1 className={styles.title}>{title}</h1>
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <h1 className={styles.title}>{title}</h1>
                <DataMessage
                    type="error"
                    message={error}
                    showRetry={true}
                    onRetry={() => window.location.reload()}
                />
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
                    <DataMessage
                        type="info"
                        message="No posts found"
                    />
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