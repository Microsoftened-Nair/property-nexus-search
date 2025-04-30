const express = require('express');
const router = express.Router();

// Import route handlers
const searchRouter = require('./search');
const entityRouter = require('./entities');
const propertyRouter = require('./properties');
const transactionRouter = require('./transactions');
const documentRouter = require('./documents');
const searchesRouter = require('./searches');

// Register routes
router.use('/search', searchRouter);
router.use('/entities', entityRouter);
router.use('/properties', propertyRouter);
router.use('/transactions', transactionRouter);
router.use('/documents', documentRouter);
router.use('/searches', searchesRouter);

module.exports = router;
