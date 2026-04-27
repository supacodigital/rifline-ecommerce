const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/orders.controller');
const requireAuth  = require('../middlewares/requireAuth');
const requireAdmin = require('../middlewares/requireAdmin');
const validate = require('../middlewares/validate');
const { createRules } = require('../middlewares/validators/orders.validators');

router.post('/',                    requireAuth, createRules, validate, ctrl.create);
router.get('/me',                   requireAuth, ctrl.myOrders);
router.get('/mine',                 requireAuth, ctrl.myOrders);
router.get('/:id',                  requireAuth, ctrl.show);

// Admin
router.get('/',            requireAdmin, ctrl.adminList);
router.patch('/:id/status',requireAdmin, ctrl.adminUpdateStatus);

module.exports = router;
