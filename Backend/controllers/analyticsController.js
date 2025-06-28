const Analytics = require('../models/Analytics');
const { Op } = require('sequelize');

// In-memory cache for user session tracking with size limits
const userSessions = new Map();
const recentViews = new Map();
const THROTTLE_DURATION = 30000; // 30 seconds
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes session timeout
const SAME_PAGE_COOLDOWN = 5 * 60 * 1000; // 5 minutes cooldown for same page
const MAX_SESSIONS = 1000; // Prevent memory overflow
const MAX_RECENT_VIEWS = 500; // Limit recent views cache

// Periodic cleanup of memory caches
const cleanupMemoryCaches = () => {
    const now = Date.now();
    const cutoff = now - SESSION_TIMEOUT;

    // Clean up old sessions
    let cleaned = 0;
    for (const [key, session] of userSessions.entries()) {
        if (session.lastActivity < cutoff) {
            userSessions.delete(key);
            cleaned++;
        }
    }

    // If still too many sessions, remove oldest
    if (userSessions.size > MAX_SESSIONS) {
        const sessions = Array.from(userSessions.entries())
            .sort((a, b) => a[1].lastActivity - b[1].lastActivity);
        const toRemove = sessions.slice(0, Math.floor(MAX_SESSIONS * 0.2));
        toRemove.forEach(([key]) => userSessions.delete(key));
    }

    // Clean up recent views
    for (const [key, timestamp] of recentViews.entries()) {
        if (now - timestamp > THROTTLE_DURATION) {
            recentViews.delete(key);
        }
    }

    // Limit recent views size
    if (recentViews.size > MAX_RECENT_VIEWS) {
        const views = Array.from(recentViews.entries())
            .sort((a, b) => a[1] - b[1]);
        const toRemove = views.slice(0, Math.floor(MAX_RECENT_VIEWS * 0.2));
        toRemove.forEach(([key]) => recentViews.delete(key));
    }

    if (cleaned > 0) {

    }
};

// Run cleanup every 10 minutes
setInterval(cleanupMemoryCaches, 10 * 60 * 1000);

// Enhanced user fingerprinting to detect same user
const createUserFingerprint = (userAgent, sessionId) => {
    if (!userAgent) return sessionId || 'anonymous';

    // Extract key browser characteristics
    const browserInfo = userAgent.match(/\((.*?)\)/);
    const browser = userAgent.match(/(Chrome|Firefox|Safari|Edge|Opera)\/[\d.]+/);

    const fingerprint = {
        os: browserInfo ? browserInfo[1].split(';')[0].trim() : '',
        browser: browser ? browser[0] : '',
        sessionId: sessionId || ''
    };

    return btoa(JSON.stringify(fingerprint)).substring(0, 20);
};

// Check if this is likely the same user
const isSameUser = (fingerprint, page) => {
    const now = Date.now();

    if (!userSessions.has(fingerprint)) {
        return false;
    }

    const userSession = userSessions.get(fingerprint);

    // Check if session has expired
    if (now - userSession.lastActivity > SESSION_TIMEOUT) {
        userSessions.delete(fingerprint);
        return false;
    }

    // Check if this is the same page within cooldown period
    if (userSession.lastPage === page && (now - userSession.lastPageTime < SAME_PAGE_COOLDOWN)) {
        return true;
    }

    return false;
};

// Update user session tracking with memory management
const updateUserSession = (fingerprint, page) => {
    const now = Date.now();

    userSessions.set(fingerprint, {
        lastActivity: now,
        lastPage: page,
        lastPageTime: now,
        visitCount: (userSessions.get(fingerprint)?.visitCount || 0) + 1
    });

    // Trigger cleanup if we exceed limits
    if (userSessions.size > MAX_SESSIONS) {
        cleanupMemoryCaches();
    }
};

// Rate limiting for analytics requests
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_MINUTE = 30; // Max 30 requests per minute per IP

const checkRateLimit = (req) => {
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW;

    if (!requestCounts.has(clientIP)) {
        requestCounts.set(clientIP, []);
    }

    const requests = requestCounts.get(clientIP);

    // Remove old requests outside the window
    while (requests.length > 0 && requests[0] < windowStart) {
        requests.shift();
    }

    // Check if rate limit exceeded
    if (requests.length >= MAX_REQUESTS_PER_MINUTE) {
        return false;
    }

    // Add current request
    requests.push(now);

    // Cleanup old IPs periodically
    if (requestCounts.size > 1000) {
        for (const [ip, times] of requestCounts.entries()) {
            if (times.length === 0 || times[times.length - 1] < windowStart) {
                requestCounts.delete(ip);
            }
        }
    }

    return true;
};

// Track a page view with enhanced duplicate detection and rate limiting
const trackPageView = async (req, res) => {
    try {
        // Check rate limit first
        if (!checkRateLimit(req)) {
            return res.status(429).json({
                success: false,
                message: 'Rate limit exceeded. Please try again later.',
                rateLimited: true
            });
        }

        const { page, userAgent, referrer, timestamp, sessionId } = req.body;
        const currentPage = page || '/';
        const now = Date.now();

        // Create user fingerprint for better duplicate detection
        const userFingerprint = createUserFingerprint(userAgent, sessionId);

        // Check if this is likely the same user viewing the same page recently
        if (isSameUser(userFingerprint, currentPage)) {

            return res.status(200).json({
                success: true,
                message: 'Page view already tracked for this user recently',
                duplicate: true,
                userFingerprint: userFingerprint.substring(0, 8) + '...' // Partial fingerprint for debugging
            });
        }        // Check database for recent entries from this session/user (optimized query)
        const recentEntry = await Analytics.findOne({
            attributes: ['id', 'timestamp'], // Only fetch needed columns
            where: {
                page: currentPage,
                sessionId: sessionId,
                timestamp: {
                    [Op.gte]: new Date(now - SAME_PAGE_COOLDOWN)
                }
            },
            order: [['timestamp', 'DESC']],
            limit: 1
        });

        if (recentEntry) {


            // Update user session but don't create new record
            updateUserSession(userFingerprint, currentPage);

            return res.status(200).json({
                success: true,
                message: 'Page view already exists in database recently',
                duplicate: true,
                lastTracked: recentEntry.timestamp
            });
        }        // This is a new/valid page view - create the record
        const pageView = await Analytics.create({
            page: currentPage,
            userAgent: userAgent ? userAgent.substring(0, 500) : null,
            referrer: referrer ? referrer.substring(0, 255) : null,
            sessionId: sessionId || null,
            timestamp: timestamp ? new Date(timestamp) : new Date()
        });

        // Update user session tracking
        updateUserSession(userFingerprint, currentPage);

        // Invalidate viewer count cache since we added a new view
        viewerCountCache = null;
        viewerCountCacheTime = null;



        res.status(201).json({
            success: true,
            message: 'Page view tracked successfully',
            data: {
                id: pageView.id,
                page: pageView.page,
                timestamp: pageView.timestamp,
                userFingerprint: userFingerprint.substring(0, 8) + '...'
            }
        });

    } catch (error) {
        console.error('Error tracking page view:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to track page view',
            error: error.message
        });
    }
};

// Cache for viewer count to reduce database hits
let viewerCountCache = null;
let viewerCountCacheTime = null;
const VIEWER_COUNT_CACHE_DURATION = 2 * 60 * 1000; // 2 minutes cache

// Get viewer count with caching
const getViewerCount = async (req, res) => {
    try {
        const now = Date.now();

        // Return cached value if still valid
        if (viewerCountCache !== null &&
            viewerCountCacheTime &&
            (now - viewerCountCacheTime) < VIEWER_COUNT_CACHE_DURATION) {
            return res.json({
                success: true,
                totalViews: viewerCountCache,
                message: 'Viewer count retrieved successfully (cached)',
                cached: true
            });
        }

        // Fetch from database
        const totalViews = await Analytics.count();

        // Update cache
        viewerCountCache = totalViews;
        viewerCountCacheTime = now;

        res.json({
            success: true,
            totalViews,
            message: 'Viewer count retrieved successfully',
            cached: false
        });
    } catch (error) {
        console.error('Error getting viewer count:', error);

        // Return cached value if available during error
        if (viewerCountCache !== null) {
            return res.json({
                success: true,
                totalViews: viewerCountCache,
                message: 'Viewer count retrieved from cache (database error)',
                cached: true,
                error: 'Database temporarily unavailable'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to get viewer count',
            error: error.message
        });
    }
};

// Get comprehensive analytics (admin only)
const getAnalytics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Build date filter
        let dateFilter = {};
        if (startDate || endDate) {
            dateFilter.timestamp = {};
            if (startDate) dateFilter.timestamp[Op.gte] = new Date(startDate);
            if (endDate) dateFilter.timestamp[Op.lte] = new Date(endDate);
        }

        // Get total views
        const totalViews = await Analytics.count({ where: dateFilter });

        // Get unique visitors (based on sessionId)
        const uniqueVisitors = await Analytics.count({
            where: dateFilter,
            distinct: true,
            col: 'sessionId'
        });

        // Get views by page
        const viewsByPage = await Analytics.findAll({
            where: dateFilter,
            attributes: [
                'page',
                [Analytics.sequelize.fn('COUNT', Analytics.sequelize.col('id')), 'views']
            ],
            group: ['page'],
            order: [[Analytics.sequelize.fn('COUNT', Analytics.sequelize.col('id')), 'DESC']],
            limit: 10
        });

        // Get daily views for the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const dailyViews = await Analytics.findAll({
            where: {
                timestamp: {
                    [Op.gte]: thirtyDaysAgo
                }
            },
            attributes: [
                [Analytics.sequelize.fn('DATE', Analytics.sequelize.col('timestamp')), 'date'],
                [Analytics.sequelize.fn('COUNT', Analytics.sequelize.col('id')), 'views']
            ],
            group: [Analytics.sequelize.fn('DATE', Analytics.sequelize.col('timestamp'))],
            order: [[Analytics.sequelize.fn('DATE', Analytics.sequelize.col('timestamp')), 'ASC']]
        });

        // Calculate average views per day
        const avgViewsPerDay = dailyViews.length > 0
            ? Math.round(dailyViews.reduce((sum, day) => sum + parseInt(day.dataValues.views), 0) / dailyViews.length)
            : 0;

        res.json({
            success: true,
            data: {
                totalViews,
                uniqueVisitors,
                avgViewsPerDay,
                viewsByPage: viewsByPage.map(item => ({
                    page: item.page,
                    views: parseInt(item.dataValues.views)
                })),
                dailyViews: dailyViews.map(item => ({
                    date: item.dataValues.date,
                    views: parseInt(item.dataValues.views)
                }))
            }
        });
    } catch (error) {
        console.error('Error getting analytics:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get analytics',
            error: error.message
        });
    }
};

// Get page views by date range
const getPageViewsByDateRange = async (req, res) => {
    try {
        const { startDate, endDate, page } = req.query;

        let whereClause = {};

        // Add date filter
        if (startDate || endDate) {
            whereClause.timestamp = {};
            if (startDate) whereClause.timestamp[Op.gte] = new Date(startDate);
            if (endDate) whereClause.timestamp[Op.lte] = new Date(endDate);
        }

        // Add page filter
        if (page) {
            whereClause.page = page;
        }

        const pageViews = await Analytics.findAll({
            where: whereClause,
            attributes: [
                [Analytics.sequelize.fn('DATE', Analytics.sequelize.col('timestamp')), 'date'],
                [Analytics.sequelize.fn('COUNT', Analytics.sequelize.col('id')), 'views']
            ],
            group: [Analytics.sequelize.fn('DATE', Analytics.sequelize.col('timestamp'))],
            order: [[Analytics.sequelize.fn('DATE', Analytics.sequelize.col('timestamp')), 'ASC']]
        });

        res.json({
            success: true,
            data: pageViews.map(item => ({
                date: item.dataValues.date,
                views: parseInt(item.dataValues.views)
            }))
        });
    } catch (error) {
        console.error('Error getting page views by date range:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get page views',
            error: error.message
        });
    }
};

// Get real-time analytics (last 24 hours)
const getRealTimeAnalytics = async (req, res) => {
    try {
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

        const recentViews = await Analytics.count({
            where: {
                timestamp: {
                    [Op.gte]: twentyFourHoursAgo
                }
            }
        });

        const recentUniqueVisitors = await Analytics.count({
            where: {
                timestamp: {
                    [Op.gte]: twentyFourHoursAgo
                }
            },
            distinct: true,
            col: 'sessionId'
        });

        // Get hourly breakdown for last 24 hours
        const hourlyViews = await Analytics.findAll({
            where: {
                timestamp: {
                    [Op.gte]: twentyFourHoursAgo
                }
            },
            attributes: [
                [Analytics.sequelize.fn('HOUR', Analytics.sequelize.col('timestamp')), 'hour'],
                [Analytics.sequelize.fn('COUNT', Analytics.sequelize.col('id')), 'views']
            ],
            group: [Analytics.sequelize.fn('HOUR', Analytics.sequelize.col('timestamp'))],
            order: [[Analytics.sequelize.fn('HOUR', Analytics.sequelize.col('timestamp')), 'ASC']]
        });

        res.json({
            success: true,
            data: {
                last24Hours: {
                    views: recentViews,
                    uniqueVisitors: recentUniqueVisitors
                },
                hourlyBreakdown: hourlyViews.map(item => ({
                    hour: item.dataValues.hour,
                    views: parseInt(item.dataValues.views)
                }))
            }
        });
    } catch (error) {
        console.error('Error getting real-time analytics:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get real-time analytics',
            error: error.message
        });
    }
};

// Cleanup old analytics data (to be called periodically)
const cleanupOldData = async () => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const deletedCount = await Analytics.destroy({
            where: {
                timestamp: {
                    [Op.lt]: thirtyDaysAgo
                }
            }
        });


        return deletedCount;
    } catch (error) {
        console.error('Error cleaning up old analytics data:', error);
        return 0;
    }
};

// Auto-cleanup on server start (run once per day)
const startAutoCleanup = () => {
    // Run cleanup immediately on start
    cleanupOldData();

    // Then run every 24 hours
    setInterval(cleanupOldData, 24 * 60 * 60 * 1000);
};

// Get session statistics (for debugging and monitoring)
const getSessionStats = async (req, res) => {
    try {
        const now = Date.now();
        const activeSessions = [];

        // Get active sessions from memory
        for (const [fingerprint, session] of userSessions.entries()) {
            if (now - session.lastActivity < SESSION_TIMEOUT) {
                activeSessions.push({
                    fingerprint: fingerprint.substring(0, 8) + '...',
                    lastActivity: new Date(session.lastActivity),
                    lastPage: session.lastPage,
                    visitCount: session.visitCount,
                    minutesAgo: Math.round((now - session.lastActivity) / (1000 * 60))
                });
            }
        }

        // Get database statistics
        const totalSessions = await Analytics.count({
            distinct: true,
            col: 'sessionId',
            where: {
                sessionId: {
                    [Op.not]: null
                }
            }
        });

        const todayViews = await Analytics.count({
            where: {
                timestamp: {
                    [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0))
                }
            }
        });

        res.json({
            success: true,
            data: {
                activeSessionsInMemory: activeSessions.length,
                activeSessions: activeSessions.slice(0, 10), // Show only first 10
                totalSessionsInDatabase: totalSessions,
                todayViews: todayViews,
                memoryUsage: {
                    userSessions: userSessions.size,
                    recentViews: recentViews.size
                }
            }
        });
    } catch (error) {
        console.error('Error getting session stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get session stats',
            error: error.message
        });
    }
};

// Batch analytics endpoint for better performance
const batchAnalytics = async (req, res) => {
    try {
        const { events } = req.body;

        if (!events || !Array.isArray(events)) {
            return res.status(400).json({ error: 'Invalid events data' });
        }

        // Process events in parallel but with limits
        const processed = [];
        const batchSize = 10;

        for (let i = 0; i < events.length; i += batchSize) {
            const batch = events.slice(i, i + batchSize);
            const batchPromises = batch.map(async (event) => {
                try {
                    if (event.type === 'pageview') {
                        // Create throttling key
                        const throttleKey = `${event.sessionId || 'anonymous'}_${event.page}`;
                        const now = Date.now();
                        const lastView = recentViews.get(throttleKey);

                        // Skip if same page viewed too recently
                        if (lastView && (now - lastView) < SAME_PAGE_COOLDOWN) {
                            return null;
                        }

                        // Update recent views
                        recentViews.set(throttleKey, now);

                        // Create analytics record
                        const analytics = await Analytics.create({
                            page: event.page,
                            userAgent: event.userAgent,
                            referrer: event.referrer,
                            sessionId: event.sessionId,
                            ipAddress: req.ip || req.connection.remoteAddress,
                            timestamp: new Date(event.timestamp)
                        });

                        return analytics.id;
                    }
                    return null;
                } catch (error) {
                    console.error('Error processing event:', error);
                    return null;
                }
            });

            const batchResults = await Promise.allSettled(batchPromises);
            processed.push(...batchResults
                .filter(result => result.status === 'fulfilled' && result.value)
                .map(result => result.value)
            );
        }

        res.status(200).json({
            message: 'Batch processed successfully',
            processed: processed.length,
            total: events.length
        });
    } catch (error) {
        console.error('Batch analytics error:', error);
        res.status(500).json({ error: 'Failed to process analytics batch' });
    }
};

module.exports = {
    trackPageView,
    getViewerCount,
    getAnalytics,
    getPageViewsByDateRange,
    getRealTimeAnalytics,
    cleanupOldData,
    startAutoCleanup,
    getSessionStats,
    batchAnalytics
};
