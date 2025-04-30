// Script to aggregate and normalize data from all sources and store in unified_records
const { pool } = require('./pool');
const {
  mapCERSAI,
  mapMCA21,
  mapRural,
  mapUrban,
  aggregateUnifiedData,
} = require('../utils/unifiedMapper');

async function fetchAllCERSAI() {
  const { rows } = await pool.query('SELECT * FROM transactions');
  return rows;
}
async function fetchAllMCA21() {
  const { rows } = await pool.query('SELECT * FROM entities');
  return rows;
}
async function fetchAllRural() {
  // Placeholder: in real use, fetch from rural table or API
  return [];
}
async function fetchAllUrban() {
  // Placeholder: in real use, fetch from urban table or API
  return [];
}

async function upsertUnifiedRecord(record) {
  await pool.query(
    `INSERT INTO unified_records (id, type, title, description, address, city, state, owner, date, source, raw)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     ON CONFLICT (id) DO UPDATE SET
       type=EXCLUDED.type,
       title=EXCLUDED.title,
       description=EXCLUDED.description,
       address=EXCLUDED.address,
       city=EXCLUDED.city,
       state=EXCLUDED.state,
       owner=EXCLUDED.owner,
       date=EXCLUDED.date,
       source=EXCLUDED.source,
       raw=EXCLUDED.raw;`,
    [
      record.id,
      record.type,
      record.title,
      record.description,
      record.address,
      record.city,
      record.state,
      record.owner,
      record.date,
      record.source,
      JSON.stringify(record.raw),
    ]
  );
}

async function main() {
  const cersai = await fetchAllCERSAI();
  const mca21 = await fetchAllMCA21();
  const rural = await fetchAllRural();
  const urban = await fetchAllUrban();
  const unified = aggregateUnifiedData({ cersai, mca21, rural, urban });
  for (const record of unified) {
    await upsertUnifiedRecord(record);
  }
  console.log(`Unified ${unified.length} records.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
