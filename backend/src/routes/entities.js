const express = require('express');
const router = express.Router();
const { pool } = require('../db/pool');

// Entity-specific search endpoint
router.get('/search', async (req, res) => {
  console.log('HIT /api/entities/search', req.query);
  // Support all advanced search fields for both individuals and corporates
  // Map frontend field names to backend columns
  const {
    name, // individual/corporate
    registration_number,
    pan,
    cin,
    idType, // individual
    identificationNumber, // individual
    contactInfo, // individual
    companyName, // corporate (maps to name)
    cinNumber, // corporate (maps to cin)
    directorDetails, // corporate
    companyStatus // corporate
  } = req.query;

  try {
    let queryConditions = [];
    const queryParams = [];
    let paramIndex = 1;

    // Individual fields
    if (name) {
      queryConditions.push(`LOWER(name) LIKE LOWER($${paramIndex})`);
      queryParams.push(`%${name}%`);
      paramIndex++;
    }
    if (idType) {
      queryConditions.push(`LOWER(id_type) = LOWER($${paramIndex})`);
      queryParams.push(idType);
      paramIndex++;
    }
    if (identificationNumber) {
      queryConditions.push(`LOWER(identification_number) LIKE LOWER($${paramIndex})`);
      queryParams.push(`%${identificationNumber}%`);
      paramIndex++;
    }
    if (contactInfo) {
      queryConditions.push(`LOWER(contact_info) LIKE LOWER($${paramIndex})`);
      queryParams.push(`%${contactInfo}%`);
      paramIndex++;
    }

    // Corporate fields
    if (companyName) {
      queryConditions.push(`LOWER(name) LIKE LOWER($${paramIndex})`);
      queryParams.push(`%${companyName}%`);
      paramIndex++;
    }
    if (cinNumber) {
      queryConditions.push(`LOWER(cin) LIKE LOWER($${paramIndex})`);
      queryParams.push(`%${cinNumber}%`);
      paramIndex++;
    }
    if (directorDetails) {
      queryConditions.push(`LOWER(director_details) LIKE LOWER($${paramIndex})`);
      queryParams.push(`%${directorDetails}%`);
      paramIndex++;
    }
    if (companyStatus && companyStatus !== 'any') {
      queryConditions.push(`LOWER(company_status) = LOWER($${paramIndex})`);
      queryParams.push(companyStatus);
      paramIndex++;
    }

    // Common fields
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
      console.log('No search parameters provided');
      return res.status(400).json({ error: 'At least one search parameter is required' });
    }
    const entitiesQuery = `
      SELECT id, name, type, registration_number, pan, cin, id_type, identification_number, contact_info, director_details, company_status, created_at
      FROM entities
      WHERE ${queryConditions.join(' AND ')}
      LIMIT 20
    `;
    console.log('Entities SQL:', entitiesQuery);
    console.log('Params:', queryParams);
    try {
      const entitiesResult = await pool.query(entitiesQuery, queryParams);
      console.log('Entities query result:', entitiesResult.rows);
      const results = entitiesResult.rows.map(entity => ({
        id: entity.id,
        type: 'entity',
        title: entity.name,
        subtitle: entity.cin ? `CIN: ${entity.cin}` : (entity.pan ? `PAN: ${entity.pan}` : `Registration: ${entity.registration_number}`),
        description: `${entity.type ? entity.type.charAt(0).toUpperCase() + entity.type.slice(1) : 'Entity'} record.`,
        source: 'MCA',
        date: `Updated on ${new Date(entity.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`,
        // Add all advanced fields for details view
        id_type: entity.id_type,
        identification_number: entity.identification_number,
        contact_info: entity.contact_info,
        director_details: entity.director_details,
        company_status: entity.company_status
      }));
      console.log('Mapped results:', results);
      // Log search
      await pool.query(
        'INSERT INTO searches (query, type) VALUES ($1, $2)',
        [JSON.stringify(req.query), 'entity']
      ).catch(err => console.error('Error logging search:', err));
      return res.json(results);
    } catch (sqlError) {
      console.error('Entity search SQL error:', sqlError);
      console.error('Query:', entitiesQuery);
      console.error('Params:', queryParams);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } catch (error) {
    console.error('Entity search error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

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

module.exports = router;
