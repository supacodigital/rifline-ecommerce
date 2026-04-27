const repo = require('../repositories/coupons.repository');

async function validateCoupon(code, subtotal) {
  const coupon = await repo.findActive(code);
  if (!coupon) { const e = new Error('Code promo invalide ou expiré'); e.status = 400; throw e; }
  if (coupon.min_order_amount && subtotal < coupon.min_order_amount) {
    const e = new Error(`Montant minimum ${coupon.min_order_amount} € requis`); e.status = 400; throw e;
  }
  const discount = coupon.type === 'percent'
    ? parseFloat((subtotal * coupon.value / 100).toFixed(2))
    : Math.min(coupon.value, subtotal);
  return { coupon, discount };
}

async function listCoupons() { return repo.findAll(); }

async function createCoupon(data) {
  const id = await repo.create(data);
  return repo.findById(id);
}

async function updateCoupon(id, data) {
  const coupon = await repo.findById(id);
  if (!coupon) { const e = new Error('Coupon introuvable'); e.status = 404; throw e; }
  await repo.update(id, data);
}

async function deleteCoupon(id) {
  const coupon = await repo.findById(id);
  if (!coupon) { const e = new Error('Coupon introuvable'); e.status = 404; throw e; }
  await repo.remove(id);
}

module.exports = { validateCoupon, listCoupons, createCoupon, updateCoupon, deleteCoupon };
