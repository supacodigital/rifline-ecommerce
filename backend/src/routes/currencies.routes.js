const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/currencies.controller');
const requireAdmin = require('../middlewares/requireAdmin');

router.get('/',       ctrl.list);
router.get('/admin',  requireAdmin, ctrl.listAdmin);
router.post('/',      requireAdmin, ctrl.upsert);
router.delete('/:code', requireAdmin, ctrl.remove);

module.exports = router;
