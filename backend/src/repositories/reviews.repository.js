const db = require('../config/db');

async function findByProduct(product_id) {
  const [rows] = await db.query(
    `SELECT r.*, u.first_name, u.last_name FROM reviews r
     JOIN users u ON u.id = r.user_id
     WHERE r.product_id = ? AND r.is_approved = 1
     ORDER BY r.created_at DESC`,
    [product_id]
  );
  return rows;
}

async function findById(id) {
  const [rows] = await db.query('SELECT * FROM reviews WHERE id = ?', [id]);
  return rows[0] || null;
}

async function create({ product_id, user_id, order_id, rating, title, body }) {
  const [result] = await db.query(
    'INSERT INTO reviews (product_id, user_id, order_id, rating, title, body) VALUES (?,?,?,?,?,?)',
    [product_id, user_id, order_id||null, rating, title||null, body||null]
  );
  return result.insertId;
}

async function approve(id) {
  await db.query('UPDATE reviews SET is_approved = 1 WHERE id = ?', [id]);
}

async function remove(id) {
  await db.query('DELETE FROM reviews WHERE id = ?', [id]);
}

async function findAllPending() {
  const [rows] = await db.query(
    `SELECT r.*, u.first_name, u.last_name, p.name_fr AS product_name FROM reviews r
     JOIN users u ON u.id = r.user_id
     JOIN products p ON p.id = r.product_id
     WHERE r.is_approved = 0 ORDER BY r.created_at ASC`
  );
  return rows;
}

module.exports = { findByProduct, findById, create, approve, remove, findAllPending };
