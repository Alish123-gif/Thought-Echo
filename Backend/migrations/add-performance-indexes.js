const { QueryInterface, Sequelize } = require('sequelize');

module.exports = {
    up: async (queryInterface) => {
        // Add indexes for Post table performance optimization
        await Promise.all([
            // Index for published posts (most common query)
            queryInterface.addIndex('Posts', ['isPublished'], {
                name: 'idx_posts_published'
            }),

            // Index for featured posts
            queryInterface.addIndex('Posts', ['isFeatured'], {
                name: 'idx_posts_featured'
            }),

            // Composite index for published + featured (home page query)
            queryInterface.addIndex('Posts', ['isPublished', 'isFeatured'], {
                name: 'idx_posts_published_featured'
            }),

            // Index for category filtering
            queryInterface.addIndex('Posts', ['categoryId'], {
                name: 'idx_posts_category'
            }),

            // Index for created date ordering
            queryInterface.addIndex('Posts', ['createdAt'], {
                name: 'idx_posts_created'
            }),

            // Composite index for published posts ordered by date (most common)
            queryInterface.addIndex('Posts', ['isPublished', 'createdAt'], {
                name: 'idx_posts_published_created'
            }),

            // Index for author filtering
            queryInterface.addIndex('Posts', ['authorId'], {
                name: 'idx_posts_author'
            }),

            // Index for slug lookups (unique constraint already exists but explicit index)
            queryInterface.addIndex('Posts', ['slug'], {
                name: 'idx_posts_slug'
            }),

            // Analytics table indexes
            queryInterface.addIndex('Analytics', ['page'], {
                name: 'idx_analytics_page'
            }),

            queryInterface.addIndex('Analytics', ['createdAt'], {
                name: 'idx_analytics_created'
            }),

            queryInterface.addIndex('Analytics', ['sessionId'], {
                name: 'idx_analytics_session'
            }),

            // Categories table index
            queryInterface.addIndex('Categories', ['slug'], {
                name: 'idx_categories_slug'
            })
        ]);
    },

    down: async (queryInterface) => {
        // Remove all indexes
        await Promise.all([
            queryInterface.removeIndex('Posts', 'idx_posts_published'),
            queryInterface.removeIndex('Posts', 'idx_posts_featured'),
            queryInterface.removeIndex('Posts', 'idx_posts_published_featured'),
            queryInterface.removeIndex('Posts', 'idx_posts_category'),
            queryInterface.removeIndex('Posts', 'idx_posts_created'),
            queryInterface.removeIndex('Posts', 'idx_posts_published_created'),
            queryInterface.removeIndex('Posts', 'idx_posts_author'),
            queryInterface.removeIndex('Posts', 'idx_posts_slug'),
            queryInterface.removeIndex('Analytics', 'idx_analytics_page'),
            queryInterface.removeIndex('Analytics', 'idx_analytics_created'),
            queryInterface.removeIndex('Analytics', 'idx_analytics_session'),
            queryInterface.removeIndex('Categories', 'idx_categories_slug')
        ]);
    }
};
