const express = require('express');
const router = express.Router();
const { pool } = require('../server'); // Import the shared pool from server.js

// Get all shopping list items
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM shopping_list_items ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new shopping list item
router.post('/', async (req, res) => {
  try {
    const { name, quantity, unit, checked } = req.body;
    
    const result = await pool.query(
      'INSERT INTO shopping_list_items (name, quantity, unit, checked) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, quantity, unit, checked || false]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a shopping list item
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity, unit, checked } = req.body;
    
    const result = await pool.query(
      'UPDATE shopping_list_items SET name = $1, quantity = $2, unit = $3, checked = $4 WHERE id = $5 RETURNING *',
      [name, quantity, unit, checked, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Shopping list item not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete all checked items
router.delete('/checked', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM shopping_list_items WHERE checked = true RETURNING *');
    res.json({ message: `${result.rowCount} checked items deleted successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a shopping list item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM shopping_list_items WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Shopping list item not found' });
    }
    
    res.json({ message: 'Shopping list item deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;