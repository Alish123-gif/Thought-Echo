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
        defaultValue: '/'
    },
    userAgent: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    referrer: {
        type: DataTypes.STRING,
        allowNull: true
    },
    ipAddress: {
        type: DataTypes.STRING,
        allowNull: true
    },
    sessionId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'analytics',
    timestamps: true,
    indexes: [
        {
            fields: ['page']
        },
        {
            fields: ['timestamp']
        },
        {
            fields: ['sessionId']
        }
    ]
});

module.exports = Analytics;
