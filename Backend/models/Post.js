const { DataTypes } = require('sequelize');
const path = require('path');
const sequelize = require(path.join(__dirname, '..', 'config', 'database'));
const User = require('./User');

const Post = sequelize.define('Post', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tags: {
        type: DataTypes.JSONB, // Store tags as JSON array
        defaultValue: []
    },
    isFeatured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isPublished: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    readingTime: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});

// Define relationship with User model (Post belongs to User)
Post.belongsTo(User, {
    foreignKey: 'authorId',
    as: 'author'
});

module.exports = Post;
