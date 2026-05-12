require('dotenv').config();

// Vérification des variables d'environnement obligatoires au démarrage
const REQUIRED_ENV = ['FRONTEND_URL', 'JWT_SECRET', 'DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missing = REQUIRED_ENV.filter(k => !process.env[k]);
if (missing.length > 0) {
  console.error(`FATAL: variables d'environnement manquantes : ${missing.join(', ')}`);
  process.exit(1);
}

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();

// --- Sécurité HTTP headers ---
app.use(helmet());

// --- CORS ---
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// --- Rate limiting sur les routes sensibles ---
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de tentatives, réessayez dans 15 minutes.' },
});

app.use(cookieParser());

// Le webhook SumUp doit recevoir le body RAW — monté AVANT express.json()
app.use('/api/sumup/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

// Rate limiting appliqué après cookieParser/json pour que les middlewares d'erreur fonctionnent
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);

// --- Servir les images uploadées ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Routes ---
app.use('/api/sumup',     require('./src/routes/sumup.routes'));
app.use('/api/auth',      require('./src/routes/auth.routes'));
app.use('/api/products',  require('./src/routes/products.routes'));
app.use('/api/categories',require('./src/routes/categories.routes'));
app.use('/api/orders',    require('./src/routes/orders.routes'));
app.use('/api/users',     require('./src/routes/users.routes'));
app.use('/api/coupons',   require('./src/routes/coupons.routes'));
app.use('/api/reviews',   require('./src/routes/reviews.routes'));
app.use('/api/wishlists', require('./src/routes/wishlists.routes'));
app.use('/api/currencies',require('./src/routes/currencies.routes'));
app.use('/api/shipping',    require('./src/routes/shipping.routes'));
app.use('/api/shipengine', require('./src/routes/shipengine.routes'));
app.use('/api/reports',   require('./src/routes/reports.routes'));

// --- Healthcheck ---
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// --- Gestionnaire d'erreurs global ---
app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Erreur serveur' });
});

const cleanupPendingOrders = require('./src/jobs/cleanupPendingOrders');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);

  // Nettoyage des commandes pending abandonnées au démarrage puis toutes les 30 minutes (= TTL)
  cleanupPendingOrders();
  setInterval(cleanupPendingOrders, 30 * 60 * 1000);
});
