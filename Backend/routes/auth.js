const express = require('express');
const path = require('path');
const router = express.Router();
const authController = require(path.join(__dirname, '..', 'controllers', 'authController'));

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
