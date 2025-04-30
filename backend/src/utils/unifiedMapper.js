// Utility to map and normalize data from various sources to a unified structure

/**
 * @typedef {Object} UnifiedRecord
 * @property {string} id
 * @property {string} type
 * @property {string} title
 * @property {string} [description]
 * @property {string} [address]
 * @property {string} [city]
 * @property {string} [state]
 * @property {string} [owner]
 * @property {string} [date] // ISO string
 * @property {string} source
 * @property {Object} [raw] // original data
 */

function normalizeDate(date) {
  if (!date) return undefined;
  const d = new Date(date);
  return isNaN(d) ? undefined : d.toISOString();
}

function mapCERSAI(raw) {
  return {
    id: raw.id?.toString() || '',
    type: raw.type || 'transaction',
    title: raw.type ? `${raw.type} Transaction` : 'Transaction',
    description: raw.amount ? `Amount: ${raw.amount}` : '',
    address: '', // No address in transactions table
    city: '',    // No city in transactions table
    state: '',   // No state in transactions table
    owner: raw.entity_id ? `Entity ID: ${raw.entity_id}` : '',
    date: normalizeDate(raw.date || raw.created_at),
    source: 'CERSAI',
    raw,
  };
}

function mapMCA21(raw) {
  return {
    id: raw.id?.toString() || '',
    type: raw.type || 'entity',
    title: raw.name || 'Entity',
    description: raw.registration_number ? `Reg#: ${raw.registration_number}` : '',
    address: raw.address || '',
    city: '', // No city field in entities table
    state: '', // No state field in entities table
    owner: '', // No owner/director field in entities table
    date: normalizeDate(raw.created_at),
    source: 'MCA21',
    raw,
  };
}

function mapRural(raw) {
  return {
    id: raw.id?.toString() || '',
    type: raw.type || 'property',
    title: raw.title || 'Rural Property',
    description: raw.description || '',
    address: raw.address || '',
    city: raw.village || '',
    state: raw.state || '',
    owner: raw.owner || '',
    date: normalizeDate(raw.date),
    source: 'RURAL',
    raw,
  };
}

function mapUrban(raw) {
  return {
    id: raw.id?.toString() || '',
    type: raw.type || 'property',
    title: raw.title || 'Urban Property',
    description: raw.description || '',
    address: raw.address || '',
    city: raw.city || '',
    state: raw.state || '',
    owner: raw.owner || '',
    date: normalizeDate(raw.date),
    source: 'URBAN',
    raw,
  };
}

function aggregateUnifiedData({ cersai = [], mca21 = [], rural = [], urban = [] }) {
  return [
    ...cersai.map(mapCERSAI),
    ...mca21.map(mapMCA21),
    ...rural.map(mapRural),
    ...urban.map(mapUrban),
  ];
}

module.exports = {
  mapCERSAI,
  mapMCA21,
  mapRural,
  mapUrban,
  aggregateUnifiedData,
};
