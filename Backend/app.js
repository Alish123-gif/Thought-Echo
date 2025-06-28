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
    // Log the database connection parameters for debugging
    console.log('📊 Database connection info:', getDatabaseConnectionInfo());

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
