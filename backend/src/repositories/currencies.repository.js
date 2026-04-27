const db = require('../config/db');

async function findAll() {
  const [rows] = await db.query('SELECT * FROM currencies WHERE is_active = 1 ORDER BY code ASC');
  return rows;
}

async function findAllAdmin() {
  const [rows] = await db.query('SELECT * FROM currencies ORDER BY code ASC');
  return rows;
}

async function remove(code) {
  await db.query('DELETE FROM currencies WHERE code = ?', [code]);
}

async function findByCode(code) {
  const [rows] = await db.query('SELECT * FROM currencies WHERE code = ?', [code]);
  return rows[0] || null;
}

async function upsert({ code, name, symbol, rate_vs_eur, is_active }) {
  await db.query(
    `INSERT INTO currencies (code, name, symbol, rate_vs_eur, is_active)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE name = VALUES(name), symbol = VALUES(symbol), rate_vs_eur = VALUES(rate_vs_eur), is_active = VALUES(is_active)`,
    [code, name, symbol, rate_vs_eur, is_active ?? 1]
  );
}

module.exports = { findAll, findAllAdmin, findByCode, upsert, remove };
