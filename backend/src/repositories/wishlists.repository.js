const db = require('../config/db');

async function findByUser(user_id) {
  const [rows] = await db.query(
    `SELECT w.id, w.product_id, w.created_at,
            p.name_fr, p.name_en, p.price, p.slug,
            (SELECT url FROM product_images WHERE product_id = p.id AND is_cover = 1 LIMIT 1) AS cover_url
     FROM wishlists w
     JOIN products p ON p.id = w.product_id AND p.deleted_at IS NULL
     WHERE w.user_id = ?
     ORDER BY w.created_at DESC`,
    [user_id]
  );
  return rows;
}

async function add(user_id, product_id) {
  // La contrainte uq_wishlist évite les doublons
  await db.query('INSERT IGNORE INTO wishlists (user_id, product_id) VALUES (?, ?)', [user_id, product_id]);
}

async function remove(user_id, product_id) {
  await db.query('DELETE FROM wishlists WHERE user_id = ? AND product_id = ?', [user_id, product_id]);
}

module.exports = { findByUser, add, remove };
