const express = require('express');
const router = express.Router();
const {
    trackPageView,
    getViewerCount,
    getAnalytics,
    getPageViewsByDateRange,
    getRealTimeAnalytics,
    getSessionStats,
    batchAnalytics
} = require('../controllers/analyticsController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Public routes
router.post('/pageview', trackPageView);
router.post('/batch', batchAnalytics); // New batch endpoint
router.get('/viewers', getViewerCount);

// Admin only routes
router.get('/', authenticateToken, isAdmin, getAnalytics);
router.get('/pageviews', authenticateToken, isAdmin, getPageViewsByDateRange);
router.get('/realtime', authenticateToken, isAdmin, getRealTimeAnalytics);
router.get('/sessions', authenticateToken, isAdmin, getSessionStats);

module.exports = router;
