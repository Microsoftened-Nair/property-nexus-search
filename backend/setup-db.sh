#!/bin/bash

# Create database
echo "Creating database..."
createdb udaan_db

# Run schema
echo "Creating tables..."
psql udaan_db < src/db/schema.sql

echo "Database setup complete!"
