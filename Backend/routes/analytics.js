const express = require('express');
const router = express.Router();
const {
    trackPageView,
    getViewerCount,
    getAnalytics,
    getPageViewsByDateRange,
    getRealTimeAnalytics
} = require('../controllers/analyticsController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Public routes
router.post('/pageview', trackPageView);
router.get('/viewers', getViewerCount);

// Admin only routes
router.get('/', authenticateToken, isAdmin, getAnalytics);
router.get('/pageviews', authenticateToken, isAdmin, getPageViewsByDateRange);
router.get('/realtime', authenticateToken, isAdmin, getRealTimeAnalytics);

module.exports = router;
