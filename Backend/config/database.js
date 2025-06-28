const { Sequelize } = require('sequelize');
const pg = require('pg');

// Create the database if it doesn't exist (skip for Neon as it creates the database automatically)
async function createDatabaseIfNotExists() {
    // Skip database creation for Neon as it provides the database ready to use
    if (process.env.PGHOST && process.env.PGHOST.includes('neon.tech')) {
        console.log('Using Neon database - skipping database creation');
        return;
    }

    const connectionParams = {
        host: process.env.PGHOST || process.env.DB_HOST,
        port: process.env.PGPORT || process.env.DB_PORT || 5432,
        database: process.env.PGDATABASE || process.env.DB_NAME,
        user: process.env.PGUSER || process.env.DB_USER
    };

    console.log('Database connection parameters:', connectionParams);

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
        await client.connect();


        // Check if our database exists
        const checkResult = await client.query(`
            SELECT 1 FROM pg_database WHERE datname = $1
        `, [process.env.PGDATABASE || process.env.DB_NAME]);

        if (checkResult.rowCount === 0) {

            // Create the database
            await client.query(`CREATE DATABASE "${process.env.PGDATABASE || process.env.DB_NAME}"`);

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
