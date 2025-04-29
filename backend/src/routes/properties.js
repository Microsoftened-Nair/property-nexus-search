const express = require('express');
const router = express.Router();
const { pool } = require('../db/pool');

// Get all properties
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT p.*, e.name as owner_name
      FROM properties p
      LEFT JOIN entities e ON p.owner_entity_id = e.id
      ORDER BY p.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get property by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(`
      SELECT p.*, e.name as owner_name
      FROM properties p
      LEFT JOIN entities e ON p.owner_entity_id = e.id
      WHERE p.id = $1
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Property-specific search endpoint
router.get('/search', async (req, res) => {
  const { address, city, state, pincode, property_type } = req.query;
  
  try {
    let queryConditions = [];
    const queryParams = [];
    let paramIndex = 1;
    
    if (address) {
      queryConditions.push(`LOWER(p.address) LIKE LOWER($${paramIndex})`);
      queryParams.push(`%${address}%`);
      paramIndex++;
    }
    
    if (city) {
      queryConditions.push(`LOWER(p.city) LIKE LOWER($${paramIndex})`);
      queryParams.push(`%${city}%`);
      paramIndex++;
    }
    
    if (state) {
      queryConditions.push(`LOWER(p.state) LIKE LOWER($${paramIndex})`);
      queryParams.push(`%${state}%`);
      paramIndex++;
    }
    
    if (pincode) {
      queryConditions.push(`LOWER(p.pincode) LIKE LOWER($${paramIndex})`);
      queryParams.push(`%${pincode}%`);
      paramIndex++;
    }
    
    if (property_type) {
      queryConditions.push(`LOWER(p.property_type) = LOWER($${paramIndex})`);
      queryParams.push(property_type);
      paramIndex++;
    }
    
    if (queryConditions.length === 0) {
      return res.status(400).json({ error: 'At least one search parameter is required' });
    }
    
    const propertiesQuery = `
      SELECT p.id, p.address, p.city, p.state, p.pincode, p.property_type, p.created_at,
             e.name as owner_name
      FROM properties p
      LEFT JOIN entities e ON p.owner_entity_id = e.id
      WHERE ${queryConditions.join(' OR ')}
      LIMIT 20
    `;
    
    const propertiesResult = await pool.query(propertiesQuery, queryParams);
    
    const results = propertiesResult.rows.map(property => ({
      id: property.id,
      type: 'property',
      title: `${property.property_type ? property.property_type.charAt(0).toUpperCase() + property.property_type.slice(1) : 'Property'} - ${property.city}`,
      subtitle: `Registration #: PROP${property.id.toString().padStart(5, '0')}`,
      description: `${property.address}, ${property.city}, ${property.state} - ${property.pincode}. Owner: ${property.owner_name || 'Unknown'}`,
      source: 'DORIS',
      date: `Updated on ${new Date(property.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`
    }));
    
    // Log search
    await pool.query(
      'INSERT INTO searches (query, type) VALUES ($1, $2)',
      [JSON.stringify(req.query), 'property']
    ).catch(err => console.error('Error logging search:', err));
    
    return res.json(results);
    
  } catch (error) {
    console.error('Property search error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
