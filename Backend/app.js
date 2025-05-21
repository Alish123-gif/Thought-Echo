const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const sequelize = require(path.join(__dirname, 'config', 'database'));
const authRoutes = require(path.join(__dirname, 'routes', 'auth'));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Only use the auth routes
app.use('/api/auth', authRoutes);


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
    await sequelize.sync({ alter: true });
    console.log('Database connected and synced');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();
