const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/reviews.controller');
const requireAuth  = require('../middlewares/requireAuth');
const requireAdmin = require('../middlewares/requireAdmin');
const validate = require('../middlewares/validate');
const { createRules } = require('../middlewares/validators/reviews.validators');

router.get('/product/:productId', ctrl.list);
router.post('/',                  requireAuth, createRules, validate, ctrl.create);

// Admin
router.get('/pending',        requireAdmin, ctrl.pending);
router.patch('/:id/approve',  requireAdmin, ctrl.approve);
router.delete('/:id',         requireAdmin, ctrl.destroy);

module.exports = router;
