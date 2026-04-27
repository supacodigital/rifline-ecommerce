const { body, query } = require('express-validator');

const createRules = [
  body('name_fr').trim().notEmpty().withMessage('Nom FR requis'),
  body('name_en').trim().notEmpty().withMessage('Nom EN requis'),
  body('price').isFloat({ min: 0 }).withMessage('Prix invalide'),
  body('stock').isInt({ min: 0 }).withMessage('Stock invalide'),
  body('category_id').isInt({ min: 1 }).withMessage('category_id invalide'),
];

const listRules = [
  query('min_price').optional().isFloat({ min: 0 }),
  query('max_price').optional().isFloat({ min: 0 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 }),
];

module.exports = { createRules, listRules };
