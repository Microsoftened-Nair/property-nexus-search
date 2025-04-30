-- Create tables for the UDAAN property search portal

-- Entities table (for both individuals and companies)
CREATE TABLE entities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'individual' or 'corporate'
    registration_number VARCHAR(100),
    pan VARCHAR(20),
    cin VARCHAR(50),
    address TEXT,
    contact_info TEXT,
    id_type VARCHAR(50), -- NEW: Aadhaar, PAN, etc.
    identification_number VARCHAR(100), -- NEW
    director_details TEXT, -- NEW: DIN/DPINs, comma-separated
    company_status VARCHAR(50), -- NEW: Active, Inactive, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Properties table
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    address TEXT NOT NULL,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),
    property_type VARCHAR(50), -- residential, commercial, industrial, etc.
    owner_entity_id INTEGER REFERENCES entities(id),
    registration_number VARCHAR(100), -- NEW
    survey_number VARCHAR(100), -- NEW
    district VARCHAR(100), -- NEW
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents table
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    doc_type VARCHAR(100) NOT NULL, -- sale_deed, mortgage_agreement, etc.
    property_id INTEGER REFERENCES properties(id),
    entity_id INTEGER REFERENCES entities(id),
    doc_url TEXT,
    issued_at TIMESTAMP,
    expiry_at TIMESTAMP,
    registration_office VARCHAR(100), -- NEW
    filed_by VARCHAR(255), -- NEW
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    type VARCHAR(100) NOT NULL, -- sale, mortgage, lease, etc.
    property_id INTEGER REFERENCES properties(id),
    entity_id INTEGER REFERENCES entities(id),
    amount DECIMAL(15,2),
    date TIMESTAMP,
    description TEXT, -- NEW
    party_name VARCHAR(255), -- NEW
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Searches table (for analytics)
CREATE TABLE searches (
    id SERIAL PRIMARY KEY,
    query JSON,
    type VARCHAR(50), -- 'general', 'entity', 'property', 'document', 'transaction'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Unified records table for normalized/aggregated data
CREATE TABLE IF NOT EXISTS unified_records (
    id TEXT PRIMARY KEY,
    type TEXT,
    title TEXT,
    description TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    owner TEXT,
    date TIMESTAMP,
    source TEXT,
    raw JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indices for performance
CREATE INDEX idx_entities_name ON entities(name);
CREATE INDEX idx_entities_pan ON entities(pan);
CREATE INDEX idx_entities_cin ON entities(cin);
CREATE INDEX idx_properties_address ON properties(address);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_state ON properties(state);
CREATE INDEX idx_documents_type ON documents(doc_type);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_date ON transactions(date);
