"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getPosts } from '@/utils/api';
import styles from './posts.module.css';
import { FaSearch, FaFilter, FaTh, FaList, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import { IoIosRefresh } from 'react-icons/io';
import Link from 'next/link';
import Image from 'next/image';
import { SEARCH_DEBOUNCE_DELAY } from '@/utils/constants';
import useDebounce from '@/hooks/useDebounce';
import DataMessage from '@/components/ui/DataMessage';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { getCategories } from '@/utils/categoryService';

const PostsPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get URL params with defaults
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;
    const category = searchParams.get('category') || '';
    const tag = searchParams.get('tag') || '';
    const searchQuery = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'newest';
    const view = searchParams.get('view') || 'grid';
    const featured = searchParams.get('featured') || '';

    // State
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalPages, setTotalPages] = useState(0); const [searchTerm, setSearchTerm] = useState(searchQuery);
    const [selectedCategory, setSelectedCategory] = useState(category);
    const [selectedTag, setSelectedTag] = useState(tag);
    const [viewMode, setViewMode] = useState(view);
    const [sortOrder, setSortOrder] = useState(sort);
    const [isFeatured, setIsFeatured] = useState(featured === 'true');
    const [openFilters, setOpenFilters] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const [availableTags, setAvailableTags] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Debounce search term to avoid too many requests
    const debouncedSearchTerm = useDebounce(searchTerm, SEARCH_DEBOUNCE_DELAY);
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories();
                setCategories(response);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    // Fetch posts based on filters
    const fetchPosts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const options = {
                page,
                limit,
                category: selectedCategory || undefined,
                tag: selectedTag || undefined,
                featured: isFeatured || undefined,
                // The sorting is handled on the client side in this implementation
            };

            const data = await getPosts(options);

            // Extract unique tags from all posts for the filter dropdown
            const tags = new Set();
            data.posts.forEach(post => {
                if (post.tags && Array.isArray(post.tags)) {
                    post.tags.forEach(tag => tags.add(tag));
                }
            });
            setAvailableTags(Array.from(tags));            // Filter by search term on the client side
            let filteredPosts = data.posts;
            if (debouncedSearchTerm) {
                setIsSearching(true);
                filteredPosts = filteredPosts.filter(post =>
                    post.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                    post.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                    (post.tags && post.tags.some(tag => tag.toLowerCase().includes(debouncedSearchTerm.toLowerCase())))
                );
                setIsSearching(false);
            }

            // Sort posts based on sort order
            if (sortOrder === 'newest') {
                filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            } else if (sortOrder === 'oldest') {
                filteredPosts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            } else if (sortOrder === 'title-asc') {
                filteredPosts.sort((a, b) => a.title.localeCompare(b.title));
            } else if (sortOrder === 'title-desc') {
                filteredPosts.sort((a, b) => b.title.localeCompare(a.title));
            }

            setPosts(filteredPosts);
            setTotalPosts(data.totalPosts);
            setTotalPages(data.totalPages);
        } catch (err) {
            console.error('Error fetching posts:', err);
            setError(err.message || 'Failed to load posts');
        } finally {
            setLoading(false);
        }
    }, [page, limit, selectedCategory, selectedTag, debouncedSearchTerm, sortOrder, isFeatured]);

    // Update URL with filters
    const updateUrlParams = useCallback(() => {
        const params = new URLSearchParams();
        if (page !== 1) params.set('page', page.toString());
        if (limit !== 12) params.set('limit', limit.toString());
        if (selectedCategory) params.set('category', selectedCategory);
        if (selectedTag) params.set('tag', selectedTag);
        if (searchTerm) params.set('search', searchTerm);
        if (sortOrder !== 'newest') params.set('sort', sortOrder);
        if (viewMode !== 'grid') params.set('view', viewMode);
        if (isFeatured) params.set('featured', 'true');

        const queryString = params.toString();
        router.push(`/posts${queryString ? `?${queryString}` : ''}`);
    }, [router, page, limit, selectedCategory, selectedTag, searchTerm, sortOrder, viewMode, isFeatured]);

    // Handle search submission
    const handleSearch = (e) => {
        e.preventDefault();
        router.push(`/posts?page=1&search=${searchTerm}${selectedCategory ? `&category=${selectedCategory}` : ''}${selectedTag ? `&tag=${selectedTag}` : ''}${isFeatured ? '&featured=true' : ''}`);
    };

    // Handle filter changes
    const applyFilters = () => {
        router.push(`/posts?page=1${selectedCategory ? `&category=${selectedCategory}` : ''}${selectedTag ? `&tag=${selectedTag}` : ''}${searchTerm ? `&search=${searchTerm}` : ''}${isFeatured ? '&featured=true' : ''}`);
        setOpenFilters(false);
    };

    // Reset filters
    const resetFilters = () => {
        setSelectedCategory('');
        setSelectedTag('');
        setSearchTerm('');
        setIsFeatured(false);
        setSortOrder('newest');
        router.push('/posts');
        setOpenFilters(false);
    };

    // Retry loading on error
    const handleRetry = () => {
        setRetryCount(prev => prev + 1);
    };

    // Change page
    const handlePageChange = (newPage) => {
        router.push(`/posts?page=${newPage}${selectedCategory ? `&category=${selectedCategory}` : ''}${selectedTag ? `&tag=${selectedTag}` : ''}${searchTerm ? `&search=${searchTerm}` : ''}${isFeatured ? '&featured=true' : ''}`);
    };

    // Toggle view mode (grid/list)
    const toggleViewMode = () => {
        const newMode = viewMode === 'grid' ? 'list' : 'grid';
        setViewMode(newMode);
        const params = new URLSearchParams(searchParams.toString());
        params.set('view', newMode);
        router.push(`/posts?${params.toString()}`);
    };

    // Toggle sort order
    const toggleSortOrder = () => {
        let newOrder;
        switch (sortOrder) {
            case 'newest':
                newOrder = 'oldest';
                break;
            case 'oldest':
                newOrder = 'title-asc';
                break;
            case 'title-asc':
                newOrder = 'title-desc';
                break;
            default:
                newOrder = 'newest';
        }
        setSortOrder(newOrder);
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', newOrder);
        router.push(`/posts?${params.toString()}`);
    };
    // Effect to update URL when debounced search term changes
    useEffect(() => {
        if (debouncedSearchTerm !== searchQuery) {
            const params = new URLSearchParams(searchParams.toString());

            if (debouncedSearchTerm) {
                params.set('search', debouncedSearchTerm);
            } else {
                params.delete('search');
            }

            params.set('page', '1'); // Reset to first page on search change
            router.push(`/posts?${params.toString()}`);
        }
    }, [debouncedSearchTerm, router, searchParams, searchQuery]);
    // Fetch posts when params change
    useEffect(() => {
        let isMounted = true;

        const loadPosts = async () => {
            try {
                await fetchPosts();
            } catch (err) {
                if (isMounted) {
                    console.error('Error in loadPosts:', err);
                }
            }
        };

        loadPosts();

        // Cleanup
        return () => {
            isMounted = false;
        };
    }, [fetchPosts, retryCount]);

    // Format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Function to get the sort label for display
    const getSortLabel = () => {
        switch (sortOrder) {
            case 'newest':
                return 'Newest First';
            case 'oldest':
                return 'Oldest First';
            case 'title-asc':
                return 'Title (A-Z)';
            case 'title-desc':
                return 'Title (Z-A)';
            default:
                return 'Sort By';
        }
    };

    // Pagination section
    const renderPagination = () => {
        return (
            <div className={styles.pagination}>
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                    className={styles.pageButton}
                >
                    Previous
                </button>
                <div className={styles.pageNumbers}>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                            pageNum = i + 1;
                        } else if (page <= 3) {
                            pageNum = i + 1;
                        } else if (page >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                        } else {
                            pageNum = page - 2 + i;
                        }

                        return (
                            <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`${styles.pageNumber} ${page === pageNum ? styles.activePage : ''}`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                    {totalPages > 5 && page < totalPages - 2 && (
                        <>
                            <span className={styles.ellipsis}>...</span>
                            <button
                                onClick={() => handlePageChange(totalPages)}
                                className={styles.pageNumber}
                            >
                                {totalPages}
                            </button>
                        </>
                    )}
                </div>
                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages}
                    className={styles.pageButton}
                >
                    Next
                </button>
            </div>
        );
    };

    // Render posts in grid or list view
    const renderPosts = () => {
        if (posts.length === 0) {
            return (
                <DataMessage
                    type="info"
                    title="No posts found"
                    message="Try changing your search criteria or explore other categories."
                    action={
                        <button className={styles.resetButton} onClick={resetFilters}>
                            Reset Filters
                        </button>
                    }
                />
            );
        }

        return posts.map(post => (<div key={post.id} className={viewMode === 'grid' ? styles.postCard : styles.postListItem}>            <Link href={`/post/${post.slug}`} className={styles.postLink}>
            <div className={viewMode === 'grid' ? styles.postCardImageContainer : styles.postListImageContainer}>
                <Image
                    src={post.imageUrl}
                    alt={post.title}
                    className={viewMode === 'grid' ? styles.postCardImage : styles.postListImage}
                    width={viewMode === 'grid' ? 300 : 150}
                    height={viewMode === 'grid' ? 200 : 100}
                />
            </div>
            <div className={viewMode === 'grid' ? styles.postCardContent : styles.postListContent}>
                <div className={styles.postMeta}>
                    <span className={styles.postCategory}>
                        {typeof post.category === 'object' && post.category?.name ? post.category.name : post.category}
                    </span>
                    {post.isFeatured && <span className={styles.featuredBadge}>Featured</span>}
                </div>
                <h3 className={viewMode === 'grid' ? styles.postCardTitle : styles.postListTitle}>{post.title}</h3>
                <p className={viewMode === 'grid' ? styles.postCardDescription : styles.postListDescription}>
                    {post.description.length > 120
                        ? `${post.description.substring(0, 120)}...`
                        : post.description}
                </p>
                <div className={styles.postFooter}>
                    <div className={styles.postAuthor}>
                        {post.author?.name && `By ${post.author.name}`}
                    </div>
                    <div className={styles.postDate}>
                        {formatDate(post.createdAt)}
                    </div>
                    {post.readingTime && (
                        <div className={styles.readingTime}>
                            {post.readingTime} min read
                        </div>
                    )}
                </div>
                {viewMode === 'list' && post.tags && (
                    <div className={styles.postTags}>
                        {post.tags.map(tag => (
                            <span key={tag} className={styles.postTag}>
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </Link>
        </div>
        ));
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Explore Blog Posts</h1>
                <p className={styles.subtitle}>
                    Discover thought-provoking articles, insights, and stories from our community
                </p>
            </div>
            <div className={styles.controls}>
                <div className={styles.searchContainer}>
                    <div className={styles.searchForm}>
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                        <div className={styles.searchButton}>
                            {isSearching ? (
                                <span className={styles.searchingIndicator}></span>
                            ) : (
                                <FaSearch />
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.filterContainer}>
                    <button
                        className={styles.filterToggle}
                        onClick={() => setOpenFilters(!openFilters)}
                    >
                        <FaFilter />
                        <span>Filter</span>
                    </button>

                    <button className={styles.viewToggle} onClick={toggleViewMode}>
                        {viewMode === 'grid' ? <FaList /> : <FaTh />}
                        <span>{viewMode === 'grid' ? 'List View' : 'Grid View'}</span>
                    </button>

                    <button className={styles.sortToggle} onClick={toggleSortOrder}>
                        {sortOrder.includes('desc') ? <FaSortAmountDown /> : <FaSortAmountUp />}
                        <span>{getSortLabel()}</span>
                    </button>
                </div>

                {openFilters && (
                    <div className={styles.filterDropdown}>
                        <div className={styles.filterGroup}>
                            <label className={styles.filterLabel}>Category</label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className={styles.filterSelect}
                            >
                                <option value="">All Categories</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.filterGroup}>
                            <label className={styles.filterLabel}>Tags</label>
                            <select
                                value={selectedTag}
                                onChange={(e) => setSelectedTag(e.target.value)}
                                className={styles.filterSelect}
                            >
                                <option value="">All Tags</option>
                                {availableTags.map(tag => (
                                    <option key={tag} value={tag}>
                                        {tag}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.filterGroup}>
                            <label className={styles.filterCheckbox}>
                                <input
                                    type="checkbox"
                                    checked={isFeatured}
                                    onChange={(e) => setIsFeatured(e.target.checked)}
                                />
                                Featured Posts Only
                            </label>
                        </div>

                        <div className={styles.filterActions}>
                            <button className={styles.applyFilters} onClick={applyFilters}>
                                Apply Filters
                            </button>
                            <button className={styles.resetFilters} onClick={resetFilters}>
                                Reset
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Results summary */}
            <div className={styles.resultsSummary}>
                {!loading && !error && (
                    <>
                        <span>Showing {posts.length} of {totalPosts} posts</span>
                        {(selectedCategory || selectedTag || searchTerm || isFeatured) && (
                            <button className={styles.clearFiltersButton} onClick={resetFilters}>
                                Clear Filters
                            </button>
                        )}
                    </>
                )}
            </div>
            {/* Error state */}
            {error && (
                <DataMessage
                    type="error"
                    title="Failed to load posts"
                    message={error}
                    action={
                        <button className={styles.retryButton} onClick={handleRetry}>
                            <IoIosRefresh /> Retry
                        </button>
                    }
                />
            )}            {/* Posts grid/list */}
            <div className={viewMode === 'grid' ? styles.postsGrid : styles.postsList}>
                {loading || isSearching ? (
                    <LoadingSpinner size="large" color="var(--colorStyling)" />
                ) : (
                    renderPosts()
                )}
            </div>

            {/* Pagination */}
            {!loading && !error && totalPages > 1 && renderPagination()}
        </div>
    );
};

export default PostsPage;