const { Sequelize } = require('sequelize');
const pg = require('pg');
const { config, validateConfig } = require('./config');

// Validate configuration before proceeding
validateConfig();

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
        await client.connect();


        // Check if our database exists
        const checkResult = await client.query(`
            SELECT 1 FROM pg_database WHERE datname = $1
        `, [config.database.database]);

        if (checkResult.rowCount === 0) {

            // Create the database
            await client.query(`CREATE DATABASE "${config.database.database}"`);

        } else {

        }
    } catch (error) {
        console.error('Error creating database:', error);
        throw error; // Re-throw to handle it in the calling function
    } finally {
        await client.end();
    }
}

// Call the function to create the database
createDatabaseIfNotExists().catch(err => {
    console.error('Failed to setup database:', err);
    process.exit(1);
});

// Then create the Sequelize connection
const sequelize = new Sequelize(
    config.database.database,
    config.database.user,
    config.database.password,
    {
        host: config.database.host,
        port: config.database.port,
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: config.database.ssl
        }
    }
);;

module.exports = sequelize;
