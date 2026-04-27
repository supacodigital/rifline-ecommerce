const express  = require('express');
const router   = express.Router();
const multer   = require('multer');
const path     = require('path');
const ctrl     = require('../controllers/categories.controller');
const requireAdmin = require('../middlewares/requireAdmin');

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../uploads/categories'),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
    cb(null, allowed.includes(path.extname(file.originalname).toLowerCase()));
  },
});

router.get('/',                     ctrl.list);
router.get('/:id',                  ctrl.show);
router.post('/',                    requireAdmin, ctrl.create);
router.put('/:id',                  requireAdmin, ctrl.update);
router.delete('/:id',               requireAdmin, ctrl.destroy);
router.post('/:id/image',           requireAdmin, upload.single('image'), ctrl.uploadImage);
router.delete('/:id/image',         requireAdmin, ctrl.deleteImage);

module.exports = router;
