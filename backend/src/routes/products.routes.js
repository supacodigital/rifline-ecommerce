const express  = require('express');
const router   = express.Router();
const multer   = require('multer');
const path     = require('path');
const ctrl     = require('../controllers/products.controller');
const requireAuth  = require('../middlewares/requireAuth');
const requireAdmin = require('../middlewares/requireAdmin');
const validate = require('../middlewares/validate');
const { createRules, listRules } = require('../middlewares/validators/products.validators');

// Configuration multer — stockage local
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../uploads/products'),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});
const ALLOWED_EXTS  = ['.jpg', '.jpeg', '.png', '.webp'];
const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp'];

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mo max
  fileFilter: (_req, file, cb) => {
    const ext  = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;
    if (!ALLOWED_EXTS.includes(ext) || !ALLOWED_MIMES.includes(mime)) {
      return cb(new Error('Format non supporté. Utilisez JPG, PNG ou WEBP.'));
    }
    cb(null, true);
  },
});

// Routes publiques
router.get('/',       listRules, validate, ctrl.list);
router.get('/:slug',  ctrl.show);

// Routes admin
router.post('/',                                  requireAdmin, createRules, validate, ctrl.create);
router.put('/:id',                                requireAdmin, ctrl.update);
router.delete('/:id',                             requireAdmin, ctrl.destroy);
router.post('/:id/images',                        requireAdmin, upload.single('image'), ctrl.uploadImage);
router.post('/:id/images/:imageId/cover',         requireAdmin, ctrl.setCover);
router.delete('/:id/images/:imageId',             requireAdmin, ctrl.deleteImage);

// Variantes
router.get('/:id/variants',                             requireAdmin, ctrl.listVariants);
router.post('/:id/variants',                            requireAdmin, ctrl.createVariant);
router.put('/:id/variants/:variantId',                  requireAdmin, ctrl.updateVariant);
router.delete('/:id/variants/:variantId',               requireAdmin, ctrl.deleteVariant);
router.post('/:id/variants/:variantId/image',           requireAdmin, upload.single('image'), ctrl.uploadVariantImage);
router.delete('/:id/variants/:variantId/image',         requireAdmin, ctrl.deleteVariantImage);

module.exports = router;
