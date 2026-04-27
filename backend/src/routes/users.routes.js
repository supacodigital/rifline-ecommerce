const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/users.controller');
const requireAuth  = require('../middlewares/requireAuth');
const requireAdmin = require('../middlewares/requireAdmin');

router.get('/me',                requireAuth, ctrl.getProfile);
router.put('/me',                requireAuth, ctrl.updateProfile);
router.put('/me/password',       requireAuth, ctrl.changePassword);
router.get('/me/addresses',      requireAuth, ctrl.listAddresses);
router.post('/me/addresses',     requireAuth, ctrl.addAddress);
router.put('/me/addresses/:id',  requireAuth, ctrl.updateAddress);
router.delete('/me/addresses/:id', requireAuth, ctrl.deleteAddress);

// Admin
router.get('/', requireAdmin, ctrl.adminList);

module.exports = router;
