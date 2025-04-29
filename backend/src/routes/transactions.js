const express = require('express');
const router = express.Router();
const { pool } = require('../db/pool');

// Get all transactions
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT t.*, 
             p.address as property_address, p.city as property_city,
             e.name as entity_name
      FROM transactions t
      LEFT JOIN properties p ON t.property_id = p.id
      LEFT JOIN entities e ON t.entity_id = e.id
      ORDER BY t.date DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get transaction by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(`
      SELECT t.*, 
             p.address as property_address, p.city as property_city,
             e.name as entity_name
      FROM transactions t
      LEFT JOIN properties p ON t.property_id = p.id
      LEFT JOIN entities e ON t.entity_id = e.id
      WHERE t.id = $1
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Transaction-specific search endpoint
router.get('/search', async (req, res) => {
  const { type, date_from, date_to, min_amount, max_amount } = req.query;
  
  try {
    let queryConditions = [];
    const queryParams = [];
    let paramIndex = 1;
    
    if (type) {
      queryConditions.push(`LOWER(t.type) = LOWER($${paramIndex})`);
      queryParams.push(type);
      paramIndex++;
    }
    
    if (date_from) {
      queryConditions.push(`t.date >= $${paramIndex}`);
      queryParams.push(date_from);
      paramIndex++;
    }
    
    if (date_to) {
      queryConditions.push(`t.date <= $${paramIndex}`);
      queryParams.push(date_to);
      paramIndex++;
    }
    
    if (min_amount) {
      queryConditions.push(`t.amount >= $${paramIndex}`);
      queryParams.push(parseFloat(min_amount));
      paramIndex++;
    }
    
    if (max_amount) {
      queryConditions.push(`t.amount <= $${paramIndex}`);
      queryParams.push(parseFloat(max_amount));
      paramIndex++;
    }
    
    if (queryConditions.length === 0) {
      return res.status(400).json({ error: 'At least one search parameter is required' });
    }
    
    const transactionsQuery = `
      SELECT t.id, t.type, t.date, t.amount, t.created_at,
             p.address, p.city, p.state,
             e.name as entity_name
      FROM transactions t
      LEFT JOIN properties p ON t.property_id = p.id
      LEFT JOIN entities e ON t.entity_id = e.id
      WHERE ${queryConditions.join(' AND ')}
      LIMIT 20
    `;
    
    const transactionsResult = await pool.query(transactionsQuery, queryParams);
    
    const results = transactionsResult.rows.map(transaction => ({
      id: transaction.id,
      type: 'transaction',
      title: `${transaction.type ? transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1) : 'Transaction'} Record`,
      subtitle: `Transaction ID: TRANS${transaction.id.toString().padStart(5, '0')}`,
      description: `${transaction.type} transaction of ₹${transaction.amount.toLocaleString('en-IN')} on property at ${transaction.address}, involving ${transaction.entity_name}.`,
      source: 'CERSAI',
      date: `Updated on ${new Date(transaction.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`
    }));
    
    // Log search
    await pool.query(
      'INSERT INTO searches (query, type) VALUES ($1, $2)',
      [JSON.stringify(req.query), 'transaction']
    ).catch(err => console.error('Error logging search:', err));
    
    return res.json(results);
    
  } catch (error) {
    console.error('Transaction search error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
