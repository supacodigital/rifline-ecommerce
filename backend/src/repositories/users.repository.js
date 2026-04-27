const db = require('../config/db');

async function findById(id) {
  const [rows] = await db.query(
    'SELECT id, email, first_name, last_name, phone, role, is_verified, created_at FROM users WHERE id = ? AND deleted_at IS NULL',
    [id]
  );
  return rows[0] || null;
}

async function update(id, fields) {
  const allowed = ['first_name','last_name','phone'];
  const keys    = Object.keys(fields).filter(k => allowed.includes(k));
  if (!keys.length) return;
  const set    = keys.map(k => `${k} = ?`).join(', ');
  const values = keys.map(k => fields[k]);
  await db.query(`UPDATE users SET ${set} WHERE id = ?`, [...values, id]);
}

async function findPasswordHash(id) {
  const [rows] = await db.query('SELECT password_hash FROM users WHERE id = ? AND deleted_at IS NULL', [id]);
  return rows[0] || null;
}

async function updatePassword(id, password_hash) {
  await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [password_hash, id]);
}

async function softDelete(id) {
  await db.query('UPDATE users SET deleted_at = NOW() WHERE id = ?', [id]);
}

// --- Adresses ---
async function getAddresses(user_id) {
  const [rows] = await db.query('SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at ASC', [user_id]);
  return rows;
}

async function findAddress(id, user_id) {
  const [rows] = await db.query('SELECT * FROM addresses WHERE id = ? AND user_id = ?', [id, user_id]);
  return rows[0] || null;
}

async function createAddress(data) {
  const [result] = await db.query(
    `INSERT INTO addresses (user_id, label, first_name, last_name, address_line1, address_line2, city, postal_code, state, country_code, phone, is_default)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [data.user_id, data.label||null, data.first_name, data.last_name, data.address_line1, data.address_line2||null,
     data.city, data.postal_code, data.state||null, data.country_code, data.phone||null, data.is_default?1:0]
  );
  return result.insertId;
}

async function updateAddress(id, fields) {
  const allowed = ['label','first_name','last_name','address_line1','address_line2','city','postal_code','state','country_code','phone','is_default'];
  const keys    = Object.keys(fields).filter(k => allowed.includes(k));
  if (!keys.length) return;
  const set    = keys.map(k => `${k} = ?`).join(', ');
  const values = keys.map(k => fields[k]);
  await db.query(`UPDATE addresses SET ${set} WHERE id = ?`, [...values, id]);
}

async function deleteAddress(id) {
  await db.query('DELETE FROM addresses WHERE id = ?', [id]);
}

async function clearDefault(user_id) {
  await db.query('UPDATE addresses SET is_default = 0 WHERE user_id = ?', [user_id]);
}

// Admin
async function findAllUsers({ limit = 20, offset = 0, search } = {}) {
  let where = ['deleted_at IS NULL'];
  const params = [];
  if (search) { where.push('(email LIKE ? OR first_name LIKE ? OR last_name LIKE ?)'); params.push(`%${search}%`,`%${search}%`,`%${search}%`); }
  const whereStr = `WHERE ${where.join(' AND ')}`;
  const [rows] = await db.query(`SELECT id,email,first_name,last_name,phone,role,is_verified,created_at FROM users ${whereStr} ORDER BY created_at DESC LIMIT ? OFFSET ?`, [...params, Number(limit), Number(offset)]);
  const [[{ total }]] = await db.query(`SELECT COUNT(*) AS total FROM users ${whereStr}`, params);
  return { rows, total };
}

module.exports = { findById, findPasswordHash, update, updatePassword, softDelete, getAddresses, findAddress, createAddress, updateAddress, deleteAddress, clearDefault, findAllUsers };
