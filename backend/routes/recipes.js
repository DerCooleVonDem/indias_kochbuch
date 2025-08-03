const express = require('express');
const router = express.Router();
const { pool } = require('../server'); // Import the shared pool from server.js

// Get all recipes
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM recipes');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a specific recipe by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM recipes WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new recipe
router.post('/', async (req, res) => {
  try {
    const { title, ingredients, instructions, cooking_time, servings, thumbnail_uri } = req.body;
    
    const result = await pool.query(
      'INSERT INTO recipes (title, ingredients, instructions, cooking_time, servings, thumbnail_uri) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, ingredients, instructions, cooking_time, servings, thumbnail_uri]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a recipe
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, ingredients, instructions, cooking_time, servings, thumbnail_uri } = req.body;
    
    const result = await pool.query(
      'UPDATE recipes SET title = $1, ingredients = $2, instructions = $3, cooking_time = $4, servings = $5, thumbnail_uri = $6 WHERE id = $7 RETURNING *',
      [title, ingredients, instructions, cooking_time, servings, thumbnail_uri, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a recipe
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM recipes WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    
    res.json({ message: 'Recipe deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;