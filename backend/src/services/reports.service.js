const repo = require('../repositories/reports.repository');

async function getDashboard() {
  const [stats, ordersByStatus, topProducts, revenueByMonth] = await Promise.all([
    repo.globalStats(),
    repo.ordersByStatus(),
    repo.topProducts(10),
    repo.revenueByMonth(12),
  ]);
  return { stats, ordersByStatus, topProducts, revenueByMonth };
}

async function getRevenueByDay(days) {
  return repo.revenueByDay(days);
}

module.exports = { getDashboard, getRevenueByDay };
