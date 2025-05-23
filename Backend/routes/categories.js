const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { upload, handleMulterError } = require('../middleware/upload');

// Public routes
router.get('/categories', categoryController.getAllCategories);
router.get('/categories/:id', categoryController.getCategoryById);

// Protected routes (admin only)
router.post('/categories', isAuthenticated, isAdmin, upload.single('image'), handleMulterError, categoryController.createCategory);
router.put('/categories/:id', isAuthenticated, isAdmin, upload.single('image'), handleMulterError, categoryController.updateCategory);
router.delete('/categories/:id', isAuthenticated, isAdmin, categoryController.deleteCategory);

// Image upload endpoint
router.post('/categories/:id/upload-image', isAuthenticated, isAdmin, upload.single('image'), handleMulterError, categoryController.uploadCategoryImage);

module.exports = router;
