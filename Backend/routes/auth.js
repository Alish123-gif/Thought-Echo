const express = require('express');
const path = require('path');
const router = express.Router();
const authController = require(path.join(__dirname, '..', 'controllers', 'authController'));
const { isAuthenticated } = require(path.join(__dirname, '..', 'middleware', 'auth'));

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/validate-token', isAuthenticated, authController.validateToken);

module.exports = router;
