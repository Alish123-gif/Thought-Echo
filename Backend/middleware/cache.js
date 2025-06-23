const NodeCache = require('node-cache');

// Create cache instances with different TTL for different data types
const homePageCache = new NodeCache({
    stdTTL: 300, // 5 minutes
    checkperiod: 60 // Check for expired keys every 60 seconds
});

const postsCache = new NodeCache({
    stdTTL: 180, // 3 minutes for posts
    checkperiod: 60
});

const categoriesCache = new NodeCache({
    stdTTL: 600, // 10 minutes for categories (they change less frequently)
    checkperiod: 120
});

// Cache middleware factory
const createCacheMiddleware = (cache, keyGenerator, ttl) => {
    return (req, res, next) => {
        // Skip caching for admin users or if explicitly disabled
        if (req.headers['cache-control'] === 'no-cache' || req.query.nocache === 'true') {
            return next();
        }

        const cacheKey = keyGenerator(req);
        const cachedData = cache.get(cacheKey);

        if (cachedData) {
            // Add cache headers
            res.set({
                'X-Cache': 'HIT',
                'X-Cache-Key': cacheKey,
                'Cache-Control': `public, max-age=${ttl}`,
            });
            return res.json(cachedData);
        }

        // Store original json method
        const originalJson = res.json;
        // Override json method to cache the response
        res.json = function (data) {
            // Only cache successful responses
            if (res.statusCode === 200 && data && !data.error) {
                // Convert Sequelize instances to plain objects to avoid cloning issues
                const cacheableData = JSON.parse(JSON.stringify(data));
                cache.set(cacheKey, cacheableData, ttl);
            }

            // Add cache headers
            res.set({
                'X-Cache': 'MISS',
                'X-Cache-Key': cacheKey,
                'Cache-Control': `public, max-age=${ttl}`,
            });

            // Call original json method
            return originalJson.call(this, data);
        };

        next();
    };
};

// Cache key generators
const homePageKeyGenerator = (req) => {
    const { featuredLimit = 5, recentLimit = 6, menuLimit = 5 } = req.query;
    return `homepage:${featuredLimit}:${recentLimit}:${menuLimit}`;
};

const postsKeyGenerator = (req) => {
    const { page = 1, limit = 10, category, tag, featured, author, published } = req.query;
    return `posts:${page}:${limit}:${category || 'all'}:${tag || 'none'}:${featured || 'any'}:${author || 'any'}:${published || 'any'}`;
};

const featuredKeyGenerator = (req) => {
    const { limit = 5 } = req.query;
    return `featured:${limit}`;
};

const categoriesKeyGenerator = () => {
    return 'categories:all';
};

// Middleware instances
const cacheHomePage = createCacheMiddleware(homePageCache, homePageKeyGenerator, 300);
const cachePosts = createCacheMiddleware(postsCache, postsKeyGenerator, 180);
const cacheFeatured = createCacheMiddleware(postsCache, featuredKeyGenerator, 300);
const cacheCategories = createCacheMiddleware(categoriesCache, categoriesKeyGenerator, 600);

// Cache invalidation helpers
const invalidateCache = {
    posts: () => {
        postsCache.flushAll();
        homePageCache.flushAll(); // Home page includes posts data
    },
    categories: () => {
        categoriesCache.flushAll();
        homePageCache.flushAll(); // Home page includes categories data
    },
    all: () => {
        postsCache.flushAll();
        homePageCache.flushAll();
        categoriesCache.flushAll();
    }
};

// Request timing middleware
const requestTimer = (req, res, next) => {
    req.startTime = Date.now();
    next();
};

module.exports = {
    cacheHomePage,
    cachePosts,
    cacheFeatured,
    cacheCategories,
    invalidateCache,
    requestTimer
};
