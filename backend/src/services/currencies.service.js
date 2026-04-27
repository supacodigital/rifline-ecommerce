const repo = require('../repositories/currencies.repository');

async function listCurrencies() { return repo.findAll(); }

async function listCurrenciesAdmin() { return repo.findAllAdmin(); }

async function upsertCurrency(data) {
  await repo.upsert(data);
  return repo.findByCode(data.code);
}

async function deleteCurrency(code) {
  // Empêcher la suppression de l'EUR (devise de référence)
  if (code === 'EUR') throw new Error('Cannot delete base currency EUR');
  await repo.remove(code);
}

module.exports = { listCurrencies, listCurrenciesAdmin, upsertCurrency, deleteCurrency };
