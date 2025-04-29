const express = require('express');
const router = express.Router();
const { pool } = require('../db/pool');

// General search endpoint that searches across all tables
router.get('/', async (req, res) => {
  const { q: query } = req.query;
  
  if (!query || query.trim() === '') {
    return res.status(400).json({ error: 'Query parameter is required' });
  }
  
  try {
    const results = [];
    
    // Search in entities
    const entitiesQuery = `
      SELECT id, name, type, registration_number, pan, cin, created_at, 
             'entity' as result_type
      FROM entities 
      WHERE LOWER(name) LIKE LOWER($1) 
         OR LOWER(registration_number) LIKE LOWER($1)
         OR LOWER(pan) LIKE LOWER($1)
         OR LOWER(cin) LIKE LOWER($1)
      LIMIT 10
    `;
    
    const entitiesResult = await pool.query(entitiesQuery, [`%${query}%`]);
    results.push(...entitiesResult.rows.map(entity => ({
      id: entity.id,
      type: 'entity',
      title: entity.name,
      subtitle: entity.cin ? `CIN: ${entity.cin}` : (entity.pan ? `PAN: ${entity.pan}` : `Registration: ${entity.registration_number}`),
      description: `${entity.type ? entity.type.charAt(0).toUpperCase() + entity.type.slice(1) : 'Entity'} record.`,
      source: 'MCA',
      date: `Updated on ${new Date(entity.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`
    })));
    
    // Search in properties
    const propertiesQuery = `
      SELECT p.id, p.address, p.city, p.state, p.pincode, p.property_type, p.created_at, 
             e.name as owner_name,
             'property' as result_type
      FROM properties p
      LEFT JOIN entities e ON p.owner_entity_id = e.id
      WHERE LOWER(p.address) LIKE LOWER($1)
         OR LOWER(p.city) LIKE LOWER($1)
         OR LOWER(p.state) LIKE LOWER($1)
         OR LOWER(p.pincode) LIKE LOWER($1)
      LIMIT 10
    `;
    
    const propertiesResult = await pool.query(propertiesQuery, [`%${query}%`]);
    results.push(...propertiesResult.rows.map(property => ({
      id: property.id,
      type: 'property',
      title: `${property.property_type ? property.property_type.charAt(0).toUpperCase() + property.property_type.slice(1) : 'Property'} - ${property.city}`,
      subtitle: `Registration #: PROP${property.id.toString().padStart(5, '0')}`,
      description: `${property.address}, ${property.city}, ${property.state} - ${property.pincode}. Owner: ${property.owner_name || 'Unknown'}`,
      source: 'DORIS',
      date: `Updated on ${new Date(property.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`
    })));
    
    // Search in transactions
    const transactionsQuery = `
      SELECT t.id, t.type, t.date, t.amount, t.created_at,
             p.address, p.city, p.state,
             e.name as entity_name,
             'transaction' as result_type
      FROM transactions t
      LEFT JOIN properties p ON t.property_id = p.id
      LEFT JOIN entities e ON t.entity_id = e.id
      WHERE LOWER(p.address) LIKE LOWER($1)
         OR LOWER(p.city) LIKE LOWER($1)
         OR LOWER(e.name) LIKE LOWER($1)
         OR CAST(t.amount AS TEXT) LIKE $1
      LIMIT 10
    `;
    
    const transactionsResult = await pool.query(transactionsQuery, [`%${query}%`]);
    results.push(...transactionsResult.rows.map(transaction => ({
      id: transaction.id,
      type: 'transaction',
      title: `${transaction.type ? transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1) : 'Transaction'} Record`,
      subtitle: `Transaction ID: TRANS${transaction.id.toString().padStart(5, '0')}`,
      description: `${transaction.type} transaction of ₹${transaction.amount.toLocaleString('en-IN')} on property at ${transaction.address}, involving ${transaction.entity_name}.`,
      source: 'CERSAI',
      date: `Updated on ${new Date(transaction.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`
    })));
    
    // Search in documents
    const documentsQuery = `
      SELECT d.id, d.doc_type, d.doc_url, d.issued_at, d.created_at,
             p.address, p.city, p.state,
             e.name as entity_name,
             'document' as result_type
      FROM documents d
      LEFT JOIN properties p ON d.property_id = p.id
      LEFT JOIN entities e ON d.entity_id = e.id
      WHERE LOWER(d.doc_type) LIKE LOWER($1)
         OR LOWER(p.address) LIKE LOWER($1)
         OR LOWER(e.name) LIKE LOWER($1)
      LIMIT 10
    `;
    
    const documentsResult = await pool.query(documentsQuery, [`%${query}%`]);
    results.push(...documentsResult.rows.map(document => ({
      id: document.id,
      type: 'document',
      title: `${document.doc_type ? document.doc_type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Document'}`,
      subtitle: `Document #: DOC${document.id.toString().padStart(5, '0')}`,
      description: `Document related to property at ${document.address}, ${document.city}. Filed by ${document.entity_name}.`,
      source: 'DORIS',
      date: `Updated on ${new Date(document.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`
    })));
    
    // Log search query
    await pool.query(
      'INSERT INTO searches (query, type) VALUES ($1, $2)',
      [query, 'general']
    ).catch(err => console.error('Error logging search:', err));
    
    return res.json(results);
    
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
