const db = require('../config/db');

async function findActive(code) {
  const [rows] = await db.query(
    `SELECT * FROM coupons
     WHERE code = ? AND is_active = 1
       AND (starts_at IS NULL OR starts_at <= NOW())
       AND (expires_at IS NULL OR expires_at >= NOW())
       AND (max_uses IS NULL OR used_count < max_uses)`,
    [code]
  );
  return rows[0] || null;
}

async function findAll() {
  const [rows] = await db.query('SELECT * FROM coupons ORDER BY created_at DESC');
  return rows;
}

async function findById(id) {
  const [rows] = await db.query('SELECT * FROM coupons WHERE id = ?', [id]);
  return rows[0] || null;
}

async function create(data) {
  const [result] = await db.query(
    'INSERT INTO coupons (code, type, value, min_order_amount, max_uses, starts_at, expires_at, is_active) VALUES (?,?,?,?,?,?,?,?)',
    [data.code, data.type, data.value, data.min_order_amount||null, data.max_uses||null, data.starts_at||null, data.expires_at||null, data.is_active??1]
  );
  return result.insertId;
}

async function update(id, fields) {
  const allowed = ['code','type','value','min_order_amount','max_uses','starts_at','expires_at','is_active'];
  const keys    = Object.keys(fields).filter(k => allowed.includes(k));
  if (!keys.length) return;
  const set    = keys.map(k => `${k} = ?`).join(', ');
  const values = keys.map(k => fields[k]);
  await db.query(`UPDATE coupons SET ${set} WHERE id = ?`, [...values, id]);
}

async function remove(id) {
  await db.query('DELETE FROM coupons WHERE id = ?', [id]);
}

module.exports = { findActive, findAll, findById, create, update, remove };
