const service = require('../services/coupons.service');

// Validation publique (vérifier un code avant le checkout)
async function validate(req, res, next) {
  try {
    const { code, subtotal } = req.body;
    const result = await service.validateCoupon(code, Number(subtotal));
    res.json(result);
  } catch (err) { next(err); }
}

// Admin
async function list(req, res, next) {
  try { res.json(await service.listCoupons()); } catch (err) { next(err); }
}

async function create(req, res, next) {
  try { res.status(201).json(await service.createCoupon(req.body)); } catch (err) { next(err); }
}

async function update(req, res, next) {
  try { await service.updateCoupon(Number(req.params.id), req.body); res.json({ ok: true }); } catch (err) { next(err); }
}

async function destroy(req, res, next) {
  try { await service.deleteCoupon(Number(req.params.id)); res.json({ ok: true }); } catch (err) { next(err); }
}

module.exports = { validate, list, create, update, destroy };
