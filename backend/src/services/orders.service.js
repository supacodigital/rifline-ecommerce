// Logique métier — commandes
const crypto = require('crypto');
const db     = require('../config/db');
const repo   = require('../repositories/orders.repository');

function generateOrderNumber() {
  return `ORD-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
}

async function createOrder({ user_id, shipping, items, coupon_code, currency_code, currency_rate, shipping_cost_eur, shipping_method_id, service_point_id, service_point_name, service_point_address }) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Vérification stock + calcul subtotal à l'intérieur de la transaction
    // SELECT FOR UPDATE verrouille les lignes produit pour éviter la survente en cas de commandes concurrentes
    let subtotal_eur = 0;
    const enrichedItems = [];

    for (const item of items) {
      const [[product]] = await conn.query(
        'SELECT id, name_fr, sku, price, stock, is_active FROM products WHERE id = ? AND deleted_at IS NULL FOR UPDATE',
        [item.product_id]
      );
      if (!product || !product.is_active) {
        const e = new Error(`Produit ${item.product_id} indisponible`); e.status = 400; throw e;
      }
      if (product.stock < item.quantity) {
        const e = new Error(`Stock insuffisant pour "${product.name_fr}"`); e.status = 400; throw e;
      }
      const sub = parseFloat((product.price * item.quantity).toFixed(2));
      subtotal_eur += sub;
      enrichedItems.push({ product_id: product.id, product_name: product.name_fr, product_sku: product.sku, unit_price: product.price, quantity: item.quantity, subtotal: sub });
    }

    // Validation coupon à l'intérieur de la transaction avec FOR UPDATE
    // Évite qu'un coupon à usage limité soit utilisé deux fois en simultané
    let discount_eur = 0;
    let validatedCoupon = null;
    if (coupon_code) {
      const [[coupon]] = await conn.query(
        `SELECT * FROM coupons
         WHERE code = ? AND is_active = 1
           AND (starts_at IS NULL OR starts_at <= NOW())
           AND (expires_at IS NULL OR expires_at >= NOW())
           AND (max_uses IS NULL OR used_count < max_uses)
         FOR UPDATE`,
        [coupon_code]
      );
      if (!coupon) { const e = new Error('Code promo invalide ou expiré'); e.status = 400; throw e; }
      if (coupon.min_order_amount && subtotal_eur < coupon.min_order_amount) {
        const e = new Error(`Montant minimum ${coupon.min_order_amount} € requis`); e.status = 400; throw e;
      }
      discount_eur = coupon.type === 'percent'
        ? parseFloat((subtotal_eur * coupon.value / 100).toFixed(2))
        : Math.min(coupon.value, subtotal_eur);
      validatedCoupon = coupon;
    }

    const total_eur = parseFloat((subtotal_eur - discount_eur + (shipping_cost_eur || 0)).toFixed(2));

    // Décrémenter le stock
    for (const item of enrichedItems) {
      await conn.query('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.product_id]);
    }

    // Incrémenter le compteur du coupon
    if (validatedCoupon) {
      await conn.query('UPDATE coupons SET used_count = used_count + 1 WHERE id = ?', [validatedCoupon.id]);
    }

    const order_id = await repo.createOrder({
      order_number: generateOrderNumber(),
      user_id,
      ...shipping,
      subtotal_eur, discount_eur, shipping_cost_eur: shipping_cost_eur || 0, total_eur,
      currency_code: currency_code || 'EUR',
      currency_rate: currency_rate || 1,
      coupon_code:          coupon_code || null,
      shipping_method_id:   shipping_method_id || null,
      service_point_id:     service_point_id || null,
      service_point_name:   service_point_name || null,
      service_point_address: service_point_address || null,
    }, enrichedItems, conn);

    await conn.commit();
    return repo.findById(order_id);
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

async function getOrder(id, user_id, role) {
  const order = await repo.findById(id);
  if (!order) { const e = new Error('Commande introuvable'); e.status = 404; throw e; }
  if (role !== 'admin' && order.user_id !== user_id) { const e = new Error('Accès refusé'); e.status = 403; throw e; }
  order.items = await repo.getItems(id);
  return order;
}

async function listUserOrders(user_id) {
  return repo.findByUser(user_id);
}

async function listAllOrders(filters) {
  return repo.findAll(filters);
}

async function updateOrderStatus(id, status, extra) {
  const order = await repo.findById(id);
  if (!order) { const e = new Error('Commande introuvable'); e.status = 404; throw e; }
  await repo.updateStatus(id, status, extra);
}

module.exports = { createOrder, getOrder, listUserOrders, listAllOrders, updateOrderStatus };
