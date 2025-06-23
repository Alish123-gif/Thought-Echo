const Post = require('../models/Post');
const User = require('../models/User');
const Category = require('../models/Category');
const { Op } = require('sequelize');

// Consolidated endpoint for home page data
exports.getHomePageData = async (req, res) => {
    try {
        const { featuredLimit = 5, recentLimit = 6, menuLimit = 5 } = req.query;

        // Use Promise.all to fetch all data in parallel
        const [featuredPosts, recentPosts, menuPosts, categories] = await Promise.all([
            // Featured posts
            Post.findAll({
                where: {
                    isFeatured: true,
                    isPublished: true
                },
                include: [
                    {
                        model: User,
                        as: 'author',
                        attributes: ['id', 'name', 'email']
                    },
                    {
                        model: Category,
                        as: 'category',
                        attributes: ['id', 'name', 'slug', 'color']
                    }
                ],
                limit: parseInt(featuredLimit),
                order: [['createdAt', 'DESC']],
                attributes: { exclude: ['content'] } // Exclude heavy content field for performance
            }),

            // Recent posts with pagination info
            Post.findAndCountAll({
                where: {
                    isPublished: true
                },
                include: [
                    {
                        model: User,
                        as: 'author',
                        attributes: ['id', 'name', 'email']
                    },
                    {
                        model: Category,
                        as: 'category',
                        attributes: ['id', 'name', 'slug', 'color']
                    }
                ],
                limit: parseInt(recentLimit),
                offset: 0,
                order: [['createdAt', 'DESC']],
                attributes: { exclude: ['content'] } // Exclude heavy content field for performance
            }),

            // Menu posts (for sidebar)
            Post.findAll({
                where: {
                    isPublished: true
                },
                include: [
                    {
                        model: User,
                        as: 'author',
                        attributes: ['id', 'name', 'email']
                    },
                    {
                        model: Category,
                        as: 'category',
                        attributes: ['id', 'name', 'slug', 'color']
                    }
                ],
                limit: parseInt(menuLimit),
                order: [['createdAt', 'DESC']],
                attributes: ['id', 'title', 'slug', 'imageUrl', 'createdAt', 'categoryId', 'authorId']
            }),

            // Categories for menu
            Category.findAll({
                attributes: ['id', 'name', 'slug', 'color'],
                order: [['name', 'ASC']]
            })
        ]);

        // Calculate pagination info for recent posts
        const totalRecentPosts = recentPosts.count;
        const totalPages = Math.ceil(totalRecentPosts / parseInt(recentLimit));
        featured: featuredPosts.map(post => post.get({ plain: true })),
            recent: {
            posts: recentPosts.rows.map(post => post.get({ plain: true })),
                pagination: {
                totalPosts: totalRecentPosts,
                    totalPages,
                    currentPage: 1,
                        limit: parseInt(recentLimit)
            }
        },
        menu: {
            posts: menuPosts.map(post => post.get({ plain: true })),
                categories: categories.map(category => category.get({ plain: true }))
        },
        _metadata: {
            cached: false,
                timestamp: new Date().toISOString(),
                    loadTime: Date.now() - req.startTime
        }
    };

    // Set cache headers for better performance
    res.set({
        'Cache-Control': 'public, max-age=300, s-maxage=600', // 5 min browser, 10 min CDN
        'ETag': `"home-${Date.now()}"`,
        'Last-Modified': new Date().toUTCString()
    });

    res.status(200).json(response);
} catch (error) {
    console.error('Error fetching home page data:', error);
    res.status(500).json({
        message: 'Error fetching home page data',
        error: error.message,
        _metadata: {
            loadTime: Date.now() - req.startTime
        }
    });
}
};

// Enhanced featured posts endpoint with caching
exports.getFeaturedPostsOptimized = async (req, res) => {
    try {
        const { limit = 5 } = req.query;

        const posts = await Post.findAll({
            where: {
                isFeatured: true,
                isPublished: true
            },
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'slug', 'color']
                }
            ],
            limit: parseInt(limit),
            order: [['createdAt', 'DESC']],
            attributes: { exclude: ['content'] } // Exclude heavy content for performance
        });
        // Set cache headers
        res.set({
            'Cache-Control': 'public, max-age=300, s-maxage=600',
            'ETag': `"featured-${Date.now()}"`,
        });

        // Convert Sequelize instances to plain objects
        const plainPosts = posts.map(post => post.get({ plain: true }));
        res.status(200).json(plainPosts);
    } catch (error) {
        console.error('Error fetching featured posts:', error);
        res.status(500).json({ message: 'Error fetching featured posts', error: error.message });
    }
};

// Enhanced get all posts with optimized queries
exports.getAllPostsOptimized = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, tag, featured, author, published } = req.query;
        const offset = (page - 1) * limit;

        // Build where clause for filtering
        const where = {};
        if (category) where.categoryId = category;
        if (featured) where.isFeatured = featured === 'true';
        if (published !== undefined) where.isPublished = published === 'true';

        // Filter by tags (if provided)
        if (tag) {
            where.tags = { [Op.contains]: [tag] };
        }

        // Build include array
        const include = [
            {
                model: User,
                as: 'author',
                attributes: ['id', 'name', 'email']
            },
            {
                model: Category,
                as: 'category',
                attributes: ['id', 'name', 'slug', 'color']
            }
        ];

        // Filter by author if provided
        if (author) {
            include[0].where = { id: author };
        }

        const { count, rows: posts } = await Post.findAndCountAll({
            where,
            include,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']],
            attributes: { exclude: ['content'] } // Exclude heavy content for list views
        });
        // Set cache headers
        res.set({
            'Cache-Control': 'public, max-age=180, s-maxage=300', // 3 min browser, 5 min CDN
        });

        // Convert Sequelize instances to plain objects
        const plainPosts = posts.map(post => post.get({ plain: true }));

        res.status(200).json({
            totalPosts: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            posts: plainPosts
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Error fetching posts', error: error.message });
    }
};
