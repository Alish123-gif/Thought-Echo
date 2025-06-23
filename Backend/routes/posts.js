const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const homeController = require('../controllers/homeController');
const { upload, handleMulterError } = require('../middleware/upload');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const {
    cacheHomePage,
    cachePosts,
    cacheFeatured,
    requestTimer
} = require('../middleware/cache');
const { invalidatePostCache } = require('../middleware/cacheInvalidation');

// Add request timing to all routes
router.use(requestTimer);

// Public routes with caching
router.get('/', cachePosts, postController.getAllPosts);
router.get('/home-data', cacheHomePage, homeController.getHomePageData); // New consolidated endpoint
router.get('/featured', cacheFeatured, homeController.getFeaturedPostsOptimized); // Use optimized version
router.get('/featured-optimized', cacheFeatured, homeController.getFeaturedPostsOptimized); // Optimized version
router.get('/category/:category', postController.getPostsByCategory);
router.get('/:slug', postController.getPostBySlug);
router.get('/id/:id', postController.getPostById);

// Protected routes with cache invalidation
router.post('/', isAuthenticated, invalidatePostCache, upload.single('image'), handleMulterError, postController.createPost);
router.put('/:id', isAuthenticated, invalidatePostCache, upload.single('image'), handleMulterError, postController.updatePost);
router.delete('/:id', isAuthenticated, invalidatePostCache, postController.deletePost);
router.get('/user/posts', isAuthenticated, postController.getUserPosts);

module.exports = router;
