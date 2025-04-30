const express = require('express');
const router = express.Router();
const { pool } = require('../db/pool');

// Get recent searches
router.get('/', async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  try {
    const { rows } = await pool.query(
      'SELECT * FROM searches ORDER BY created_at DESC LIMIT $1',
      [limit]
    );
    // Format for frontend
    const formatted = rows.map(row => ({
      id: row.id,
      query: row.query,
      type: row.type,
      created_at: row.created_at
    }));
    res.json(formatted);
  } catch (error) {
    console.error('Error fetching recent searches:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
