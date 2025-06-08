const Analytics = require('../models/Analytics');
const { Op } = require('sequelize');

// Track a page view
const trackPageView = async (req, res) => {
    try {
        const { page, userAgent, referrer, timestamp } = req.body;

        // Get IP address from request
        const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;

        // Create a simple session ID based on IP + User Agent (for basic uniqueness)
        const sessionId = require('crypto')
            .createHash('md5')
            .update(ipAddress + (userAgent || ''))
            .digest('hex');

        const pageView = await Analytics.create({
            page: page || '/',
            userAgent,
            referrer,
            ipAddress,
            sessionId,
            timestamp: timestamp ? new Date(timestamp) : new Date()
        });

        res.status(201).json({
            success: true,
            message: 'Page view tracked successfully',
            data: {
                id: pageView.id,
                page: pageView.page,
                timestamp: pageView.timestamp
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

// Get viewer count
const getViewerCount = async (req, res) => {
    try {
        const totalViews = await Analytics.count();

        res.json({
            success: true,
            totalViews,
            message: 'Viewer count retrieved successfully'
        });
    } catch (error) {
        console.error('Error getting viewer count:', error);
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

module.exports = {
    trackPageView,
    getViewerCount,
    getAnalytics,
    getPageViewsByDateRange,
    getRealTimeAnalytics
};
