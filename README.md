# RifLine — E-commerce Full-Stack

Boutique e-commerce moderne spécialisée dans les parfums et produits orientaux.

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | React 19 + Vite + CSS Modules |
| Backend | Node.js + Express |
| Base de données | MySQL (raw SQL, sans ORM) |
| Paiement | SumUp |
| Livraison | Sendcloud (tarifs, labels, points relais Mondial Relay) |
| Auth | JWT httpOnly cookie + refresh token |
| Images | Multer — stockage local `/uploads` |
| i18n | i18next — FR (défaut) / EN |

---

## Structure du projet

```
/
├── frontend/               # React + Vite
│   ├── src/
│   │   ├── api/            # Instance Axios centralisée
│   │   ├── components/     # Composants réutilisables (CartDrawer, ProductCard…)
│   │   ├── context/        # Auth, Cart, Currency, Wishlist
│   │   ├── locales/        # Traductions FR / EN
│   │   └── pages/          # Pages storefront + admin
│   └── vite.config.js
│
└── backend/                # Node.js + Express
    ├── migrations/         # Scripts SQL de migration
    ├── uploads/            # Images produits et catégories
    └── src/
        ├── config/         # Connexion MySQL
        ├── controllers/    # Handlers HTTP
        ├── middlewares/    # requireAuth, requireAdmin, validate
        ├── repositories/   # Requêtes SQL brutes
        ├── routes/         # Définition des routes
        └── services/       # Logique métier
```

---

## Fonctionnalités

### Storefront
- Catalogue produits avec filtres (catégorie, prix)
- Page produit avec galerie d'images et avis clients
- Panier persistant (localStorage)
- Checkout multi-étapes : adresse → livraison → paiement SumUp
- Sélection de point relais Mondial Relay
- Compte client : profil, adresses, historique de commandes
- Wishlist
- Codes promo
- Sélecteur de devise (EUR, USD, CHF…)
- Interface bilingue FR / EN

### Admin (`/admin`)
- Gestion produits — CRUD + upload jusqu'à 5 images
- Gestion catégories — CRUD avec image
- Gestion commandes — statuts + génération de labels Sendcloud
- Gestion clients
- Gestion coupons
- Gestion devises
- Rapports — chiffre d'affaires, top produits, commandes par statut

---

## Démarrage en développement

### Prérequis
- Node.js 18+
- MySQL via MAMP (port 8889)

### Backend

```bash
cd backend
cp .env.example .env   # puis remplir les valeurs
npm install
node server.js
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Le proxy Vite redirige automatiquement `/api` et `/uploads` vers `localhost:2000`.

---

## Variables d'environnement

Copier `backend/.env.example` en `backend/.env` et renseigner :

| Variable | Description |
|----------|-------------|
| `DB_*` | Connexion MySQL |
| `JWT_SECRET` | Secret pour les tokens JWT |
| `SUMUP_API_KEY` | API Key SumUp (préféré — récupérée dans Developer Portal → Toolkit → API Keys) |
| `SUMUP_CLIENT_ID` | Identifiant app OAuth2 SumUp (fallback si pas d'API Key) |
| `SUMUP_CLIENT_SECRET` | Secret app OAuth2 SumUp (fallback si pas d'API Key) |
| `SUMUP_MERCHANT_CODE` | Code marchand SumUp (visible dans les paramètres du compte) |
| `SUMUP_WEBHOOK_SECRET` | Secret webhook SumUp (chaîne libre en local) |
| `SENDCLOUD_PUBLIC_KEY` | Clé publique Sendcloud |
| `SENDCLOUD_SECRET_KEY` | Clé secrète Sendcloud |
| `SHOP_*` | Adresse expéditeur (boutique) |

### Tester le paiement SumUp en sandbox

1. Se connecter sur [developer.sumup.com](https://developer.sumup.com) avec le **compte sandbox**
2. Récupérer l'API Key dans **Toolkit → API Keys** et la mettre dans `SUMUP_API_KEY`
3. Utiliser ces cartes de test officielles SumUp (CVV : `123`, date : `12/28`) :

| Numéro de carte | Réseau | Résultat |
|----------------|--------|---------|
| `4200 0000 0000 0091` | VISA | Succès |
| `4200 0000 0000 0109` | VISA | Succès |
| `4200 0000 0000 0026` | VISA | Succès |
| `5200 0000 0000 0007` | Mastercard | Succès |
| `5200 0000 0000 0023` | Mastercard | Succès |

> Les cartes génériques (ex. `4111 1111 1111 1111`) ne fonctionnent pas avec SumUp sandbox.

---

## Base de données

### Migration

Appliquer les migrations dans l'ordre depuis `backend/migrations/` :

```sql
-- 001_add_sumup_checkout_id.sql
ALTER TABLE orders
  ADD COLUMN sumup_checkout_id VARCHAR(64) NULL DEFAULT NULL;
```

### Tables principales

| Table | Description |
|-------|-------------|
| `users` | Comptes clients et admins |
| `addresses` | Adresses de livraison |
| `categories` | Catégories produits |
| `products` | Catalogue |
| `product_images` | Images produits (max 5) |
| `orders` | Commandes |
| `order_items` | Lignes de commande (snapshot prix) |
| `coupons` | Codes promo |
| `currencies` | Devises supportées |
| `reviews` | Avis produits (achat vérifié) |
| `wishlists` | Produits sauvegardés |
| `refresh_tokens` | Tokens de renouvellement JWT |

---

## Déploiement (O2switch)

| Élément | Configuration |
|---------|---------------|
| Hébergeur | O2switch — interface cPanel |
| Backend | Phusion Passenger via "Setup Node.js App" — startup : `backend/server.js` |
| Frontend | Build local `npm run build` → upload `dist/` via FTP |
| Base de données | MySQL port 3306 |
| SSL | Let's Encrypt automatique via cPanel |
| Variables d'env | Définies dans l'interface cPanel (pas de `.env` uploadé) |

---

## Conventions

- Commentaires en **français**, code (variables, fonctions, SQL) en **anglais**
- Pas d'inline styles — CSS Modules uniquement
- Composants React fonctionnels uniquement
- Icônes Lucide React uniquement
- Pas d'ORM — raw SQL uniquement
- Architecture backend : `routes → controllers → services → repositories`
