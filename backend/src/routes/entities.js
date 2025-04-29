const express = require('express');
const router = express.Router();
const { pool } = require('../db/pool');

// Get all entities
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM entities ORDER BY name');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching entities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get entity by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM entities WHERE id = $1', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Entity not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching entity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Entity-specific search endpoint
router.get('/search', async (req, res) => {
  const { name, registration_number, pan, cin } = req.query;
  
  try {
    let queryConditions = [];
    const queryParams = [];
    let paramIndex = 1;
    
    if (name) {
      queryConditions.push(`LOWER(name) LIKE LOWER($${paramIndex})`);
      queryParams.push(`%${name}%`);
      paramIndex++;
    }
    
    if (registration_number) {
      queryConditions.push(`LOWER(registration_number) LIKE LOWER($${paramIndex})`);
      queryParams.push(`%${registration_number}%`);
      paramIndex++;
    }
    
    if (pan) {
      queryConditions.push(`LOWER(pan) LIKE LOWER($${paramIndex})`);
      queryParams.push(`%${pan}%`);
      paramIndex++;
    }
    
    if (cin) {
      queryConditions.push(`LOWER(cin) LIKE LOWER($${paramIndex})`);
      queryParams.push(`%${cin}%`);
      paramIndex++;
    }
    
    if (queryConditions.length === 0) {
      return res.status(400).json({ error: 'At least one search parameter is required' });
    }
    
    const entitiesQuery = `
      SELECT id, name, type, registration_number, pan, cin, created_at
      FROM entities
      WHERE ${queryConditions.join(' OR ')}
      LIMIT 20
    `;
    
    const entitiesResult = await pool.query(entitiesQuery, queryParams);
    
    const results = entitiesResult.rows.map(entity => ({
      id: entity.id,
      type: 'entity',
      title: entity.name,
      subtitle: entity.cin ? `CIN: ${entity.cin}` : (entity.pan ? `PAN: ${entity.pan}` : `Registration: ${entity.registration_number}`),
      description: `${entity.type ? entity.type.charAt(0).toUpperCase() + entity.type.slice(1) : 'Entity'} record.`,
      source: 'MCA',
      date: `Updated on ${new Date(entity.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`
    }));
    
    // Log search
    await pool.query(
      'INSERT INTO searches (query, type) VALUES ($1, $2)',
      [JSON.stringify(req.query), 'entity']
    ).catch(err => console.error('Error logging search:', err));
    
    return res.json(results);
    
  } catch (error) {
    console.error('Entity search error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
