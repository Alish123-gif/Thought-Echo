"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getPosts, deletePost, getUserPosts } from '@/utils/api';
import Link from 'next/link';
import { FaEye, FaEdit, FaTrashAlt, FaPlus, FaSearch, FaFilter, FaSort } from 'react-icons/fa';
import { IoIosRefresh } from 'react-icons/io';
import styles from './adminPosts.module.css';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import useDebounce from '@/hooks/useDebounce';

const AdminPostsPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [posts, setPosts] = useState([]);
    const [allPosts, setAllPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [sortField, setSortField] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState('desc');
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [totalPosts, setTotalPosts] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [filterOpen, setFilterOpen] = useState(false);
    const [categories, setCategories] = useState([]);

    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // Check authentication
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login?callbackUrl=/admin/posts');
        }
    }, [status, router]);    // Fetch posts
    useEffect(() => {
        const fetchPosts = async () => {
            if (status !== 'authenticated') return;
            try {
                setLoading(true);
                const token = session?.accessToken;

                const data = await getUserPosts(token, {
                    page: currentPage,
                    limit: postsPerPage
                });

                // Extract unique categories
                const uniqueCategories = [...new Set(data.posts.map(post => post.category))];
                setCategories(uniqueCategories);

                setPosts(data.posts || []);
                setAllPosts(data.posts || []);
                setTotalPosts(data.totalPosts || 0);
                setTotalPages(data.totalPages || 1);
            } catch (err) {
                console.error('Error fetching posts:', err);
                setError(err.message || 'Failed to load posts');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [session, status, currentPage, postsPerPage]);    // Filter and sort posts
    useEffect(() => {
        if (loading || !allPosts.length) return;

        let filteredPosts = [...allPosts];

        // Apply search filter
        if (debouncedSearchTerm) {
            filteredPosts = filteredPosts.filter(post =>
                post.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                post.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                (post.tags && post.tags.some(tag => tag.toLowerCase().includes(debouncedSearchTerm.toLowerCase())))
            );
        }

        // Apply category filter
        if (selectedCategory) {
            filteredPosts = filteredPosts.filter(post => post.category === selectedCategory);
        }

        // Apply status filter
        if (selectedStatus) {
            const isPublished = selectedStatus === 'published';
            filteredPosts = filteredPosts.filter(post => post.isPublished === isPublished);
        }

        // Apply sorting
        filteredPosts.sort((a, b) => {
            let valueA = a[sortField];
            let valueB = b[sortField];

            if (sortField === 'createdAt' || sortField === 'updatedAt') {
                valueA = new Date(valueA);
                valueB = new Date(valueB);
            }

            if (valueA < valueB) {
                return sortDirection === 'asc' ? -1 : 1;
            }
            if (valueA > valueB) {
                return sortDirection === 'asc' ? 1 : -1;
            }
            return 0;
        });

        setPosts(filteredPosts);
    }, [debouncedSearchTerm, selectedCategory, selectedStatus, sortField, sortDirection, allPosts, loading]);

    // Handle page change
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };    // Handle delete post
    const handleDeletePost = async (id) => {
        if (!session?.accessToken) return;

        try {
            setDeleteLoading(true);
            await deletePost(id, session.accessToken);

            // Remove post from state
            setPosts(posts.filter(post => post.id !== id));
            setConfirmDelete(null);

            // Update total counts
            setTotalPosts(prev => prev - 1);
            setTotalPages(Math.ceil((totalPosts - 1) / postsPerPage));
        } catch (err) {
            console.error('Error deleting post:', err);
            setError(`Failed to delete post: ${err.message}`);
        } finally {
            setDeleteLoading(false);
        }
    };

    // Toggle sort direction
    const handleSortChange = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Reset filters
    const resetFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setSelectedStatus('');
        setSortField('createdAt');
        setSortDirection('desc');
        setFilterOpen(false);
        setPosts(allPosts); // Reset posts to allPosts
    };

    if (status === 'loading' || (status === 'authenticated' && loading)) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Manage Posts</h1>
                    <button className={styles.createButton} disabled>
                        <FaPlus /> New Post
                    </button>
                </div>
                <div className={styles.tableContainer}>
                    <div className={styles.loadingState}>
                        <LoadingSpinner size="large" color="#8B5CF6" />
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'authenticated' && error) {
        return (
            <div className={styles.container}>
                <div className={styles.errorContainer}>
                    <h2>Error loading posts</h2>
                    <p>{error}</p>
                    <button
                        className={styles.retryButton}
                        onClick={() => window.location.reload()}
                    >
                        <IoIosRefresh /> Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Manage Posts</h1>
                <Link href="/admin/write" className={styles.createButton}>
                    <FaPlus /> New Post
                </Link>
            </div>

            <div className={styles.controls}>
                <div className={styles.searchContainer}>
                    <div className={styles.searchInput}>
                        <FaSearch className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className={styles.filterButtons}>
                    <button
                        className={styles.filterButton}
                        onClick={() => setFilterOpen(!filterOpen)}
                    >
                        <FaFilter /> Filter
                    </button>

                    {(debouncedSearchTerm || selectedCategory || selectedStatus) && (
                        <button
                            className={styles.resetButton}
                            onClick={resetFilters}
                        >
                            Reset Filters
                        </button>
                    )}
                </div>
            </div>

            {filterOpen && (
                <div className={styles.filterPanel}>
                    <div className={styles.filterGroup}>
                        <label>Category</label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.filterGroup}>
                        <label>Status</label>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            <option value="">All Status</option>
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                        </select>
                    </div>

                    <div className={styles.filterGroup}>
                        <label>Sort By</label>
                        <div className={styles.sortOptions}>
                            <button
                                className={`${styles.sortButton} ${sortField === 'createdAt' ? styles.active : ''}`}
                                onClick={() => handleSortChange('createdAt')}
                            >
                                Date {sortField === 'createdAt' && (
                                    sortDirection === 'desc' ? '↓' : '↑'
                                )}
                            </button>
                            <button
                                className={`${styles.sortButton} ${sortField === 'title' ? styles.active : ''}`}
                                onClick={() => handleSortChange('title')}
                            >
                                Title {sortField === 'title' && (
                                    sortDirection === 'desc' ? '↓' : '↑'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.postsCountInfo}>
                {posts.length === 0 ? (
                    <p>No posts found. Create your first post!</p>
                ) : (
                    <p>Showing {posts.length} of {totalPosts} posts</p>
                )}
            </div>

            {posts.length > 0 && (
                <div className={styles.tableContainer}>
                    <table className={styles.postsTable}>
                        <thead>
                            <tr>
                                <th className={styles.imageColumn}>Image</th>
                                <th
                                    className={`${styles.titleColumn} ${styles.sortableColumn}`}
                                    onClick={() => handleSortChange('title')}
                                >
                                    Title {sortField === 'title' && (
                                        <FaSort className={styles.sortIcon} />
                                    )}
                                </th>
                                <th>Category</th>
                                <th>Status</th>
                                <th
                                    className={`${styles.dateColumn} ${styles.sortableColumn}`}
                                    onClick={() => handleSortChange('createdAt')}
                                >
                                    Date {sortField === 'createdAt' && (
                                        <FaSort className={styles.sortIcon} />
                                    )}
                                </th>
                                <th className={styles.actionsColumn}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map(post => (
                                <tr key={post.id}>
                                    <td className={styles.imageCell}>
                                        <div className={styles.postImageContainer}>
                                            <img
                                                src={post.imageUrl}
                                                alt={post.title}
                                                className={styles.postImage}
                                            />
                                        </div>
                                    </td>
                                    <td className={styles.titleCell}>
                                        <div className={styles.postTitle}>{post.title}</div>
                                        <div className={styles.postExcerpt}>
                                            {post.description.length > 80
                                                ? `${post.description.substring(0, 80)}...`
                                                : post.description}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={styles.categoryBadge}>
                                            {post.category}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${post.isPublished ? styles.published : styles.draft}`}>
                                            {post.isPublished ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className={styles.dateCell}>
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className={styles.actionsCell}>
                                        <div className={styles.actionButtons}>
                                            <Link
                                                href={`/posts/${post.slug}`}
                                                className={`${styles.actionButton} ${styles.viewButton}`}
                                                title="View post"
                                            >
                                                <FaEye />
                                            </Link>
                                            <Link
                                                href={`/admin/edit/${post.id}`}
                                                className={`${styles.actionButton} ${styles.editButton}`}
                                                title="Edit post"
                                            >
                                                <FaEdit />
                                            </Link>
                                            <button
                                                className={`${styles.actionButton} ${styles.deleteButton}`}
                                                onClick={() => setConfirmDelete(post.id)}
                                                title="Delete post"
                                            >
                                                <FaTrashAlt />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button
                        className={styles.paginationButton}
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        Previous
                    </button>

                    <div className={styles.pageNumbers}>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                className={`${styles.pageNumber} ${currentPage === i + 1 ? styles.currentPage : ''}`}
                                onClick={() => handlePageChange(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        className={styles.paginationButton}
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {confirmDelete && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Confirm Delete</h3>
                        <p>Are you sure you want to delete this post? This action cannot be undone.</p>
                        <div className={styles.modalButtons}>
                            <button
                                className={styles.cancelButton}
                                onClick={() => setConfirmDelete(null)}
                                disabled={deleteLoading}
                            >
                                Cancel
                            </button>
                            <button
                                className={styles.confirmDeleteButton}
                                onClick={() => handleDeletePost(confirmDelete)}
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPostsPage;
