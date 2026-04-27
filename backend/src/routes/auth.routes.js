const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/auth.controller');
const requireAuth = require('../middlewares/requireAuth');
const validate = require('../middlewares/validate');
const { registerRules, loginRules } = require('../middlewares/validators/auth.validators');

router.post('/register',       registerRules, validate, ctrl.register);
router.post('/login',          loginRules,    validate, ctrl.login);
router.post('/refresh',        ctrl.refresh);
router.post('/logout',         ctrl.logout);
router.get('/me',              requireAuth, ctrl.me);
router.post('/forgot-password', ctrl.forgotPassword);
router.post('/reset-password',  ctrl.resetPassword);

module.exports = router;
