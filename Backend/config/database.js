const { Sequelize } = require('sequelize');
const pg = require('pg');
const { config, isNeonDatabase, getDatabaseConnectionInfo } = require('./config');

// Create the database if it doesn't exist
async function createDatabaseIfNotExists() {
    const client = new pg.Client({
        host: config.database.host,
        port: config.database.port,
        user: config.database.user,
        password: config.database.password,
        database: 'postgres', // Connect to default postgres database first
        ssl: config.database.ssl
    });

    try {
        console.log('Attempting to connect to PostgreSQL server...');
        await client.connect();
        console.log('Connected to PostgreSQL server successfully');

        // Check if our database exists
        const checkResult = await client.query(`
            SELECT 1 FROM pg_database WHERE datname = $1
        `, [config.database.database]);

        if (checkResult.rowCount === 0) {
            // Create the database
            await client.query(`CREATE DATABASE "${process.env.DB_NAME}"`);

        } else {
            console.log(`Database ${process.env.DB_NAME} already exists`);
        }
    } catch (error) {
        console.error('Error creating database:', error);
        console.error('This might be because:');
        console.error('1. PostgreSQL is not running on your local machine');
        console.error('2. Database credentials are incorrect');
        console.error('3. You are trying to connect to an external database');
        throw error;
    } finally {
        await client.end();
    }
}

// Handle database setup with better error handling
async function setupDatabase() {
    try {
        await createDatabaseIfNotExists();
    } catch (err) {
        console.error('Failed to setup database:', err);

        // Don't exit if we're using an external database - let Sequelize handle the connection
        if (process.env.DB_HOST === 'localhost' || process.env.DB_HOST === '127.0.0.1') {
            console.error('Please ensure PostgreSQL is running and accessible');
            process.exit(1);
        } else {
            console.log('Continuing with external database connection...');
        }
    }
}

// Call the setup function
setupDatabase();

// Then create the Sequelize connection
const sequelize = new Sequelize(
    config.database.database,
    config.database.user,
    config.database.password,
    {
        host: config.database.host,
        port: config.database.port,
        dialect: 'postgres',
        dialectOptions: {
            ssl: config.database.ssl
        },
        logging: config.server?.nodeEnv === 'development' ? console.log : false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);;

module.exports = sequelize;
