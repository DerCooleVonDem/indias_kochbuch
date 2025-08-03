const { pool } = require('../server');
const fs = require('fs');
const path = require('path');

async function initShoppingListTable() {
  try {
    console.log('Initializing shopping list table...');
    
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'shopping_list_table.sql');
    const sqlQuery = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Execute the SQL query
    await pool.query(sqlQuery);
    
    console.log('Shopping list table initialized successfully');
  } catch (err) {
    console.error('Error initializing shopping list table:', err);
  }
}

// Run the initialization
initShoppingListTable();