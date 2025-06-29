/**
 * Centralized Configuration Module
 * 
 * This module serves as the single source of truth for all application configuration.
 * It consolidates environment variables and provides validation and helper functions.
 * 
 * Usage Examples:
 * 
 * // Import the full config object
 * const { config } = require('./config/config');
 * console.log(config.database.host);
 * 
 * // Import specific config sections
 * const { getDatabaseConfig, getAuthConfig } = require('./config/config');
 * const dbConfig = getDatabaseConfig();
 * const authConfig = getAuthConfig();
 * 
 * // Validate configuration (automatically done in dependent modules)
 * const { validateConfig } = require('./config/config');
 * validateConfig();
 * 
 * Features:
 * - Supports both legacy environment variables (DB_HOST, etc.) and Neon format (PGHOST, etc.)
 * - Automatic validation of required environment variables
 * - Helper functions for easy access to configuration sections
 * - SSL configuration for database connections
 * - Environment-specific settings (development/production)
 */

// Centralized configuration for all environment variables
require('dotenv').config();

const config = {
    // Database Configuration - Prioritize Neon format
    database: {
        host: process.env.PGHOST || process.env.DB_HOST,
        port: parseInt(process.env.PGPORT || process.env.DB_PORT || '5432', 10),
        database: process.env.PGDATABASE || process.env.DB_NAME,
        user: process.env.PGUSER || process.env.DB_USER,
        password: process.env.PGPASSWORD || process.env.DB_PASS,
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },

    // Server Configuration
    server: {
        port: parseInt(process.env.PORT || '5000', 10),
        nodeEnv: process.env.NODE_ENV || 'development'
    },

    // Authentication
    auth: {
        jwtSecret: process.env.JWT_SECRET
    },

    // ImageKit Configuration
    imagekit: {
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
    }
};

// Validation function
const validateConfig = () => {
    const errors = [];

    // Check database configuration
    if (!config.database.host) {
        errors.push('Missing database host (PGHOST or DB_HOST)');
    }
    if (!config.database.database) {
        errors.push('Missing database name (PGDATABASE or DB_NAME)');
    }
    if (!config.database.user) {
        errors.push('Missing database user (PGUSER or DB_USER)');
    }
    if (!config.database.password) {
        errors.push('Missing database password (PGPASSWORD or DB_PASS)');
    }

    // Check required auth configuration
    if (!config.auth.jwtSecret) {
        errors.push('Missing JWT_SECRET');
    }

    // Check ImageKit configuration
    if (!config.imagekit.publicKey) {
        errors.push('Missing IMAGEKIT_PUBLIC_KEY');
    }
    if (!config.imagekit.privateKey) {
        errors.push('Missing IMAGEKIT_PRIVATE_KEY');
    }
    if (!config.imagekit.urlEndpoint) {
        errors.push('Missing IMAGEKIT_URL_ENDPOINT');
    }

    if (errors.length > 0) {
        console.error('❌ Configuration Errors:');
        errors.forEach(error => console.error(`  - ${error}`));
        throw new Error('Invalid configuration');
    }

    console.log('✅ Configuration validated successfully');
    return true;
};

// Helper to check if using Neon database
const isNeonDatabase = () => {
    return config.database.host && config.database.host.includes('neon.tech');
};

// Helper to get database connection parameters for logging (without password)
const getDatabaseConnectionInfo = () => ({
    host: config.database.host,
    port: config.database.port,
    database: config.database.database,
    user: config.database.user,
    isNeon: isNeonDatabase()
});

// Helper functions for easy access to specific configurations
const getServerConfig = () => config.server;
const getDatabaseConfig = () => config.database;
const getAuthConfig = () => config.auth;
const getImageKitConfig = () => config.imagekit;

module.exports = {
    config,
    validateConfig,
    isNeonDatabase,
    getDatabaseConnectionInfo,
    getServerConfig,
    getDatabaseConfig,
    getAuthConfig,
    getImageKitConfig
};
