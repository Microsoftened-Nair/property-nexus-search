// API endpoint for unified records
const express = require('express');
const router = express.Router();
const { pool } = require('../db/pool');

// GET /unified - fetch all unified records (limit 100 for safety)
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM unified_records ORDER BY created_at DESC LIMIT 100');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching unified records:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /unified/:id - fetch a single unified record by id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM unified_records WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching unified record:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
