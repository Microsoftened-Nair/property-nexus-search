const { pool } = require('./pool');

async function insertSampleData() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Insert sample entities
    console.log('Inserting sample entities...');
    await client.query(`
      INSERT INTO entities (name, type, registration_number, pan, cin) VALUES
      ('ABC Corporation Ltd.', 'company', 'REG123456', 'ABCDE1234F', 'L12345MH2000PLC123456'),
      ('XYZ Enterprises LLP', 'llp', 'REG789012', 'FGHIJ5678K', 'AAA-0000'),
      ('John Doe', 'individual', NULL, 'DOEJH1234G', NULL),
      ('Sunrise Developers Pvt. Ltd.', 'company', 'REG345678', 'SUNPL4567H', 'U98765MH2010PTC987654'),
      ('Mega Constructions', 'partnership', 'REG567890', 'MEGPC7890J', NULL);
    `);
    
    // Insert sample properties
    console.log('Inserting sample properties...');
    await client.query(`
      INSERT INTO properties (address, city, state, pincode, property_type, owner_entity_id) VALUES
      ('123 Main Street, Phase 1', 'Mumbai', 'Maharashtra', '400001', 'commercial', 1),
      ('Green Valley Apartments, B-101', 'Pune', 'Maharashtra', '411001', 'residential', 3),
      ('Tech Park Tower 3, Floor 12', 'Bangalore', 'Karnataka', '560001', 'commercial', 2),
      ('Plot No. 45, Industrial Area', 'Gurgaon', 'Haryana', '122001', 'industrial', 4),
      ('Villa 789, Palm Beach Road', 'Mumbai', 'Maharashtra', '400001', 'residential', 5);
    `);
    
    // Insert sample documents
    console.log('Inserting sample documents...');
    await client.query(`
      INSERT INTO documents (property_id, entity_id, doc_type, doc_url, issued_at) VALUES
      (1, 1, 'sale_deed', 'https://example.com/docs/deed1.pdf', '2024-03-15'),
      (2, 3, 'mortgage_agreement', 'https://example.com/docs/mortgage1.pdf', '2024-01-20'),
      (3, 4, 'land_record', 'https://example.com/docs/land1.pdf', '2022-11-05'),
      (4, 2, 'sale_deed', 'https://example.com/docs/deed2.pdf', '2023-08-12'),
      (5, 5, 'noc', 'https://example.com/docs/noc1.pdf', '2024-02-28');
    `);
    
    // Insert sample transactions
    console.log('Inserting sample transactions...');
    await client.query(`
      INSERT INTO transactions (property_id, entity_id, type, amount, date) VALUES
      (1, 1, 'sale', 50000000.00, '2024-03-15'),
      (2, 3, 'mortgage', 8000000.00, '2024-01-20'),
      (3, 4, 'lease', 120000.00, '2022-11-05'),
      (4, 2, 'sale', 75000000.00, '2023-08-12'),
      (5, 5, 'mortgage', 15000000.00, '2024-02-28');
    `);
    
    await client.query('COMMIT');
    console.log('Sample data inserted successfully!');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error inserting sample data:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run the insertion
insertSampleData()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
