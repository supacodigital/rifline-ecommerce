// Logique SumUp : création du checkout + traitement du webhook + confirmation
const crypto = require('crypto');
const ordersRepo = require('../repositories/orders.repository');
const emailService = require('./email.service');

const SUMUP_API = 'https://api.sumup.com';

// Retourne le token d'accès SumUp.
// Si SUMUP_API_KEY est définie, on l'utilise directement (plus simple, scope payments inclus).
// Sinon, on passe par OAuth2 client_credentials.
async function getSumupToken() {
  if (process.env.SUMUP_API_KEY) {
    return process.env.SUMUP_API_KEY;
  }

  const res = await fetch(`${SUMUP_API}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type:    'client_credentials',
      client_id:     process.env.SUMUP_CLIENT_ID,
      client_secret: process.env.SUMUP_CLIENT_SECRET,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    const err = new Error(`SumUp token error: ${body}`);
    err.status = 502;
    throw err;
  }

  const data = await res.json();
  return data.access_token;
}

/**
 * Crée un checkout SumUp pour une commande existante.
 * Le montant est toujours calculé côté serveur depuis la commande en base.
 */
async function createCheckout(order_id, user_id) {
  const order = await ordersRepo.findById(order_id);
  if (!order)                    { const e = new Error('Commande introuvable'); e.status = 404; throw e; }
  if (order.user_id !== user_id) { const e = new Error('Accès refusé');        e.status = 403; throw e; }
  if (order.status !== 'pending'){ const e = new Error('Cette commande ne peut plus être payée'); e.status = 400; throw e; }

  const token = await getSumupToken();

  // Première passe : créer le checkout sans return_url pour obtenir l'id SumUp
  const body = {
    checkout_reference: order.order_number,
    amount:             Number(order.total_eur),
    currency:           order.currency_code?.toUpperCase() || 'EUR',
    merchant_code:      process.env.SUMUP_MERCHANT_CODE,
    description:        `Commande ${order.order_number}`,
    // return_url construit avec checkout_id après la réponse SumUp
    return_url:         `${process.env.FRONTEND_URL}/confirmation?order=${order.order_number}`,
  };

  // Si un checkout SumUp existe déjà pour cette commande, le réutiliser
  if (order.sumup_checkout_id) {
    return { checkout_id: order.sumup_checkout_id };
  }

  const res = await fetch(`${SUMUP_API}/v0.1/checkouts`, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  // 409 = checkout déjà existant pour ce checkout_reference → récupérer l'ID existant
  if (res.status === 409) {
    const errData = await res.json().catch(() => ({}));
    // Chercher le checkout existant par reference
    const listRes = await fetch(
      `${SUMUP_API}/v0.1/checkouts?checkout_reference=${encodeURIComponent(order.order_number)}`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    if (listRes.ok) {
      const existing = await listRes.json();
      const found = Array.isArray(existing) ? existing[0] : existing;
      if (found?.id) {
        await ordersRepo.updateStatus(order.id, 'pending', { sumup_checkout_id: found.id });
        return { checkout_id: found.id };
      }
    }
    const e = new Error(errData.message || 'Checkout SumUp dupliqué');
    e.status = 409;
    throw e;
  }

  if (!res.ok) {
    const text = await res.text();
    const e = new Error(`SumUp checkout error: ${text}`);
    e.status = 502;
    throw e;
  }

  const checkout = await res.json();

  // Stocker l'ID du checkout SumUp sur la commande
  await ordersRepo.updateStatus(order.id, 'pending', { sumup_checkout_id: checkout.id });

  return { checkout_id: checkout.id };
}

/**
 * Vérifie la signature HMAC-SHA256 d'un webhook SumUp.
 * SumUp signe le payload avec le secret configuré dans le dashboard.
 */
function verifyWebhookSignature(rawBody, signature) {
  const secret = process.env.SUMUP_WEBHOOK_SECRET;
  if (!secret) return false;
  try {
    const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
    const expBuf   = Buffer.from(expected);
    const sigBuf   = Buffer.from(signature);
    // timingSafeEqual exige des buffers de même longueur — on vérifie avant d'appeler
    if (expBuf.length !== sigBuf.length) return false;
    return crypto.timingSafeEqual(expBuf, sigBuf);
  } catch {
    return false;
  }
}

/**
 * Traite les événements SumUp reçus via webhook.
 * La vérification de signature est faite AVANT d'appeler cette fonction.
 */
async function handleWebhookEvent(event) {
  // SumUp envoie un event de type "CHECKOUT_STATUS_CHANGED" (ou similaire)
  const { event_type, payload } = event;

  if (event_type !== 'CHECKOUT_STATUS_CHANGED') return;

  const { id: checkout_id, status } = payload || {};
  if (!checkout_id) return;

  const order = await ordersRepo.findByCheckoutId(checkout_id);
  if (!order) return;

  if (status === 'PAID') {
    // Éviter de traiter deux fois le même paiement
    if (order.status !== 'pending') return;
    await ordersRepo.updateStatus(order.id, 'paid', { sumup_checkout_id: checkout_id });
    // Envoyer l'email de confirmation de commande
    const items = await ordersRepo.getItems(order.id);
    await emailService.sendOrderConfirmation(order, items);
  } else if (status === 'FAILED') {
    // On laisse la commande en pending pour permettre un retry
    console.warn(`Paiement SumUp échoué pour la commande ${order.id} (checkout ${checkout_id})`);
  }
}

/**
 * Vérifie côté serveur qu'un checkout SumUp est bien "PAID"
 * et met à jour le statut de la commande en "paid".
 * Appelé depuis la page /confirmation comme fallback au webhook.
 */
async function confirmCheckoutFromClient(checkout_id, user_id) {
  const order = await ordersRepo.findByCheckoutId(checkout_id);
  if (!order)                    { const e = new Error('Commande introuvable'); e.status = 404; throw e; }
  if (order.user_id !== user_id) { const e = new Error('Accès refusé');        e.status = 403; throw e; }

  // Déjà payée → rien à faire
  if (order.status === 'paid') return { status: 'paid', order_id: order.id };

  const token = await getSumupToken();
  const res   = await fetch(`${SUMUP_API}/v0.1/checkouts/${checkout_id}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (!res.ok) {
    const e = new Error('Impossible de vérifier le statut du paiement'); e.status = 502; throw e;
  }

  const checkout = await res.json();

  if (checkout.status !== 'PAID') {
    return { status: checkout.status };
  }

  await ordersRepo.updateStatus(order.id, 'paid');
  // Envoyer l'email de confirmation (fallback si le webhook n'a pas encore déclenché)
  const items = await ordersRepo.getItems(order.id);
  // Recharger la commande pour avoir l'email (le findByCheckoutId ne joint pas users)
  const fullOrder = await ordersRepo.findById(order.id);
  await emailService.sendOrderConfirmation(fullOrder, items);
  return { status: 'paid', order_id: order.id };
}

module.exports = { createCheckout, verifyWebhookSignature, handleWebhookEvent, confirmCheckoutFromClient };
