const { Sequelize } = require('sequelize');
const pg = require('pg');

// Create the database if it doesn't exist
async function createDatabaseIfNotExists() {
    const client = new pg.Client({
        host: process.env.PGHOST || process.env.DB_HOST,
        port: process.env.PGPORT || process.env.DB_PORT || 5432,
        user: process.env.PGUSER || process.env.DB_USER,
        password: process.env.PGPASSWORD || process.env.DB_PASS,
        database: 'postgres', // Connect to default postgres database first
        ssl: {
            rejectUnauthorized: false // Neon requires SSL
        }
    });

    try {
        console.log('Attempting to connect to PostgreSQL server...');
        await client.connect();
        console.log('Connected to PostgreSQL server successfully');

        // Check if our database exists
        const checkResult = await client.query(`
            SELECT 1 FROM pg_database WHERE datname = $1
        `, [process.env.PGDATABASE || process.env.DB_NAME]);

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
    process.env.PGDATABASE || process.env.DB_NAME,
    process.env.PGUSER || process.env.DB_USER,
    process.env.PGPASSWORD || process.env.DB_PASS,
    {
        host: process.env.PGHOST || process.env.DB_HOST,
        port: process.env.PGPORT || process.env.DB_PORT || 5432,
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false // Neon requires SSL
            }
        },
        logging: false,
    }
);;

module.exports = sequelize;
