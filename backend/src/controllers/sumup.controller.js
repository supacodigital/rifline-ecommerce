const service    = require('../services/sumup.service');
const ordersRepo = require('../repositories/orders.repository');

// Crée un checkout SumUp pour une commande (appelé depuis le checkout frontend)
async function createCheckout(req, res, next) {
  try {
    const { order_id } = req.body;
    if (!order_id) return res.status(400).json({ error: 'order_id requis' });
    const result = await service.createCheckout(Number(order_id), req.user.id);
    res.json(result);
  } catch (err) { next(err); }
}

// Webhook SumUp — corps RAW obligatoire pour vérifier la signature HMAC
async function webhook(req, res) {
  const signature = req.headers['x-payload-signature'];

  if (!signature || !service.verifyWebhookSignature(req.body, signature)) {
    console.error('Webhook SumUp : signature invalide');
    return res.status(400).json({ error: 'Signature invalide' });
  }

  let event;
  try {
    event = JSON.parse(req.body.toString());
  } catch (err) {
    return res.status(400).json({ error: 'Payload invalide' });
  }

  try {
    await service.handleWebhookEvent(event);
    res.json({ received: true });
  } catch (err) {
    console.error('Erreur traitement webhook SumUp :', err);
    res.status(500).json({ error: 'Erreur traitement webhook' });
  }
}

// Confirmation côté client (fallback page /confirmation)
// Accepte ?checkout_id=xxx OU ?order_number=xxx (flux SumUp post-redirect)
async function confirmCheckout(req, res, next) {
  try {
    let { checkout_id, order_number } = req.query;

    // Résolution via order_number si checkout_id absent
    if (!checkout_id && order_number) {
      const order = await ordersRepo.findByNumber(order_number);
      if (!order) return res.status(404).json({ error: 'Commande introuvable' });
      checkout_id = order.sumup_checkout_id;
    }

    if (!checkout_id) return res.status(400).json({ error: 'checkout_id ou order_number requis' });

    const result = await service.confirmCheckoutFromClient(checkout_id, req.user.id);
    res.json(result);
  } catch (err) { next(err); }
}

module.exports = { createCheckout, webhook, confirmCheckout };
