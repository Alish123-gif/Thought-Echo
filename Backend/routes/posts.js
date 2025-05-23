const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const upload = require('../middleware/upload');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', postController.getAllPosts);
router.get('/featured', postController.getFeaturedPosts);
router.get('/category/:category', postController.getPostsByCategory);
router.get('/:slug', postController.getPostBySlug);
router.get('/id/:id', postController.getPostById);

// Protected routes
router.post('/', isAuthenticated, upload.single('image'), postController.createPost);
router.put('/:id', isAuthenticated, upload.single('image'), postController.updatePost);
router.delete('/:id', isAuthenticated, postController.deletePost);
router.get('/user/posts', isAuthenticated, postController.getUserPosts);

module.exports = router;
