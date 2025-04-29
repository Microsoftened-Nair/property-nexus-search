const express = require('express');
const router = express.Router();
const { pool } = require('../db/pool');

// Get all documents
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT d.*, 
             p.address as property_address, p.city as property_city,
             e.name as entity_name
      FROM documents d
      LEFT JOIN properties p ON d.property_id = p.id
      LEFT JOIN entities e ON d.entity_id = e.id
      ORDER BY d.issued_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get document by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(`
      SELECT d.*, 
             p.address as property_address, p.city as property_city, p.state as property_state,
             e.name as entity_name, e.type as entity_type
      FROM documents d
      LEFT JOIN properties p ON d.property_id = p.id
      LEFT JOIN entities e ON d.entity_id = e.id
      WHERE d.id = $1
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Document-specific search endpoint
router.get('/search', async (req, res) => {
  const { documentId, documentType, registrationOffice, filedBy, yearFiled } = req.query;
  
  try {
    let queryConditions = [];
    const queryParams = [];
    let paramIndex = 1;
    
    if (documentId) {
      queryConditions.push(`d.id = $${paramIndex}`);
      queryParams.push(parseInt(documentId));
      paramIndex++;
    }
    
    if (documentType) {
      queryConditions.push(`LOWER(d.doc_type) = LOWER($${paramIndex})`);
      queryParams.push(documentType);
      paramIndex++;
    }
    
    if (filedBy) {
      queryConditions.push(`LOWER(e.name) LIKE LOWER($${paramIndex})`);
      queryParams.push(`%${filedBy}%`);
      paramIndex++;
    }
    
    if (yearFiled) {
      queryConditions.push(`EXTRACT(YEAR FROM d.issued_at) = $${paramIndex}`);
      queryParams.push(parseInt(yearFiled));
      paramIndex++;
    }
    
    // Registration office is not directly in our schema, so we'll search in property address
    if (registrationOffice) {
      queryConditions.push(`LOWER(p.address) LIKE LOWER($${paramIndex})`);
      queryParams.push(`%${registrationOffice}%`);
      paramIndex++;
    }
    
    if (queryConditions.length === 0) {
      return res.status(400).json({ error: 'At least one search parameter is required' });
    }
    
    const documentsQuery = `
      SELECT d.id, d.doc_type, d.doc_url, d.issued_at, d.created_at,
             p.address, p.city, p.state,
             e.name as entity_name
      FROM documents d
      LEFT JOIN properties p ON d.property_id = p.id
      LEFT JOIN entities e ON d.entity_id = e.id
      WHERE ${queryConditions.join(' AND ')}
      LIMIT 20
    `;
    
    const documentsResult = await pool.query(documentsQuery, queryParams);
    
    const results = documentsResult.rows.map(document => ({
      id: document.id,
      type: 'document',
      title: `${document.doc_type ? document.doc_type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Document'}`,
      subtitle: `Document #: DOC${document.id.toString().padStart(5, '0')}`,
      description: `Document related to property at ${document.address}, ${document.city}. Filed by ${document.entity_name}.`,
      source: 'DORIS',
      date: `Updated on ${new Date(document.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`
    }));
    
    // Log search
    await pool.query(
      'INSERT INTO searches (query, type) VALUES ($1, $2)',
      [JSON.stringify(req.query), 'document']
    ).catch(err => console.error('Error logging search:', err));
    
    return res.json(results);
    
  } catch (error) {
    console.error('Document search error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
