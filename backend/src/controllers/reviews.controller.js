const service = require('../services/reviews.service');

async function list(req, res, next) {
  try { res.json(await service.getProductReviews(Number(req.params.productId))); } catch (err) { next(err); }
}

async function create(req, res, next) {
  try { res.status(201).json(await service.postReview(req.user.id, req.body)); } catch (err) { next(err); }
}

// Admin
async function pending(req, res, next) {
  try { res.json(await service.getPendingReviews()); } catch (err) { next(err); }
}

async function approve(req, res, next) {
  try { await service.approveReview(Number(req.params.id)); res.json({ ok: true }); } catch (err) { next(err); }
}

async function destroy(req, res, next) {
  try { await service.deleteReview(Number(req.params.id)); res.json({ ok: true }); } catch (err) { next(err); }
}

module.exports = { list, create, pending, approve, destroy };
