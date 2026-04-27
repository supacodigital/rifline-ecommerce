const service = require('../services/reports.service');

async function dashboard(req, res, next) {
  try { res.json(await service.getDashboard()); } catch (err) { next(err); }
}

async function revenueByDay(req, res, next) {
  try {
    const days = Math.min(Number(req.query.days) || 30, 365);
    res.json(await service.getRevenueByDay(days));
  } catch (err) { next(err); }
}

module.exports = { dashboard, revenueByDay };
