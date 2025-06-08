const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Analytics = sequelize.define('Analytics', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    page: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '/',
        validate: {
            len: [1, 500] // Limit page URL length
        }
    },
    userAgent: {
        type: DataTypes.STRING(500), // Limit user agent length
        allowNull: true
    },
    referrer: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: [0, 255] // Limit referrer length
        }
    },
    sessionId: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: [0, 100] // Limit session ID length
        }
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'analytics',
    timestamps: true, indexes: [
        {
            fields: ['page']
        },
        {
            fields: ['timestamp']
        },
        {
            fields: ['sessionId']
        },
        {
            fields: ['page', 'timestamp'] // Composite index for better query performance
        },
        {
            fields: ['page', 'sessionId', 'timestamp'] // Optimized for duplicate detection
        }
    ]
});

module.exports = Analytics;
