const service = require('../services/wishlists.service');

async function list(req, res, next) {
  try { res.json(await service.getWishlist(req.user.id)); } catch (err) { next(err); }
}

async function add(req, res, next) {
  try { await service.addToWishlist(req.user.id, Number(req.params.productId)); res.json({ ok: true }); } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try { await service.removeFromWishlist(req.user.id, Number(req.params.productId)); res.json({ ok: true }); } catch (err) { next(err); }
}

module.exports = { list, add, remove };
