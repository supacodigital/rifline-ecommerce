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



Audit global — Rifline e-commerce
CRITIQUE — 3 problèmes bloquants en production
1. Table password_reset_tokens absente du schéma de base

Fichier : backend/ecommerce_dev.sql + backend/src/repositories/auth.repository.js
Problème : La table est utilisée dans auth.repository.js (INSERT, SELECT, UPDATE) mais elle n'existe pas dans ecommerce_dev.sql. La migration 002_create_password_reset_tokens.sql a été supprimée (visible dans le git status). En production, toute demande de reset de mot de passe crashe avec une erreur SQL.
Correction : Créer la migration manquante.
2. GET /api/orders/ (admin) mort — route shadowing Express

Fichier : backend/src/routes/orders.routes.js
Problème : router.get('/:id', ...) est déclaré à la ligne 14, avant router.get('/', ...) à la ligne 17. En Express, GET / matche d'abord /:id avec id = "" (qui retourne un 404 de la DB), donc adminList n'est jamais atteint. L'admin ne peut pas voir la liste des commandes.
Correction : Mettre router.get('/') avant router.get('/:id').
3. Cleanup job ne restaure pas le stock des variantes

Fichier : backend/src/jobs/cleanupPendingOrders.js
Problème : Quand une commande pending expire, le job restaure uniquement le stock dans products — il ne touche pas product_variants. Les commandes avec variantes laissent donc le stock des variantes décrémenté définitivement, même après annulation.
Correction : Ajouter une requête de restauration sur product_variants.
MAJEUR — 2 problèmes fonctionnels importants
4. Email de confirmation : order.email toujours null via webhook

Fichier : backend/src/services/sumup.service.js
Problème : Dans handleWebhookEvent, la commande est récupérée via findByCheckoutId qui fait un SELECT * FROM orders sans JOIN sur users. L'email est donc undefined. sendOrderConfirmation envoie vers undefined et l'email ne part pas. Le fallback confirmCheckoutFromClient utilise findById (avec JOIN) — lui fonctionne correctement.
Correction : Ajouter le JOIN sur users dans findByCheckoutId.
5. order_items.variant_id absent de la colonne DB

Fichier : backend/ecommerce_dev.sql + backend/migrations/002_add_product_variants.sql
Problème : La migration 002 ajoute variant_id et variant_name à order_items, mais ces colonnes n'existent pas dans le schéma de base ecommerce_dev.sql. Si la migration n'a pas été appliquée en prod, tout INSERT INTO order_items avec variante crashe.
Correction : Vérifier que la migration 002 a bien été appliquée sur la DB de prod.
MINEUR — 3 points à améliorer
6. Double route /me et /mine inutile

Fichier : backend/src/routes/orders.routes.js
Les deux routes font exactement la même chose. À nettoyer.
7. Pas de table password_reset_tokens dans ecommerce_dev.sql

Même problème que le point 1, mais côté fichier de schema de référence — le fichier SQL exporté ne reflète plus la réalité de la DB après migrations.
8. cleanupPendingOrders tourne toutes les heures mais TTL est 30 min

Fichier : backend/server.js
Des commandes peuvent rester "pending" de 30 min à 1h30 en pratique. Pas critique, mais passer le setInterval à 30 minutes serait plus cohérent.
