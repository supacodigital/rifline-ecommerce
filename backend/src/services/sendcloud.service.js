// Intégration Sendcloud — calcul de tarifs et création de colis/labels
// API v2 : https://panel.sendcloud.sc/api/v2/
// Auth : Basic Auth (public_key:secret_key en base64)

const https = require('https');

const BASE_HOST = 'panel.sendcloud.sc';

/**
 * Effectue une requête HTTP vers l'API Sendcloud.
 * Sendcloud utilise Basic Auth : public_key:secret_key encodés en base64.
 */
function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const credentials = Buffer.from(
      `${process.env.SENDCLOUD_PUBLIC_KEY}:${process.env.SENDCLOUD_SECRET_KEY}`
    ).toString('base64');

    const options = {
      hostname: BASE_HOST,
      path,
      method,
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
        ...(data && { 'Content-Length': Buffer.byteLength(data) }),
      },
    };

    const req = https.request(options, (res) => {
      let raw = '';
      res.on('data', chunk => { raw += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(raw);
          if (res.statusCode >= 400) {
            const e = new Error(parsed.error?.message || parsed.message || 'Erreur Sendcloud');
            e.status = res.statusCode;
            e.raw = parsed;
            return reject(e);
          }
          resolve(parsed);
        } catch {
          reject(new Error('Réponse Sendcloud non parseable'));
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

/**
 * Récupère tous les modes d'expédition disponibles sous ce compte Sendcloud.
 * Filtrés par pays d'expéditeur (FR) et de destinataire.
 *
 * @param {object} params
 * @param {string} params.country_code  — pays destination (ex: "FR", "DE", "US")
 * @param {string} params.postal_code   — code postal destination
 * @param {number} params.weight_grams  — poids total en grammes
 */
async function getRates({ country_code, postal_code, weight_grams }) {
  if (!process.env.SENDCLOUD_PUBLIC_KEY || !process.env.SENDCLOUD_SECRET_KEY) {
    const e = new Error('Sendcloud non configuré (SENDCLOUD_PUBLIC_KEY / SENDCLOUD_SECRET_KEY manquants)');
    e.status = 500;
    throw e;
  }

  const weightKg = (weight_grams || 300) / 1000;

  // Récupère tous les méthodes d'expédition du compte
  const response = await request('GET', '/api/v2/shipping_methods?sender_address=0');

  const methods = response.shipping_methods || [];

  // Filtrer les méthodes compatibles avec le pays de destination et le poids
  const filtered = methods.filter(m => {
    // Vérifier que la méthode livre dans le pays destination
    const countries = m.countries || [];
    const countryMatch = countries.some(c =>
      c.iso_2 === country_code.toUpperCase() || c.iso_2 === 'XX' // XX = tous pays
    );
    if (!countryMatch) return false;

    // Vérifier les limites de poids
    const minWeight = parseFloat(m.min_weight) || 0;
    const maxWeight = parseFloat(m.max_weight) || 99999;
    return weightKg >= minWeight && weightKg <= maxWeight;
  });

  // Construire les tarifs à partir des données de prix par pays
  const rates = [];
  for (const method of filtered) {
    const countryData = (method.countries || []).find(
      c => c.iso_2 === country_code.toUpperCase() || c.iso_2 === 'XX'
    );
    if (!countryData) continue;

    // Récupérer le prix pour ce poids
    const price = getPriceForWeight(countryData, weightKg);
    if (price === null) continue;

    rates.push({
      rate_id:        String(method.id),
      carrier:        method.carrier || method.name,
      service:        method.name,
      price_eur:      price,
      estimated_days: method.lead_time_hours ? Math.ceil(method.lead_time_hours / 24) : null,
      min_weight:     method.min_weight,
      max_weight:     method.max_weight,
    });
  }

  // Trier par prix croissant
  rates.sort((a, b) => a.price_eur - b.price_eur);

  return rates;
}

/**
 * Détermine le prix pour un poids donné à partir des tranches de prix Sendcloud.
 * Sendcloud retourne les prix sous forme de tableau [{ weight, price }].
 */
function getPriceForWeight(countryData, weightKg) {
  const prices = countryData.price || [];
  if (!prices.length) return null;

  // Les prix Sendcloud sont triés par poids croissant
  // On prend le premier prix dont le poids max >= weightKg
  const sorted = [...prices].sort((a, b) =>
    parseFloat(a.weight) - parseFloat(b.weight)
  );

  for (const tier of sorted) {
    if (weightKg <= parseFloat(tier.weight)) {
      return parseFloat(tier.price);
    }
  }

  // Si le poids dépasse toutes les tranches → dernière tranche
  return parseFloat(sorted[sorted.length - 1]?.price) || null;
}

// Mapping méthodes fallback → IDs Sendcloud par tranche de poids
// IDs issus du compte Sendcloud (GET /api/v2/shipping_methods)
const SENDCLOUD_METHOD_MAP = {
  // Mondial Relay Point Relais domestic (FR) — IDs vérifiés sur le compte
  mondial_relay: [
    { maxKg: 0.25, id: 28035 }, { maxKg: 0.5,  id: 28036 }, { maxKg: 1,   id: 28037 },
    { maxKg: 2,    id: 28038 }, { maxKg: 3,     id: 28039 }, { maxKg: 5,   id: 28040 },
    { maxKg: 7,    id: 28041 }, { maxKg: 10,    id: 28042 }, { maxKg: 15,  id: 28043 },
    { maxKg: 20,   id: 28044 }, { maxKg: 25,    id: 28045 }, { maxKg: 30,  id: 28046 },
  ],
  // Colissimo Home domestic (FR)
  colissimo_home: [
    { maxKg: 0.25, id: 371 },  { maxKg: 0.5,  id: 366 },  { maxKg: 0.75, id: 367 },
    { maxKg: 1,    id: 364 },  { maxKg: 2,    id: 1066 }, { maxKg: 3,   id: 1067 },
    { maxKg: 4,    id: 1068 }, { maxKg: 5,    id: 1069 }, { maxKg: 6,   id: 1070 },
    { maxKg: 7,    id: 1071 }, { maxKg: 8,    id: 1072 }, { maxKg: 9,   id: 1073 },
    { maxKg: 10,   id: 1074 }, { maxKg: 30,   id: 1094 },
  ],
  // Colissimo Home international (hors FR)
  colissimo_home_intl: [
    { maxKg: 0.5,  id: 162  }, { maxKg: 1,   id: 163  }, { maxKg: 2,  id: 1143 },
    { maxKg: 3,    id: 1144 }, { maxKg: 5,   id: 1146 }, { maxKg: 10, id: 1151 },
  ],
  // Chronopost → fallback Colissimo home
  chronopost: [
    { maxKg: 0.25, id: 371 }, { maxKg: 1, id: 364 }, { maxKg: 2, id: 1066 },
    { maxKg: 5, id: 1069 }, { maxKg: 10, id: 1074 }, { maxKg: 30, id: 1094 },
  ],
  // DPD → fallback Colissimo home
  dpd_home: [
    { maxKg: 0.25, id: 371 }, { maxKg: 1, id: 364 }, { maxKg: 2, id: 1066 },
    { maxKg: 5, id: 1069 }, { maxKg: 10, id: 1074 }, { maxKg: 30, id: 1094 },
  ],
  // UPS/DHL international → Colissimo international
  ups_standard: [
    { maxKg: 0.5, id: 162 }, { maxKg: 1, id: 163 }, { maxKg: 2, id: 1143 },
    { maxKg: 5,   id: 1146 }, { maxKg: 10, id: 1151 },
  ],
  dhl_express: [
    { maxKg: 0.5, id: 162 }, { maxKg: 1, id: 163 }, { maxKg: 2, id: 1143 },
    { maxKg: 5,   id: 1146 }, { maxKg: 10, id: 1151 },
  ],
};

/**
 * Résout le vrai ID Sendcloud à partir de l'identifiant fallback et du poids.
 * Si method_id est déjà un entier valide, on l'utilise directement.
 */
function resolveMethodId(method_id, order, weightKg) {
  // Déjà un vrai ID numérique Sendcloud
  if (method_id && /^\d+$/.test(String(method_id))) {
    return Number(method_id);
  }

  // Ajuster la clé selon le pays (international vs domestic)
  const country = order.shipping_country?.toUpperCase();
  const isDomestic = country === 'FR';

  // Pour Colissimo hors France → utiliser la méthode internationale
  let key = method_id || 'colissimo_home';
  if (!isDomestic && (key === 'colissimo_home')) {
    key = 'colissimo_home_intl';
  }
  // Mondial Relay non disponible hors France → fallback Colissimo intl
  if (!isDomestic && key === 'mondial_relay') {
    key = 'colissimo_home_intl';
  }

  const tiers = SENDCLOUD_METHOD_MAP[key] || SENDCLOUD_METHOD_MAP['colissimo_home'];
  const tier = tiers.find(t => weightKg <= t.maxKg) || tiers[tiers.length - 1];
  return tier.id;
}

/**
 * Crée un colis Sendcloud et retourne le label + numéro de tracking.
 * Appelé par l'admin lors du fulfillment d'une commande.
 *
 * @param {object} params
 * @param {object} params.order       — données commande depuis la base
 * @param {string} params.method_id   — ID de la méthode d'expédition Sendcloud
 * @param {number} params.weight_grams — poids total en grammes
 */
async function createParcel({ order, method_id, weight_grams }) {
  const weightKg = (weight_grams || 500) / 1000;

  // Résoudre le vrai ID Sendcloud si method_id est un identifiant textuel du fallback
  const resolvedMethodId = await resolveMethodId(method_id, order, weightKg);

  const payload = {
    parcel: {
      name:         `${order.shipping_first_name} ${order.shipping_last_name}`,
      address:      order.shipping_address1,
      address_2:    order.shipping_address2 || '',
      house_number: '',
      city:         order.shipping_city,
      postal_code:  order.shipping_postal,
      country:      order.shipping_country,
      telephone:    order.shipping_phone || '',
      email:        order.email || '',
      weight:       weightKg.toFixed(3),
      shipment:     { id: resolvedMethodId },
      request_label: true,
      order_number:  order.order_number,
    },
  };

  const response = await request('POST', '/api/v2/parcels', payload);
  const parcel = response.parcel;

  return {
    parcel_id:       parcel.id,
    tracking_number: parcel.tracking_number,
    carrier:         parcel.carrier?.code || '',
    label_url:       parcel.label?.label_printer || parcel.label?.normal_printer?.[0] || null,
    tracking_url:    parcel.tracking_url || null,
  };
}

/**
 * Récupère les points relais Mondial Relay proches d'une adresse.
 * Utilise l'API publique Sendcloud (pas d'auth requise).
 *
 * @param {object} params
 * @param {string} params.country_code  — pays (ex: "FR")
 * @param {string} params.postal_code   — code postal
 * @param {string} params.city          — ville
 * @param {number} params.radius        — rayon en mètres (défaut 5000)
 */
function getServicePoints({ country_code, postal_code, city, radius = 5000 }) {
  return new Promise((resolve, reject) => {
    const address = encodeURIComponent(`${postal_code} ${city || ''}`.trim());
    const path = `/api/v2/service-points/?country=${country_code.toUpperCase()}&address=${address}&carrier=mondial_relay&radius=${radius}`;

    const credentials = Buffer.from(
      `${process.env.SENDCLOUD_PUBLIC_KEY}:${process.env.SENDCLOUD_SECRET_KEY}`
    ).toString('base64');

    const options = {
      hostname: 'servicepoints.sendcloud.sc',
      path,
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let raw = '';
      res.on('data', chunk => { raw += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(raw);
          if (res.statusCode >= 400) {
            const e = new Error(parsed.error?.message || 'Erreur Sendcloud service points');
            e.status = res.statusCode;
            return reject(e);
          }

          // Normaliser la réponse
          const points = (parsed || []).map(p => ({
            id:           p.id,
            name:         p.name,
            street:       `${p.street} ${p.house_number || ''}`.trim(),
            city:         p.city,
            postal_code:  p.postal_code,
            country:      p.country,
            latitude:     p.latitude,
            longitude:    p.longitude,
            distance:     p.distance || null,
            opening_times: normalizeOpeningTimes(p.formatted_opening_times || p.opening_times),
          }));

          resolve(points);
        } catch {
          reject(new Error('Réponse service points non parseable'));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

/**
 * Normalise les horaires d'ouverture Sendcloud en tableau lisible.
 * Sendcloud retourne { "0": ["09:00-12:00", "14:00-18:00"], "1": [...], ... }
 * 0 = Lundi, 6 = Dimanche
 */
function normalizeOpeningTimes(times) {
  if (!times || typeof times !== 'object') return null;
  const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  return Object.entries(times).map(([dayIndex, slots]) => ({
    day:   DAYS[parseInt(dayIndex)] || dayIndex,
    slots: Array.isArray(slots) && slots.length ? slots.join(', ') : 'Fermé',
  }));
}

module.exports = { getRates, createParcel, getServicePoints };
