const { body } = require('express-validator');

const registerRules = [
  body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 8 }).withMessage('Mot de passe : 8 caractères minimum'),
  body('first_name').trim().notEmpty().withMessage('Prénom requis'),
  body('last_name').trim().notEmpty().withMessage('Nom requis'),
];

const loginRules = [
  body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
  body('password').notEmpty().withMessage('Mot de passe requis'),
];

module.exports = { registerRules, loginRules };
