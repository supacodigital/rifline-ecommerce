// Vérifie que l'utilisateur est connecté (JWT httpOnly cookie)
const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const token = req.cookies?.access_token;
  if (!token) {
    return res.status(401).json({ error: 'Non authentifié' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, role }
    next();
  } catch {
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
}

module.exports = requireAuth;
