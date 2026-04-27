// Vérifie que l'utilisateur connecté a le rôle admin
// Doit être utilisé APRÈS requireAuth
const requireAuth = require('./requireAuth');

function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }
    next();
  });
}

module.exports = requireAdmin;
