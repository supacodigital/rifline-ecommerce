// Requêtes SQL — produits, images, tags
const db = require('../config/db');

async function findAll({ category_id, min_price, max_price, tag, search, limit = 20, offset = 0 }) {
  let where = ['p.is_active = 1', 'p.deleted_at IS NULL'];
  const params = [];

  if (category_id) { where.push('p.category_id = ?'); params.push(category_id); }
  if (min_price)   { where.push('p.price >= ?'); params.push(min_price); }
  if (max_price)   { where.push('p.price <= ?'); params.push(max_price); }
  if (search)      { where.push('(p.name_fr LIKE ? OR p.name_en LIKE ?)'); params.push(`%${search}%`, `%${search}%`); }
  if (tag) {
    where.push('EXISTS (SELECT 1 FROM product_tags pt WHERE pt.product_id = p.id AND pt.tag = ?)');
    params.push(tag);
  }

  const whereStr = where.join(' AND ');

  // GROUP_CONCAT évite N+1 requêtes pour les tags — une seule requête pour tous les produits
  const [rows] = await db.query(
    `SELECT p.*, c.name_fr AS category_name_fr, c.name_en AS category_name_en,
            (SELECT url FROM product_images WHERE product_id = p.id AND is_cover = 1 LIMIT 1) AS cover_url,
            GROUP_CONCAT(pt.tag ORDER BY pt.tag SEPARATOR ',') AS tags_csv
     FROM products p
     LEFT JOIN categories c ON c.id = p.category_id
     LEFT JOIN product_tags pt ON pt.product_id = p.id
     WHERE ${whereStr}
     GROUP BY p.id
     ORDER BY p.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, Number(limit), Number(offset)]
  );

  // Convertir tags_csv en tableau
  rows.forEach(r => {
    r.tags = r.tags_csv ? r.tags_csv.split(',') : [];
    delete r.tags_csv;
  });

  const [[{ total }]] = await db.query(
    `SELECT COUNT(*) AS total FROM products p WHERE ${whereStr}`,
    params
  );

  return { rows, total };
}

async function findBySlug(slug) {
  const [rows] = await db.query(
    `SELECT p.*, c.name_fr AS category_name_fr, c.name_en AS category_name_en
     FROM products p
     LEFT JOIN categories c ON c.id = p.category_id
     WHERE p.slug = ? AND p.is_active = 1 AND p.deleted_at IS NULL`,
    [slug]
  );
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await db.query(
    'SELECT * FROM products WHERE id = ? AND deleted_at IS NULL',
    [id]
  );
  return rows[0] || null;
}

async function create({ category_id, name_fr, name_en, slug, description_fr, description_en, price, stock, sku, weight_grams }) {
  const [result] = await db.query(
    `INSERT INTO products (category_id, name_fr, name_en, slug, description_fr, description_en, price, stock, sku, weight_grams)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [category_id, name_fr, name_en, slug, description_fr, description_en, price, stock, sku, weight_grams]
  );
  return result.insertId;
}

async function update(id, fields) {
  const allowed = ['category_id','name_fr','name_en','slug','description_fr','description_en','price','stock','sku','weight_grams','is_active'];
  const keys    = Object.keys(fields).filter(k => allowed.includes(k));
  if (!keys.length) return;

  const set    = keys.map(k => `${k} = ?`).join(', ');
  const values = keys.map(k => fields[k]);
  await db.query(`UPDATE products SET ${set} WHERE id = ?`, [...values, id]);
}

async function softDelete(id) {
  await db.query('UPDATE products SET deleted_at = NOW() WHERE id = ?', [id]);
}

// --- Images ---
async function getImages(product_id) {
  const [rows] = await db.query(
    'SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order ASC',
    [product_id]
  );
  return rows;
}

async function addImage({ product_id, url, alt_text, sort_order, is_cover }) {
  const [result] = await db.query(
    'INSERT INTO product_images (product_id, url, alt_text, sort_order, is_cover) VALUES (?, ?, ?, ?, ?)',
    [product_id, url, alt_text || null, sort_order || 0, is_cover ? 1 : 0]
  );
  return result.insertId;
}

async function deleteImage(id) {
  await db.query('DELETE FROM product_images WHERE id = ?', [id]);
}

async function setCover(product_id, image_id) {
  // Retire is_cover de toutes les images du produit, puis le met sur l'image choisie
  await db.query('UPDATE product_images SET is_cover = 0 WHERE product_id = ?', [product_id]);
  await db.query('UPDATE product_images SET is_cover = 1 WHERE id = ? AND product_id = ?', [image_id, product_id]);
}

async function countImages(product_id) {
  const [[{ n }]] = await db.query('SELECT COUNT(*) AS n FROM product_images WHERE product_id = ?', [product_id]);
  return n;
}

// --- Tags ---
async function getTags(product_id) {
  const [rows] = await db.query('SELECT tag FROM product_tags WHERE product_id = ?', [product_id]);
  return rows.map(r => r.tag);
}

async function setTags(product_id, tags) {
  await db.query('DELETE FROM product_tags WHERE product_id = ?', [product_id]);
  if (!tags.length) return;
  const values = tags.map(tag => [product_id, tag]);
  await db.query('INSERT INTO product_tags (product_id, tag) VALUES ?', [values]);
}

// --- Variantes ---
async function getVariants(product_id) {
  const [rows] = await db.query(
    'SELECT * FROM product_variants WHERE product_id = ? ORDER BY sort_order ASC, id ASC',
    [product_id]
  );
  return rows;
}

async function createVariant({ product_id, name, sku, price, stock, sort_order }) {
  const [result] = await db.query(
    'INSERT INTO product_variants (product_id, name, sku, price, stock, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
    [product_id, name, sku || null, price ?? null, stock ?? 0, sort_order ?? 0]
  );
  return result.insertId;
}

async function updateVariant(id, fields) {
  const allowed = ['name', 'sku', 'price', 'stock', 'sort_order', 'is_active', 'image_url'];
  const keys    = Object.keys(fields).filter(k => allowed.includes(k));
  if (!keys.length) return;
  const set    = keys.map(k => `${k} = ?`).join(', ');
  const values = keys.map(k => fields[k]);
  await db.query(`UPDATE product_variants SET ${set} WHERE id = ?`, [...values, id]);
}

async function deleteVariant(id) {
  await db.query('DELETE FROM product_variants WHERE id = ?', [id]);
}

async function findVariantById(id) {
  const [rows] = await db.query('SELECT * FROM product_variants WHERE id = ?', [id]);
  return rows[0] || null;
}

module.exports = {
  findAll, findBySlug, findById, create, update, softDelete,
  getImages, addImage, deleteImage, countImages, setCover,
  getTags, setTags,
  getVariants, createVariant, updateVariant, deleteVariant, findVariantById,
};
