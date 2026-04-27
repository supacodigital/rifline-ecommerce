// Contrôleur transporteurs — provider : Sendcloud
const sendcloudService = require('../services/sendcloud.service');
const ordersRepo       = require('../repositories/orders.repository');


// Tarifs fallback utilisés si Sendcloud n'est pas configuré ou inaccessible
const FALLBACK_RATES = [
  { rate_id: 'mondial_relay',  carrier: 'Mondial Relay', service: 'Point Relais',           price_eur: 3.49,  estimated_days: 4, is_relay: true },
  { rate_id: 'colissimo_home', carrier: 'Colissimo',     service: 'Livraison à domicile',   price_eur: 4.99,  estimated_days: 3 },
  { rate_id: 'chronopost',     carrier: 'Chronopost',    service: 'Express J+1',            price_eur: 9.90,  estimated_days: 1 },
  { rate_id: 'dpd_home',       carrier: 'DPD',           service: 'Livraison à domicile',   price_eur: 5.49,  estimated_days: 3 },
  { rate_id: 'ups_standard',   carrier: 'UPS',           service: 'Standard International', price_eur: 12.90, estimated_days: 5 },
  { rate_id: 'dhl_express',    carrier: 'DHL',           service: 'Express International',  price_eur: 19.90, estimated_days: 2 },
];

// Calcul des tarifs en temps réel (utilisé au checkout)
async function rates(req, res, next) {
  try {
    const { country_code, postal_code, city, weight_grams } = req.query;
    if (!country_code || !postal_code) {
      return res.status(400).json({ error: 'country_code et postal_code requis' });
    }
    const rates = await sendcloudService.getRates({
      country_code,
      postal_code,
      city,
      weight_grams: Number(weight_grams) || 0,
    });
    res.json({ rates });
  } catch (err) {
    // Si Sendcloud n'est pas configuré, renvoyer les tarifs fallback
    console.warn('Sendcloud indisponible, utilisation des tarifs fallback :', err.message);
    res.json({ rates: FALLBACK_RATES });
  }
}

// Création du label d'expédition (admin — fulfillment)
async function createLabel(req, res, next) {
  try {
    const { order_id, method_id, weight_grams } = req.body;
    if (!order_id) {
      return res.status(400).json({ error: 'order_id requis' });
    }

    const order = await ordersRepo.findById(Number(order_id));
    if (!order) return res.status(404).json({ error: 'Commande introuvable' });

    const result = await sendcloudService.createParcel({
      order,
      method_id: method_id || order.shipping_method_id || null,
      weight_grams: Number(weight_grams) || 500,
    });

    // Mettre à jour la commande avec les infos d'expédition
    await ordersRepo.updateStatus(order.id, 'shipped', {
      tracking_number: result.tracking_number,
      carrier:         result.carrier,
      label_url:       result.label_url || null,
      shipped_at:      new Date(),
    });

    res.json(result);
  } catch (err) { next(err); }
}

// Récupération des points relais Mondial Relay (utilisé au checkout)
async function servicePoints(req, res, next) {
  try {
    const { country_code, postal_code, city, radius } = req.query;
    if (!country_code || !postal_code) {
      return res.status(400).json({ error: 'country_code et postal_code requis' });
    }
    const points = await sendcloudService.getServicePoints({
      country_code,
      postal_code,
      city,
      radius: radius ? Number(radius) : 5000,
    });
    res.json({ service_points: points });
  } catch (err) {
    console.warn('Sendcloud service points indisponible :', err.message);
    res.json({ service_points: [] });
  }
}

module.exports = { rates, createLabel, servicePoints };
