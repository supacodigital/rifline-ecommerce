const service = require('../services/currencies.service');

async function list(req, res, next) {
  try { res.json(await service.listCurrencies()); } catch (err) { next(err); }
}

async function listAdmin(req, res, next) {
  try { res.json(await service.listCurrenciesAdmin()); } catch (err) { next(err); }
}

async function upsert(req, res, next) {
  try { res.json(await service.upsertCurrency(req.body)); } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    await service.deleteCurrency(req.params.code);
    res.json({ ok: true });
  } catch (err) { next(err); }
}

module.exports = { list, listAdmin, upsert, remove };
