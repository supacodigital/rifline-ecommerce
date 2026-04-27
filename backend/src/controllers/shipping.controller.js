const service = require('../services/shipping.service');

// Tarifs disponibles pour un pays + poids donnés (utilisé au checkout)
async function rates(req, res, next) {
  try {
    const { country_code, weight_grams } = req.query;
    const result = await service.getRatesForCountry(country_code, Number(weight_grams) || 0);
    res.json(result);
  } catch (err) { next(err); }
}

// Admin — zones
async function listZones(req, res, next) {
  try { res.json(await service.listZones()); } catch (err) { next(err); }
}

async function createZone(req, res, next) {
  try { res.status(201).json(await service.createZone(req.body)); } catch (err) { next(err); }
}

async function updateZone(req, res, next) {
  try { await service.updateZone(Number(req.params.id), req.body); res.json({ ok: true }); } catch (err) { next(err); }
}

async function deleteZone(req, res, next) {
  try { await service.deleteZone(Number(req.params.id)); res.json({ ok: true }); } catch (err) { next(err); }
}

// Admin — rates
async function createRate(req, res, next) {
  try { res.status(201).json(await service.addRate(req.body)); } catch (err) { next(err); }
}

async function deleteRate(req, res, next) {
  try { await service.deleteRate(Number(req.params.rateId)); res.json({ ok: true }); } catch (err) { next(err); }
}

module.exports = { rates, listZones, createZone, updateZone, deleteZone, createRate, deleteRate };
