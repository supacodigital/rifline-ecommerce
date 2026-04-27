const { body } = require('express-validator');

const createRules = [
  body('product_id').isInt({ min: 1 }).withMessage('product_id invalide'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Note entre 1 et 5 requise'),
  body('title').optional().trim().isLength({ max: 255 }),
  body('body').optional().trim(),
];

module.exports = { createRules };
