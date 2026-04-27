const express     = require('express');
const router      = express.Router();
const ctrl        = require('../controllers/sumup.controller');
const requireAuth = require('../middlewares/requireAuth');

// Le webhook doit recevoir le body RAW pour vérifier la signature HMAC
// Monté AVANT express.json() dans server.js
router.post('/webhook', express.raw({ type: 'application/json' }), ctrl.webhook);

// Création du checkout SumUp (client connecté)
router.post('/checkout', requireAuth, ctrl.createCheckout);

// Confirmation de paiement côté client — fallback au webhook (client connecté)
router.get('/confirm', requireAuth, ctrl.confirmCheckout);

module.exports = router;
