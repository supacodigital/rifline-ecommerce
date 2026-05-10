const { body } = require('express-validator');

const addressRules = [
  body('first_name').trim().notEmpty().withMessage('Prénom requis'),
  body('last_name').trim().notEmpty().withMessage('Nom requis'),
  body('line1').trim().notEmpty().withMessage('Adresse requise'),
  body('city').trim().notEmpty().withMessage('Ville requise'),
  body('postal_code')
    .trim()
    .notEmpty().withMessage('Code postal requis')
    .matches(/^[0-9A-Z\- ]{3,10}$/i).withMessage('Code postal invalide'),
  body('country_code')
    .trim()
    .notEmpty().withMessage('Pays requis')
    .isLength({ min: 2, max: 2 }).withMessage('Code pays ISO 2 lettres requis'),
  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^\+?[\d\s\-().]{6,20}$/).withMessage('Numéro de téléphone invalide'),
];

module.exports = { addressRules };
