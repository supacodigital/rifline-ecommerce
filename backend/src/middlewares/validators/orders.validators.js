const { body } = require('express-validator');

const createRules = [
  body('shipping.shipping_first_name').trim().notEmpty().withMessage('Prénom livraison requis'),
  body('shipping.shipping_last_name').trim().notEmpty().withMessage('Nom livraison requis'),
  body('shipping.shipping_address1').trim().notEmpty().withMessage('Adresse requise'),
  body('shipping.shipping_city').trim().notEmpty().withMessage('Ville requise'),
  body('shipping.shipping_postal').trim().notEmpty().withMessage('Code postal requis'),
  body('shipping.shipping_country').isLength({ min: 2, max: 2 }).withMessage('Code pays invalide (ISO 2)'),
  body('items').isArray({ min: 1 }).withMessage('Le panier est vide'),
  body('items.*.product_id').isInt({ min: 1 }).withMessage('product_id invalide'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantité invalide'),
];

module.exports = { createRules };
