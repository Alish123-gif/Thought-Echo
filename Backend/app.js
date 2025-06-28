const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Validate required environment variables
const requiredEnvVars = [
  'JWT_SECRET',
  'IMAGEKIT_PUBLIC_KEY', 'IMAGEKIT_PRIVATE_KEY', 'IMAGEKIT_URL_ENDPOINT'
];

// Check for database connection - either Neon format or traditional format
const hasNeonEnv = process.env.PGHOST && process.env.PGDATABASE && process.env.PGUSER && process.env.PGPASSWORD;
const hasTraditionalEnv = process.env.DB_HOST && process.env.DB_NAME && process.env.DB_USER && process.env.DB_PASS;

if (!hasNeonEnv && !hasTraditionalEnv) {
  console.error('Error: Missing database environment variables. Please provide either:');
  console.error('Neon format: PGHOST, PGDATABASE, PGUSER, PGPASSWORD');
  console.error('Traditional format: DB_HOST, DB_NAME, DB_USER, DB_PASS');
  process.exit(1);
}

const missingEnvVars = requiredEnvVars.filter(env => !process.env[env]);
if (missingEnvVars.length > 0) {
  console.error(`Error: Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

const sequelize = require(path.join(__dirname, 'config', 'database'));
const authRoutes = require(path.join(__dirname, 'routes', 'auth'));
const postRoutes = require(path.join(__dirname, 'routes', 'posts'));
const categoryRoutes = require(path.join(__dirname, 'routes', 'categories'));
const analyticsRoutes = require(path.join(__dirname, 'routes', 'analytics'));
const userRoutes = require(path.join(__dirname, 'routes', 'users'));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api', categoryRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/user', userRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

app.get('/', (req, res) => {
  res.json({ message: 'API is running...' });
});

const startServer = async () => {
  try {
    // Log the database connection parameters for debugging
    console.log('Database connection parameters:', {
      host: process.env.PGHOST || process.env.DB_HOST,
      port: process.env.PGPORT || process.env.DB_PORT || 5432,
      database: process.env.PGDATABASE || process.env.DB_NAME,
      user: process.env.PGUSER || process.env.DB_USER,
      // Redacting password for security
    });

    await sequelize.authenticate();

    // Initialize model associations
    const models = {
      Post: require('./models/Post'),
      User: require('./models/User'),
      Category: require('./models/Category'),
      Analytics: require('./models/Analytics')
    };

    // Call associate method on each model
    Object.keys(models).forEach(modelName => {
      if (models[modelName].associate) {
        models[modelName].associate(models);
      }
    });

    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized successfully');

    // Initialize analytics auto-cleanup AFTER database sync
    const { startAutoCleanup } = require('./controllers/analyticsController');
    startAutoCleanup();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();
