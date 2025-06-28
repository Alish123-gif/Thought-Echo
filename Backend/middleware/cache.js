const NodeCache = require('node-cache');

// Centralized cache configuration
const CACHE_CONFIG = {
    // Homepage data - changes frequently due to analytics
    homepage: {
        ttl: 180, // 3 minutes
        checkPeriod: 60,
        httpCache: 180
    },
    // Posts data - moderate frequency
    posts: {
        ttl: 300, // 5 minutes  
        checkPeriod: 60,
        httpCache: 300
    },
    // Categories - changes rarely
    categories: {
        ttl: 600, // 10 minutes
        checkPeriod: 120,
        httpCache: 600
    },
    // Analytics - expensive queries, cache longer
    analytics: {
        ttl: 120, // 2 minutes (was too short before)
        checkPeriod: 60,
        httpCache: 120
    }
};

// Create cache instances with standardized configuration
const homePageCache = new NodeCache({
    stdTTL: CACHE_CONFIG.homepage.ttl,
    checkperiod: CACHE_CONFIG.homepage.checkPeriod
});

const postsCache = new NodeCache({
    stdTTL: CACHE_CONFIG.posts.ttl,
    checkperiod: CACHE_CONFIG.posts.checkPeriod
});

const categoriesCache = new NodeCache({
    stdTTL: CACHE_CONFIG.categories.ttl,
    checkperiod: CACHE_CONFIG.categories.checkPeriod
});

const analyticsCache = new NodeCache({
    stdTTL: CACHE_CONFIG.analytics.ttl,
    checkperiod: CACHE_CONFIG.analytics.checkPeriod
});

// Cache middleware factory with improved HTTP caching
const createCacheMiddleware = (cache, keyGenerator, cacheType) => {
    return (req, res, next) => {
        // Skip caching for admin users or if explicitly disabled
        if (req.headers['cache-control'] === 'no-cache' || req.query.nocache === 'true') {
            return next();
        }

        const cacheKey = keyGenerator(req);
        const cachedData = cache.get(cacheKey);
        const config = CACHE_CONFIG[cacheType];

        if (cachedData) {
            // Add consistent cache headers
            res.set({
                'X-Cache': 'HIT',
                'X-Cache-Key': cacheKey,
                'Cache-Control': `public, max-age=${config.httpCache}, s-maxage=${config.httpCache}`,
                'ETag': `"${cacheKey}-${Date.now()}"` // Better ETag generation
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
                cache.set(cacheKey, cacheableData);

                // Add cache miss headers
                res.set({
                    'X-Cache': 'MISS',
                    'X-Cache-Key': cacheKey,
                    'Cache-Control': `public, max-age=${config.httpCache}, s-maxage=${config.httpCache}`,
                    'ETag': `"${cacheKey}-${Date.now()}"`
                });
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

const analyticsKeyGenerator = (req) => {
    const { timeframe = 'week', postId, metric = 'views' } = req.query;
    return `analytics:${timeframe}:${postId || 'all'}:${metric}`;
};

// Middleware instances with proper cache type configuration
const cacheHomePage = createCacheMiddleware(homePageCache, homePageKeyGenerator, 'homepage');
const cachePosts = createCacheMiddleware(postsCache, postsKeyGenerator, 'posts');
const cacheFeatured = createCacheMiddleware(postsCache, featuredKeyGenerator, 'posts');
const cacheCategories = createCacheMiddleware(categoriesCache, categoriesKeyGenerator, 'categories');
const cacheAnalytics = createCacheMiddleware(analyticsCache, analyticsKeyGenerator, 'analytics');

// Cache invalidation helpers with analytics support
const invalidateCache = {
    posts: () => {
        postsCache.flushAll();
        homePageCache.flushAll(); // Home page includes posts data
        analyticsCache.flushAll(); // Analytics may be affected by post changes
    },
    categories: () => {
        categoriesCache.flushAll();
        homePageCache.flushAll(); // Home page includes categories data
    },
    analytics: () => {
        analyticsCache.flushAll();
    },
    all: () => {
        postsCache.flushAll();
        homePageCache.flushAll();
        categoriesCache.flushAll();
        analyticsCache.flushAll();
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
    cacheAnalytics,
    invalidateCache,
    requestTimer,
    CACHE_CONFIG // Export config for consistency checks
};
