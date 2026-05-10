# Guide de déploiement — Rifline e-commerce

Hébergeur : **O2switch** (offre Cloud)
Stack : React + Vite (frontend statique) + Node.js + Express (backend via Phusion Passenger) + MySQL

---

## Vue d'ensemble

```
Visiteur → Apache (O2switch)
              ├── rif-line.com/          → dist/ (frontend statique)
              ├── rif-line.com/api/*     → Phusion Passenger → Node.js (backend)
              └── rif-line.com/uploads/* → dossier uploads/ (images)
```

Le frontend est compilé **en local** (le terminal cPanel manque de mémoire pour `npm run build`) puis uploadé via FTP/SSH. Le backend tourne via **Phusion Passenger** configuré dans cPanel.

---

## Pré-requis

- Accès cPanel O2switch
- Accès SSH ou FTP (FileZilla)
- Node.js disponible dans cPanel (Setup Node.js App)
- MySQL disponible dans cPanel (phpMyAdmin)

---

## 1. Préparer la base de données

### 1.1 Créer la base en prod

Dans cPanel → **MySQL Databases** :
1. Créer une base de données (ex: `user_rifline`)
2. Créer un utilisateur MySQL avec un mot de passe fort
3. Associer l'utilisateur à la base avec **tous les privilèges**

### 1.2 Importer le schéma

Dans cPanel → **phpMyAdmin** → sélectionner la base créée → onglet **Importer** :

Importer le fichier :

```
database/rifline.sql    ← schéma complet post-migrations (un seul fichier suffit)
```

> Le fichier `database/rifline.sql` contient le schéma complet avec toutes les migrations intégrées.

### 1.3 Créer le compte admin

Dans phpMyAdmin → onglet SQL :

```sql
UPDATE users SET role = 'admin' WHERE email = 'ton@email.com';
```

(Créer d'abord le compte via `/register` sur le site, puis le promouvoir en admin.)

---

## 2. Déployer le backend

### 2.1 Uploader les fichiers backend

Via SSH ou FTP, uploader le dossier `backend/` dans le répertoire home O2switch.
Ne pas uploader `node_modules/` ni `.env`.

Structure cible sur le serveur :
```
~/backend/
  server.js
  package.json
  src/
  uploads/          ← créer ce dossier vide s'il n'existe pas
    products/       ← créer ce dossier vide
    categories/     ← créer ce dossier vide
```

### 2.2 Configurer Node.js dans cPanel

Dans cPanel → **Setup Node.js App** :

| Champ | Valeur |
|-------|--------|
| Node.js version | 20.x (ou la plus récente disponible) |
| Application mode | Production |
| Application root | `/home/user/backend` |
| Application URL | `rif-line.com` (ou le sous-domaine API si séparé) |
| Application startup file | `server.js` |

Cliquer **Create** puis **Run NPM Install** pour installer les dépendances.

### 2.3 Configurer les variables d'environnement

Dans l'interface **Setup Node.js App** → section **Environment variables**, ajouter :

```
NODE_ENV=production
PORT=                         ← laisser vide, Passenger gère le port
FRONTEND_URL=https://rif-line.com

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=user_riflinedb
DB_PASSWORD=MOT_DE_PASSE_DB
DB_NAME=user_rifline

JWT_SECRET=CHAINE_ALEATOIRE_LONGUE_60_CHARS_MINIMUM

BREVO_SMTP_USER=supaco.digital@gmail.com
BREVO_SMTP_KEY=<clé_smtp_brevo_prod>

SUMUP_API_KEY=<api_key_sumup_prod>
SUMUP_CLIENT_ID=<client_id_sumup_prod>
SUMUP_CLIENT_SECRET=<client_secret_sumup_prod>
SUMUP_MERCHANT_CODE=<merchant_code_sumup>
SUMUP_WEBHOOK_SECRET=<chaine_aleatoire_webhook_sumup>

SENDCLOUD_PUBLIC_KEY=<public_key_sendcloud_prod>
SENDCLOUD_SECRET_KEY=<secret_key_sendcloud_prod>

SHOP_NAME=Rifline
SHOP_ADDRESS_LINE1=1 rue de la Paix
SHOP_CITY=Oyonnax
SHOP_POSTAL_CODE=01100
SHOP_COUNTRY_CODE=FR
```

> **Ne jamais uploader le fichier `.env` local** — toutes les variables sont saisies directement dans cPanel.

> **JWT_SECRET** : générer une chaîne aléatoire sécurisée, par exemple :
> ```bash
> node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
> ```

> **SUMUP_WEBHOOK_SECRET** : générer une chaîne aléatoire, puis la configurer aussi dans le dashboard SumUp (Développeurs → Webhooks).

### 2.4 Configurer le webhook SumUp

Dans le dashboard SumUp → **Développeurs → Webhooks** :
- URL : `https://rif-line.com/api/sumup/webhook`
- Événement : `CHECKOUT_STATUS_CHANGED`
- Secret : la valeur de `SUMUP_WEBHOOK_SECRET`

### 2.5 Démarrer l'application

Dans cPanel → Setup Node.js App → cliquer **Restart** (ou **Start** si première fois).

Vérifier que le backend répond :
```
https://rif-line.com/api/health  → {"status":"ok"}
```

---

## 3. Déployer le frontend

### 3.1 Configurer l'URL de l'API en prod

Avant de builder, vérifier que le fichier `frontend/src/api/axios.js` utilise une URL relative `/api` (pas `localhost`). Si c'est le cas, aucune modification n'est nécessaire — Vite proxie en dev et Apache redirige en prod.

Si le backend est sur un sous-domaine séparé (ex: `api.rif-line.com`), créer un fichier `frontend/.env.production` :

```
VITE_API_URL=https://api.rif-line.com
```

### 3.2 Builder le frontend en local

```bash
cd frontend
npm run build
```

Le dossier `frontend/dist/` est généré.

### 3.3 Uploader le dist

Via FTP/SSH, uploader **le contenu** du dossier `dist/` dans le dossier public du domaine sur O2switch :

```
~/public_html/    ← ou le dossier racine du domaine rif-line.com
  index.html
  assets/
  ...
```

### 3.4 Configurer Apache pour le routing React (SPA)

Créer ou modifier le fichier `~/public_html/.htaccess` :

```apache
Options -MultiViews
RewriteEngine On

# Rediriger /api/* vers le backend Node.js (Passenger)
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^ - [L]

# Rediriger /uploads/* vers le dossier uploads du backend
RewriteCond %{REQUEST_URI} ^/uploads/
RewriteRule ^ - [L]

# Toutes les autres routes → index.html (React Router)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```

---

## 4. SSL / HTTPS

Dans cPanel → **SSL/TLS** → **Let's Encrypt** :
- Sélectionner `rif-line.com` et `www.rif-line.com`
- Cliquer **Issue** — le certificat est généré et renouvelé automatiquement

Vérifier que `FRONTEND_URL` dans les variables d'env commence bien par `https://`.

---

## 5. Vérifications post-déploiement

Tester dans l'ordre :

- [ ] `https://rif-line.com/api/health` → `{"status":"ok"}`
- [ ] Page d'accueil charge correctement
- [ ] Inscription et connexion fonctionnent
- [ ] Catalogue produits s'affiche
- [ ] Page produit avec variantes
- [ ] Ajout au panier
- [ ] Checkout complet (adresse → livraison → paiement SumUp)
- [ ] Email de confirmation reçu après paiement
- [ ] Forgot password → email de reset reçu
- [ ] Panel admin `/admin` accessible avec le compte admin
- [ ] Upload d'image produit fonctionne
- [ ] Points relais Mondial Relay s'affichent

---

## 6. Mises à jour futures

### Backend
1. Uploader les fichiers modifiés via FTP/SSH
2. Dans cPanel → Setup Node.js App → **Restart**

### Frontend
```bash
cd frontend
npm run build
```
Uploader le nouveau `dist/` en remplaçant l'ancien.

### Migrations SQL
Appliquer le fichier SQL dans phpMyAdmin avant de déployer le code qui en dépend.

---

## Dépannage rapide

| Problème | Cause probable | Solution |
|----------|---------------|---------|
| `/api/health` → 502 | Passenger n'a pas démarré | cPanel → Setup Node.js App → Restart |
| Cookies non envoyés | `FRONTEND_URL` incorrect | Vérifier que la valeur correspond exactement à l'URL du site |
| Images non servies | Dossier `uploads/` manquant ou mauvais chemin | Créer `~/backend/uploads/products/` et `~/backend/uploads/categories/` |
| Refresh page → 404 | `.htaccess` manquant ou mal configuré | Vérifier la règle RewriteRule vers `index.html` |
| Email non reçu | Clé Brevo invalide ou SMTP bloqué | Vérifier `BREVO_SMTP_KEY` dans cPanel env vars |
| Paiement SumUp échoue | `SUMUP_MERCHANT_CODE` incorrect | Vérifier dans le dashboard SumUp → Profil marchand |
