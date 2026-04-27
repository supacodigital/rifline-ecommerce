// Logique métier — zones de livraison et tarifs
const repo = require('../repositories/shipping.repository');

async function getRatesForCountry(country_code, weight_grams = 0) {
  const zone = await repo.findZoneByCountry(country_code);
  if (!zone) return { zone: null, rates: [] };

  const allRates = await repo.findRatesByZone(zone.id);
  // Filtrer par poids
  const rates = allRates.filter(r => {
    const min = r.min_weight_g || 0;
    const max = r.max_weight_g || Infinity;
    return weight_grams >= min && weight_grams <= max;
  });

  return { zone, rates };
}

async function listZones() { return repo.findAllZones(); }

async function createZone(data) {
  const id = await repo.createZone(data);
  return repo.findZoneById(id);
}

async function updateZone(id, data) {
  const zone = await repo.findZoneById(id);
  if (!zone) { const e = new Error('Zone introuvable'); e.status = 404; throw e; }
  await repo.updateZone(id, data);
}

async function deleteZone(id) {
  await repo.deleteZone(id);
}

async function addRate(data) {
  const id = await repo.createRate(data);
  const [rows] = await require('../config/db').query('SELECT * FROM shipping_rates WHERE id = ?', [id]);
  return rows[0];
}

async function deleteRate(id) {
  await repo.deleteRate(id);
}

module.exports = { getRatesForCountry, listZones, createZone, updateZone, deleteZone, addRate, deleteRate };
