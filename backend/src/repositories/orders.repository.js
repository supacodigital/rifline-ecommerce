const db = require('../config/db');

async function createOrder(order, items, conn) {
  // Utilise une connexion transactionnelle passée en paramètre
  const [result] = await conn.query(
    `INSERT INTO orders
     (order_number, user_id,
      shipping_first_name, shipping_last_name, shipping_address1, shipping_address2,
      shipping_city, shipping_postal, shipping_state, shipping_country, shipping_phone,
      subtotal_eur, discount_eur, shipping_cost_eur, total_eur,
      currency_code, currency_rate, coupon_code,
      shipping_method_id, service_point_id, service_point_name, service_point_address,
      status)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      order.order_number, order.user_id,
      order.shipping_first_name, order.shipping_last_name,
      order.shipping_address1, order.shipping_address2 || null,
      order.shipping_city, order.shipping_postal, order.shipping_state || null,
      order.shipping_country, order.shipping_phone || null,
      order.subtotal_eur, order.discount_eur || 0, order.shipping_cost_eur || 0, order.total_eur,
      order.currency_code || 'EUR', order.currency_rate || 1,
      order.coupon_code || null,
      order.shipping_method_id || null, order.service_point_id || null,
      order.service_point_name || null, order.service_point_address || null,
      'pending',
    ]
  );
  const order_id = result.insertId;

  // Insérer les lignes de commande
  if (items.length) {
    const rows = items.map(i => [order_id, i.product_id, i.product_name, i.product_sku || null, i.unit_price, i.quantity, i.subtotal]);
    await conn.query(
      'INSERT INTO order_items (order_id, product_id, product_name, product_sku, unit_price, quantity, subtotal) VALUES ?',
      [rows]
    );
  }

  return order_id;
}

async function findByUser(user_id) {
  const [rows] = await db.query(
    'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
    [user_id]
  );
  return rows;
}

async function findById(id) {
  const [rows] = await db.query(
    `SELECT o.*, u.email, u.first_name, u.last_name
     FROM orders o JOIN users u ON u.id = o.user_id
     WHERE o.id = ?`,
    [id]
  );
  return rows[0] || null;
}

async function findByNumber(order_number) {
  const [rows] = await db.query('SELECT * FROM orders WHERE order_number = ?', [order_number]);
  return rows[0] || null;
}

async function getItems(order_id) {
  const [rows] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [order_id]);
  return rows;
}

async function findByPaymentIntent(stripe_payment_intent_id) {
  const [rows] = await db.query('SELECT * FROM orders WHERE stripe_payment_intent_id = ?', [stripe_payment_intent_id]);
  return rows[0] || null;
}

async function findByCheckoutId(sumup_checkout_id) {
  const [rows] = await db.query('SELECT * FROM orders WHERE sumup_checkout_id = ?', [sumup_checkout_id]);
  return rows[0] || null;
}

async function updateStatus(id, status, extra = {}) {
  const allowed = ['status','stripe_payment_intent_id','sumup_checkout_id','shipengine_shipment_id','tracking_number','carrier','label_url','shipped_at','delivered_at','notes','shipping_method_id','service_point_id','service_point_name','service_point_address'];
  const fields  = { status, ...extra };
  const keys    = Object.keys(fields).filter(k => allowed.includes(k));
  const set     = keys.map(k => `${k} = ?`).join(', ');
  const values  = keys.map(k => fields[k]);
  await db.query(`UPDATE orders SET ${set} WHERE id = ?`, [...values, id]);
}

async function findAll({ status, limit = 20, offset = 0 }) {
  let where = [];
  const params = [];
  if (status === '!pending') {
    // Exclure les commandes en attente de paiement
    where.push('status != ?'); params.push('pending');
  } else if (status) {
    where.push('status = ?'); params.push(status);
  }
  const whereStr = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const [rows] = await db.query(
    `SELECT o.*, u.email, u.first_name, u.last_name FROM orders o
     JOIN users u ON u.id = o.user_id
     ${whereStr} ORDER BY o.created_at DESC LIMIT ? OFFSET ?`,
    [...params, Number(limit), Number(offset)]
  );
  const [[{ total }]] = await db.query(`SELECT COUNT(*) AS total FROM orders ${whereStr}`, params);
  return { rows, total };
}

module.exports = { createOrder, findByUser, findById, findByNumber, findByPaymentIntent, findByCheckoutId, getItems, updateStatus, findAll };
