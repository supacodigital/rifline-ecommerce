// Job de nettoyage des commandes pending abandonnées
// Annule les commandes restées en pending plus de 30 minutes et restaure le stock
const db = require('../config/db');

const PENDING_TTL_MINUTES = 30;

async function cleanupPendingOrders() {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Récupérer les commandes pending expirées avec leurs articles
    const [orders] = await conn.query(
      `SELECT o.id FROM orders o
       WHERE o.status = 'pending'
         AND o.created_at < NOW() - INTERVAL ? MINUTE`,
      [PENDING_TTL_MINUTES]
    );

    if (orders.length === 0) {
      await conn.commit();
      return;
    }

    const orderIds = orders.map(o => o.id);

    // Restaurer le stock des produits sans variante
    await conn.query(
      `UPDATE products p
       JOIN order_items oi ON oi.product_id = p.id
       SET p.stock = p.stock + oi.quantity
       WHERE oi.order_id IN (?) AND oi.variant_id IS NULL`,
      [orderIds]
    );

    // Restaurer le stock des variantes
    await conn.query(
      `UPDATE product_variants pv
       JOIN order_items oi ON oi.variant_id = pv.id
       SET pv.stock = pv.stock + oi.quantity
       WHERE oi.order_id IN (?) AND oi.variant_id IS NOT NULL`,
      [orderIds]
    );

    // Décrémenter used_count des coupons utilisés dans ces commandes
    await conn.query(
      `UPDATE coupons c
       JOIN orders o ON o.coupon_code = c.code
       SET c.used_count = GREATEST(c.used_count - 1, 0)
       WHERE o.id IN (?) AND o.coupon_code IS NOT NULL`,
      [orderIds]
    );

    // Marquer les commandes comme annulées
    await conn.query(
      `UPDATE orders SET status = 'cancelled', updated_at = NOW()
       WHERE id IN (?)`,
      [orderIds]
    );

    await conn.commit();
    console.log(`Nettoyage commandes pending : ${orders.length} commande(s) annulée(s), stock restauré`);
  } catch (err) {
    await conn.rollback();
    console.error('Erreur nettoyage commandes pending :', err.message);
  } finally {
    conn.release();
  }
}

module.exports = cleanupPendingOrders;
