const express = require('express');
const cors = require('cors');
const path = require('path');
const { config, validateConfig, getDatabaseConnectionInfo } = require('./config/config');

// Validate configuration early
try {
  validateConfig();
} catch (error) {
  console.error('❌ Configuration validation failed:', error.message);
  process.exit(1);
}

const sequelize = require(path.join(__dirname, 'config', 'database'));
const authRoutes = require(path.join(__dirname, 'routes', 'auth'));
const postRoutes = require(path.join(__dirname, 'routes', 'posts'));
const categoryRoutes = require(path.join(__dirname, 'routes', 'categories'));
const analyticsRoutes = require(path.join(__dirname, 'routes', 'analytics'));
const userRoutes = require(path.join(__dirname, 'routes', 'users'));

const app = express();
const PORT = config.server.port;

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
  console.error('❌ Global error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    error: config.server.nodeEnv === 'development' ? err : {}
  });
});

app.get('/', (req, res) => {
  res.json({ message: 'API is running...' });
});

const startServer = async () => {
  try {
<<<<<<< HEAD
    // Log the database connection parameters (don't log passwords in production!)
    console.log('Database connection parameters:');
    console.log('- Host:', process.env.DB_HOST);
    console.log('- Port:', process.env.DB_PORT);
    console.log('- Database:', process.env.DB_NAME);
    console.log('- User:', process.env.DB_USER);
    console.log('- Password:', process.env.DB_PASS ? '[SET]' : '[NOT SET]');
    
    console.log('Attempting to authenticate with database...');
=======
    // Log the database connection parameters for debugging
    console.log('📊 Database connection info:', getDatabaseConnectionInfo());

>>>>>>> 6253b798ea40686e22818315742bb61248b66d8f
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

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

    console.log('Synchronizing database models...');
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized successfully.');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    console.error('\nTroubleshooting tips:');
    console.error('1. Check if your database server is running');
    console.error('2. Verify your database credentials in .env file');
    console.error('3. Ensure the database host is accessible');
    console.error('4. Check if the database exists');
    
    if (error.code === 'ENOTFOUND') {
      console.error('\nERELATED ERROR: The hostname could not be resolved.');
      console.error('This usually means:');
      console.error('- The database host is incorrect');
      console.error('- You\'re trying to connect to an external database that\'s not accessible');
      console.error('- Network connectivity issues');
    }
    
    process.exit(1);
  }
};

// Initialize analytics auto-cleanup
const { startAutoCleanup } = require('./controllers/analyticsController');
startAutoCleanup();

startServer();
