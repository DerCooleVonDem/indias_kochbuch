require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

// Create a database pool that can be exported
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST || 'db',
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT || 5432,
});

// Export the pool for use in other modules
module.exports.pool = pool;

const recipesRoutes = require('./routes/recipes');
const shoppingListRoutes = require('./routes/shopping_list');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// We're using the pool exported at the top of the file

// Test database connection with retry mechanism
const connectWithRetry = () => {
  const maxRetries = 5;
  let retries = 0;
  
  const attemptConnection = () => {
    pool.query('SELECT NOW()', (err, res) => {
      if (err) {
        console.error('Database connection error:', err.stack);
        if (retries < maxRetries) {
          retries++;
          console.log(`Retrying database connection (${retries}/${maxRetries})...`);
          setTimeout(attemptConnection, 5000); // Wait 5 seconds before retrying
        } else {
          console.error('Max retries reached. Could not connect to database.');
        }
      } else {
        console.log('Database connected:', res.rows[0]);
      }
    });
  };
  
  attemptConnection();
};

connectWithRetry();

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// Recipe routes
app.use('/api/recipes', recipesRoutes);

// Shopping list routes
app.use('/api/shopping-list', shoppingListRoutes);

// Example route to test database
app.get('/api/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ time: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Initialize database tables
const initShoppingList = require('./db/init_shopping_list');

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});