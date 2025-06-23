const { invalidateCache } = require('../middleware/cache');

// Cache invalidation middleware for post operations
const invalidatePostCache = (req, res, next) => {
    // Store original methods
    const originalJson = res.json;
    const originalSend = res.send;

    // Override response methods to invalidate cache on successful operations
    const invalidateOnSuccess = function (data) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            invalidateCache.posts();
            console.log('Cache invalidated after post operation');
        }
        return originalJson.call(this, data);
    };

    const invalidateOnSuccessSend = function (data) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            invalidateCache.posts();
            console.log('Cache invalidated after post operation');
        }
        return originalSend.call(this, data);
    };

    res.json = invalidateOnSuccess;
    res.send = invalidateOnSuccessSend;

    next();
};

module.exports = { invalidatePostCache };
