const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Validate required environment variables
const requiredEnvVars = [
  'DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASS', 'JWT_SECRET',
  'IMAGEKIT_PUBLIC_KEY', 'IMAGEKIT_PRIVATE_KEY', 'IMAGEKIT_URL_ENDPOINT'
];

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
    // Log the database connection parameters (don't log passwords in production!)
    console.log('Database connection parameters:', {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      // Redacting password for security
    });

    await sequelize.authenticate();

    // Initialize model associations
    const models = {
      Post: require('./models/Post'),
      User: require('./models/User'),
      Category: require('./models/Category')
    };

    // Call associate method on each model
    Object.keys(models).forEach(modelName => {
      if (models[modelName].associate) {
        models[modelName].associate(models);
      }
    });

    await sequelize.sync({ alter: true });


    app.listen(PORT, () => {

    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// Initialize analytics auto-cleanup
const { startAutoCleanup } = require('./controllers/analyticsController');
startAutoCleanup();

startServer();
