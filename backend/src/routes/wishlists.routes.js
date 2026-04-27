const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/wishlists.controller');
const requireAuth = require('../middlewares/requireAuth');

router.get('/',                    requireAuth, ctrl.list);
router.post('/:productId',         requireAuth, ctrl.add);
router.delete('/:productId',       requireAuth, ctrl.remove);

module.exports = router;
