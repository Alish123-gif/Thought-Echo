const { Sequelize } = require('sequelize');
const pg = require('pg');

// Create the database if it doesn't exist
async function createDatabaseIfNotExists() {
    const client = new pg.Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: 'postgres' // Connect to default postgres database first
    });

    try {
        await client.connect();
        // Check if our database exists
        const checkResult = await client.query(`
            SELECT 1 FROM pg_database WHERE datname = '${process.env.DB_NAME}'
        `);

        if (checkResult.rowCount === 0) {
            console.log(`Database ${process.env.DB_NAME} does not exist, creating it now...`);
            // Create the database
            await client.query(`CREATE DATABASE "${process.env.DB_NAME}"`);
            console.log(`Database ${process.env.DB_NAME} created successfully`);
        } else {
            console.log(`Database ${process.env.DB_NAME} already exists`);
        }
    } catch (error) {
        console.error('Error creating database:', error);
    } finally {
        await client.end();
    }
}

// Call the function to create the database
createDatabaseIfNotExists();

// Then create the Sequelize connection
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false,
    }
);

module.exports = sequelize;
