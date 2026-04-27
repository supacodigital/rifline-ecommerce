const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/reports.controller');
const requireAdmin = require('../middlewares/requireAdmin');

router.get('/dashboard',   requireAdmin, ctrl.dashboard);
router.get('/revenue/day', requireAdmin, ctrl.revenueByDay);

module.exports = router;
