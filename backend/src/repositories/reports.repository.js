// Requêtes SQL pour les rapports admin
const db = require('../config/db');

/**
 * Chiffre d'affaires total et nombre de commandes payées,
 * groupés par jour sur les N derniers jours.
 */
async function revenueByDay(days = 30) {
  const [rows] = await db.query(
    `SELECT
       DATE(created_at) AS day,
       COUNT(*) AS order_count,
       SUM(total_eur) AS revenue_eur
     FROM orders
     WHERE status NOT IN ('cancelled','refunded')
       AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
     GROUP BY DATE(created_at)
     ORDER BY day ASC`,
    [days]
  );
  return rows;
}

/** Totaux globaux : CA, commandes, panier moyen, clients */
async function globalStats() {
  const [[orders]] = await db.query(
    `SELECT
       COUNT(*) AS total_orders,
       SUM(total_eur) AS total_revenue_eur,
       AVG(total_eur) AS avg_order_eur
     FROM orders
     WHERE status NOT IN ('cancelled','refunded')`
  );

  const [[customers]] = await db.query(
    `SELECT COUNT(*) AS total_customers FROM users WHERE role = 'customer' AND deleted_at IS NULL`
  );

  return { ...orders, ...customers };
}

/** Top N produits par quantité vendue */
async function topProducts(limit = 10) {
  const [rows] = await db.query(
    `SELECT
       oi.product_id,
       oi.product_name,
       SUM(oi.quantity) AS total_qty,
       SUM(oi.subtotal) AS total_revenue_eur
     FROM order_items oi
     JOIN orders o ON o.id = oi.order_id AND o.status NOT IN ('cancelled','refunded')
     GROUP BY oi.product_id, oi.product_name
     ORDER BY total_qty DESC
     LIMIT ?`,
    [limit]
  );
  return rows;
}

/** Répartition des commandes par statut */
async function ordersByStatus() {
  const [rows] = await db.query(
    `SELECT status, COUNT(*) AS count FROM orders GROUP BY status ORDER BY count DESC`
  );
  return rows;
}

/** CA par mois sur les 12 derniers mois */
async function revenueByMonth(months = 12) {
  const [rows] = await db.query(
    `SELECT
       DATE_FORMAT(created_at, '%Y-%m') AS month,
       COUNT(*) AS order_count,
       SUM(total_eur) AS revenue_eur
     FROM orders
     WHERE status NOT IN ('cancelled','refunded')
       AND created_at >= DATE_SUB(NOW(), INTERVAL ? MONTH)
     GROUP BY DATE_FORMAT(created_at, '%Y-%m')
     ORDER BY month ASC`,
    [months]
  );
  return rows;
}

module.exports = { revenueByDay, globalStats, topProducts, ordersByStatus, revenueByMonth };
