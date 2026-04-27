const repo = require('../repositories/reviews.repository');
const db   = require('../config/db');

async function getProductReviews(product_id) {
  return repo.findByProduct(product_id);
}

async function postReview(user_id, data) {
  const { product_id } = data;

  // Vérifier que l'utilisateur a acheté ce produit (commande paid)
  const [[row]] = await db.query(
    `SELECT oi.id FROM order_items oi
     JOIN orders o ON o.id = oi.order_id
     WHERE o.user_id = ? AND oi.product_id = ? AND o.status = 'paid'
     LIMIT 1`,
    [user_id, product_id]
  );
  if (!row) {
    const e = new Error('Vous devez avoir acheté ce produit pour laisser un avis');
    e.status = 403;
    throw e;
  }

  // Un avis par user/produit (contrainte DB uq_review)
  const id = await repo.create({ ...data, user_id });
  return repo.findById(id);
}

async function approveReview(id) {
  const review = await repo.findById(id);
  if (!review) { const e = new Error('Avis introuvable'); e.status = 404; throw e; }
  await repo.approve(id);
}

async function deleteReview(id) {
  const review = await repo.findById(id);
  if (!review) { const e = new Error('Avis introuvable'); e.status = 404; throw e; }
  await repo.remove(id);
}

async function getPendingReviews() {
  return repo.findAllPending();
}

module.exports = { getProductReviews, postReview, approveReview, deleteReview, getPendingReviews };
