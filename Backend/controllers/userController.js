const path = require('path');
const User = require(path.join(__dirname, '..', 'models', 'User'));
const jwt = require('jsonwebtoken');
const ImageKit = require(path.join(__dirname, '..', 'config', 'imagekit'));
const { config } = require('../config/config');
require('dotenv').config();

exports.updateUserAvatar = async (req, res) => {
    try {
        console.log('Received request to update user avatar');
        console.log('File:', req.file);
        console.log('User:', req.user?.id);

        if (!req.file) {
            return res.status(400).json({ message: 'No avatar file provided' });
        }

        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // Upload the image to ImageKit
        const uploadResponse = await ImageKit.upload({
            file: req.file.buffer.toString('base64'),
            fileName: `avatar_${req.user.id}${path.extname(req.file.originalname)}`,
            folder: '/avatars'
        });
        // Update the user's avatar URL in the database
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.image = uploadResponse.url;
        await user.save(); res.json({
            message: 'Avatar updated successfully',
            avatarUrl: uploadResponse.url,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
                isAdmin: user.isAdmin
            }
        });
    } catch (error) {
        console.error('Something went wrong while updating user avatar:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}