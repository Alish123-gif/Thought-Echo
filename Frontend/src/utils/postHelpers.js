import { getCategoryById } from './categoryService';

/**
 * Enriches posts with category data by fetching category names for posts that have categoryId
 * @param {Array} posts - Array of post objects
 * @returns {Promise<Array>} - Array of posts with enriched category data
 */
export const enrichPostsWithCategories = async (posts) => {
    if (!posts || !Array.isArray(posts)) {
        return [];
    }

    return await Promise.all(posts.map(async (post) => {
        if (post.categoryId) {
            try {
                const category = await getCategoryById(post.categoryId);
                return {
                    ...post,
                    category: category?.name || 'Unknown',
                    // Fix image field name inconsistency
                    image: post.imageUrl || post.image
                };
            } catch (err) {
                console.error(`Error fetching category for post ${post.id}:`, err);
                return {
                    ...post,
                    category: 'Unknown',
                    image: post.imageUrl || post.image
                };
            }
        }
        return {
            ...post,
            category: 'Uncategorized',
            image: post.imageUrl || post.image
        };
    }));
};

/**
 * Enriches a single post with category data
 * @param {Object} post - Post object
 * @returns {Promise<Object>} - Post with enriched category data
 */
export const enrichPostWithCategory = async (post) => {
    if (!post) {
        return null;
    }

    if (post.categoryId) {
        try {
            const category = await getCategoryById(post.categoryId);
            return {
                ...post,
                category: category?.name || 'Unknown',
                image: post.imageUrl || post.image
            };
        } catch (err) {
            console.error(`Error fetching category for post ${post.id}:`, err);
            return {
                ...post,
                category: 'Unknown',
                image: post.imageUrl || post.image
            };
        }
    }

    return {
        ...post,
        category: 'Uncategorized',
        image: post.imageUrl || post.image
    };
};

/**
 * Creates a batch fetcher for categories to reduce API calls
 */
class CategoryCache {
    constructor() {
        this.cache = new Map();
        this.pending = new Map();
    }

    async getCategory(categoryId) {
        if (this.cache.has(categoryId)) {
            return this.cache.get(categoryId);
        }

        if (this.pending.has(categoryId)) {
            return this.pending.get(categoryId);
        }

        const promise = getCategoryById(categoryId)
            .then(category => {
                this.cache.set(categoryId, category);
                this.pending.delete(categoryId);
                return category;
            })
            .catch(err => {
                console.error(`Error fetching category ${categoryId}:`, err);
                this.pending.delete(categoryId);
                return null;
            });

        this.pending.set(categoryId, promise);
        return promise;
    }
}

// Global category cache instance
const categoryCache = new CategoryCache();

/**
 * Enriches posts with category data using a cache to reduce duplicate API calls
 * @param {Array} posts - Array of post objects
 * @returns {Promise<Array>} - Array of posts with enriched category data
 */
export const enrichPostsWithCategoriesOptimized = async (posts) => {
    if (!posts || !Array.isArray(posts)) {
        return [];
    }

    return await Promise.all(posts.map(async (post) => {
        if (post.categoryId) {
            try {
                const category = await categoryCache.getCategory(post.categoryId);
                return {
                    ...post,
                    category: category?.name || 'Unknown',
                    image: post.imageUrl || post.image
                };
            } catch (err) {
                console.error(`Error fetching category for post ${post.id}:`, err);
                return {
                    ...post,
                    category: 'Unknown',
                    image: post.imageUrl || post.image
                };
            }
        }
        return {
            ...post,
            category: 'Uncategorized',
            image: post.imageUrl || post.image
        };
    }));
};
