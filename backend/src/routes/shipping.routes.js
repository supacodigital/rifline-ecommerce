const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/shipping.controller');
const requireAdmin = require('../middlewares/requireAdmin');

// Public — tarifs selon pays et poids
router.get('/rates', ctrl.rates);

// Admin — gestion des zones
router.get('/zones',         requireAdmin, ctrl.listZones);
router.post('/zones',        requireAdmin, ctrl.createZone);
router.put('/zones/:id',     requireAdmin, ctrl.updateZone);
router.delete('/zones/:id',  requireAdmin, ctrl.deleteZone);

// Admin — tarifs d'une zone
router.post('/zones/:id/rates',           requireAdmin, ctrl.createRate);
router.delete('/zones/:id/rates/:rateId', requireAdmin, ctrl.deleteRate);

module.exports = router;
