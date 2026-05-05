require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

const app = express();

// --- Middlewares globaux ---
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(cookieParser());

// Le webhook SumUp doit recevoir le body RAW — monté AVANT express.json()
// cookieParser est déjà actif, donc requireAuth fonctionnera
app.use('/api/sumup/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

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
