const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/coupons.controller');
const requireAuth  = require('../middlewares/requireAuth');
const requireAdmin = require('../middlewares/requireAdmin');

router.post('/validate', requireAuth, ctrl.validate);

// Admin
router.get('/',       requireAdmin, ctrl.list);
router.post('/',      requireAdmin, ctrl.create);
router.put('/:id',    requireAdmin, ctrl.update);
router.delete('/:id', requireAdmin, ctrl.destroy);

module.exports = router;
