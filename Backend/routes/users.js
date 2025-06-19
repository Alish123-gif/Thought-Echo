var path = require('path');
var express = require('express');
var router = express.Router();
const userController = require(path.join(__dirname, '..', 'controllers', 'userController'));
const { upload, handleMulterError } = require(path.join(__dirname, '..', 'middleware', 'upload'));
const { isAuthenticated } = require(path.join(__dirname, '..', 'middleware', 'auth'));

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.status(404).json({ message: 'Not implemented' });
});

router.put('/update-avatar', isAuthenticated, upload.single('avatar'), handleMulterError, userController.updateUserAvatar);

module.exports = router;
