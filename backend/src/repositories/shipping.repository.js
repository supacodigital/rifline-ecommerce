const db = require('../config/db');

// --- Zones ---
async function findAllZones() {
  const [rows] = await db.query('SELECT * FROM shipping_zones WHERE is_active = 1 ORDER BY name ASC');
  return rows;
}

async function findZoneById(id) {
  const [rows] = await db.query('SELECT * FROM shipping_zones WHERE id = ?', [id]);
  return rows[0] || null;
}

// Trouver la zone correspondant à un pays
async function findZoneByCountry(country_code) {
  const [rows] = await db.query(
    `SELECT * FROM shipping_zones WHERE is_active = 1 AND FIND_IN_SET(?, REPLACE(country_codes, ' ', ''))`,
    [country_code]
  );
  return rows[0] || null;
}

async function createZone({ name, country_codes, is_active }) {
  const [result] = await db.query(
    'INSERT INTO shipping_zones (name, country_codes, is_active) VALUES (?, ?, ?)',
    [name, country_codes, is_active ?? 1]
  );
  return result.insertId;
}

async function updateZone(id, fields) {
  const allowed = ['name','country_codes','is_active'];
  const keys    = Object.keys(fields).filter(k => allowed.includes(k));
  if (!keys.length) return;
  const set    = keys.map(k => `${k} = ?`).join(', ');
  const values = keys.map(k => fields[k]);
  await db.query(`UPDATE shipping_zones SET ${set} WHERE id = ?`, [...values, id]);
}

async function deleteZone(id) {
  await db.query('DELETE FROM shipping_zones WHERE id = ?', [id]);
}

// --- Rates ---
async function findRatesByZone(zone_id) {
  const [rows] = await db.query(
    'SELECT * FROM shipping_rates WHERE zone_id = ? AND is_active = 1 ORDER BY price_eur ASC',
    [zone_id]
  );
  return rows;
}

async function createRate(data) {
  const [result] = await db.query(
    'INSERT INTO shipping_rates (zone_id, carrier, service_name, min_weight_g, max_weight_g, price_eur, estimated_days, is_active) VALUES (?,?,?,?,?,?,?,?)',
    [data.zone_id, data.carrier, data.service_name, data.min_weight_g||0, data.max_weight_g||null, data.price_eur, data.estimated_days||null, data.is_active??1]
  );
  return result.insertId;
}

async function deleteRate(id) {
  await db.query('DELETE FROM shipping_rates WHERE id = ?', [id]);
}

module.exports = { findAllZones, findZoneById, findZoneByCountry, createZone, updateZone, deleteZone, findRatesByZone, createRate, deleteRate };
