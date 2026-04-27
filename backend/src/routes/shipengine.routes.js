const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/shipengine.controller');
const requireAuth  = require('../middlewares/requireAuth');
const requireAdmin = require('../middlewares/requireAdmin');

// Tarifs en temps réel pour le checkout (utilisateur connecté)
router.get('/rates',          requireAuth, ctrl.rates);

// Points relais Mondial Relay proches d'une adresse (utilisateur connecté)
router.get('/service-points', requireAuth, ctrl.servicePoints);

// Création du label d'expédition (admin uniquement)
router.post('/labels',        requireAdmin, ctrl.createLabel);

module.exports = router;
