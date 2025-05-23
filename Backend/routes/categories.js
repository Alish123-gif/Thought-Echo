const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/categories', categoryController.getAllCategories);
router.get('/categories/:id', categoryController.getCategoryById);

// Protected routes (admin only)
router.post('/categories', isAuthenticated, isAdmin, categoryController.createCategory);
router.put('/categories/:id', isAuthenticated, isAdmin, categoryController.updateCategory);
router.delete('/categories/:id', isAuthenticated, isAdmin, categoryController.deleteCategory);

module.exports = router;
