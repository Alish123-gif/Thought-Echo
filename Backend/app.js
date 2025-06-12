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

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api', categoryRoutes);
app.use('/api/analytics', analyticsRoutes);

// Debug endpoint for testing ImageKit
app.get('/api/debug/imagekit', async (req, res) => {
  try {
    const imagekit = require('./config/imagekit');
    const result = await imagekit.listFiles({ limit: 1 });
    res.json({
      success: true,
      message: 'ImageKit working',
      fileCount: result.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.response?.data
    });
  }
});

// Additional debug endpoint to test auth parameters
app.get('/api/debug/imagekit-auth', async (req, res) => {
  try {
    const imagekit = require('./config/imagekit');

    // Test auth parameter generation
    const authParams = imagekit.getAuthenticationParameters();

    res.json({
      success: true,
      message: 'Auth parameters generated successfully',
      config: {
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY?.substring(0, 15) + '...',
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
        privateKeyExists: !!process.env.IMAGEKIT_PRIVATE_KEY,
        privateKeyFormat: process.env.IMAGEKIT_PRIVATE_KEY?.startsWith('private_') ? 'Correct' : 'Invalid',
        publicKeyFormat: process.env.IMAGEKIT_PUBLIC_KEY?.startsWith('public_') ? 'Correct' : 'Invalid'
      },
      authParams: {
        token: authParams.token,
        expire: authParams.expire,
        signature: authParams.signature
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});

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

    // Test ImageKit connection after server starts
    testImageKitConnection();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// Test ImageKit connection
async function testImageKitConnection() {
  try {

    const imagekit = require('./config/imagekit');

    // Test different endpoints to isolate the issue


    // Test 1: Check if we can create upload token (this tests auth without actual upload)
    try {
      const authParams = imagekit.getAuthenticationParameters();




    } catch (authError) {

    }

    // Test 2: Try listing files
    const result = await imagekit.listFiles({ limit: 1 });

  } catch (error) {
    console.error('❌ ImageKit connection failed:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY?.substring(0, 10) + '...',
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
        privateKeyExists: !!process.env.IMAGEKIT_PRIVATE_KEY
      }
    });

    // Additional check: Try to validate the keys format
    if (process.env.IMAGEKIT_PUBLIC_KEY && !process.env.IMAGEKIT_PUBLIC_KEY.startsWith('public_')) {
      console.error('⚠️  Public key doesn\'t start with "public_" - this might be incorrect');
    }
    if (process.env.IMAGEKIT_PRIVATE_KEY && !process.env.IMAGEKIT_PRIVATE_KEY.startsWith('private_')) {
      console.error('⚠️  Private key doesn\'t start with "private_" - this might be incorrect');
    }
  }
}

// Initialize analytics auto-cleanup
const { startAutoCleanup } = require('./controllers/analyticsController');
startAutoCleanup();

startServer();
