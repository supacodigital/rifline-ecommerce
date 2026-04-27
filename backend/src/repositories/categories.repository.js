const db = require('../config/db');

async function findAll() {
  const [rows] = await db.query(
    'SELECT * FROM categories WHERE deleted_at IS NULL ORDER BY sort_order ASC'
  );
  return rows;
}

async function findById(id) {
  const [rows] = await db.query('SELECT * FROM categories WHERE id = ? AND deleted_at IS NULL', [id]);
  return rows[0] || null;
}

async function findBySlug(slug) {
  const [rows] = await db.query('SELECT * FROM categories WHERE slug = ? AND deleted_at IS NULL', [slug]);
  return rows[0] || null;
}

async function create({ name_fr, name_en, slug, description_fr, description_en, image_url, sort_order }) {
  const [result] = await db.query(
    'INSERT INTO categories (name_fr, name_en, slug, description_fr, description_en, image_url, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name_fr, name_en, slug, description_fr, description_en, image_url || null, sort_order || 0]
  );
  return result.insertId;
}

async function update(id, fields) {
  const allowed = ['name_fr','name_en','slug','description_fr','description_en','image_url','sort_order','is_active'];
  const keys    = Object.keys(fields).filter(k => allowed.includes(k));
  if (!keys.length) return;
  const set    = keys.map(k => `${k} = ?`).join(', ');
  const values = keys.map(k => fields[k]);
  await db.query(`UPDATE categories SET ${set} WHERE id = ?`, [...values, id]);
}

async function softDelete(id) {
  await db.query('UPDATE categories SET deleted_at = NOW() WHERE id = ?', [id]);
}

module.exports = { findAll, findById, findBySlug, create, update, softDelete };
