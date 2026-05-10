# Déploiement RifLine — rif-line.com (O2switch)

Tout se fait depuis le **cPanel O2switch** et **FileZilla** (FTP). Aucune ligne de commande requise côté serveur.

---

## Ce qu'il faut avoir sous la main

- Identifiants cPanel O2switch du client
- FileZilla (FTP) — [filezilla-project.org](https://filezilla-project.org)
- Le mot de passe d'application Gmail du client (16 caractères)
- Les clés API SumUp et Sendcloud de production

---

## ÉTAPE 1 — Base de données

**Dans cPanel → MySQL Databases**

1. Cliquer **Create Database** → nommer la base `rifline` (le nom complet sera `cpanelusername_rifline`)
2. Cliquer **Create User** → créer un utilisateur avec un mot de passe fort, noter les 3 infos :
   - Nom de la base : `cpanelusername_rifline`
   - Nom de l'utilisateur : `cpanelusername_rifline`
   - Mot de passe : `...`
3. Cliquer **Add User To Database** → sélectionner les deux, cocher **All Privileges**

**Dans cPanel → phpMyAdmin**

1. Cliquer sur la base créée dans la colonne de gauche
2. Onglet **Importer** → choisir le fichier `database/rifline.sql` → cliquer **Exécuter**

> Le fichier contient toutes les tables. L'import prend quelques secondes.

---

## ÉTAPE 2 — Backend (Node.js)

### 2a. Uploader les fichiers

Avec **FileZilla**, se connecter au serveur FTP O2switch.

Uploader le dossier `backend/` à la racine du compte (`/home/cpanelusername/`) en **excluant obligatoirement** :
- `node_modules/` ← ne jamais uploader, trop lourd et inutile
- `.env` ← les variables sont saisies directement dans cPanel

Fichiers indispensables à uploader :
```
/home/cpanelusername/backend/
  server.js          ← point d'entrée obligatoire
  package.json       ← liste des dépendances — obligatoire
  package-lock.json  ← versions exactes — obligatoire
  src/               ← tout le code
  uploads/
    products/        ← créer ce dossier vide manuellement dans FileZilla
    categories/      ← créer ce dossier vide manuellement dans FileZilla
```

> Pour créer un dossier dans FileZilla : clic droit dans le panneau droit → "Créer un dossier"

### 2b. Configurer l'application Node.js

**Dans cPanel → Setup Node.js App → Create Application**

| Champ | Valeur |
|---|---|
| Node.js version | **20.x** (ou la plus récente dispo) |
| Application mode | **Production** |
| Application root | `/home/cpanelusername/backend` |
| Application URL | `rif-line.com` |
| Application startup file | `server.js` |

Cliquer **Create**.

Ensuite cliquer **Run NPM Install** — O2switch lit le `package.json` et installe toutes les librairies automatiquement côté serveur. Il est impossible et inutile de le faire manuellement.

> Si le bouton **Run NPM Install** n'apparaît pas immédiatement, recharger la page cPanel.

### 2c. Variables d'environnement

Toujours dans **Setup Node.js App**, section **Environment variables**, ajouter une par une :

| Clé | Valeur |
|---|---|
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | `https://rif-line.com` |
| `DB_HOST` | `127.0.0.1` |
| `DB_PORT` | `3306` |
| `DB_USER` | `cpanelusername_rifline` |
| `DB_PASSWORD` | *(mot de passe créé à l'étape 1)* |
| `DB_NAME` | `cpanelusername_rifline` |
| `JWT_SECRET` | *(chaîne aléatoire — voir ci-dessous)* |
| `GMAIL_USER` | *(adresse Gmail du client)* |
| `GMAIL_APP_PASSWORD` | *(mot de passe d'application Google 16 chars)* |
| `SUMUP_API_KEY` | *(clé API SumUp production)* |
| `SUMUP_MERCHANT_CODE` | *(code marchand SumUp)* |
| `SUMUP_WEBHOOK_SECRET` | *(chaîne aléatoire — voir ci-dessous)* |
| `SENDCLOUD_PUBLIC_KEY` | *(clé publique Sendcloud)* |
| `SENDCLOUD_SECRET_KEY` | *(clé secrète Sendcloud)* |
| `SHOP_NAME` | `Rifline` |
| `SHOP_ADDRESS_LINE1` | *(adresse de la boutique)* |
| `SHOP_CITY` | *(ville)* |
| `SHOP_POSTAL_CODE` | *(code postal)* |
| `SHOP_COUNTRY_CODE` | `FR` |

**Générer JWT_SECRET et SUMUP_WEBHOOK_SECRET** — dans un terminal sur ton Mac :
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```
Lancer la commande deux fois, utiliser une valeur pour chaque.

Cliquer **Save** puis **Restart**.

### 2d. Vérifier que le backend fonctionne

Ouvrir dans le navigateur : `https://rif-line.com/api/health`

Réponse attendue : `{"status":"ok"}`

> Si erreur 502 : retourner dans Setup Node.js App → cliquer **Restart**

---

## ÉTAPE 3 — Frontend (React)

### 3a. Builder en local

Dans un terminal sur ton Mac, depuis la racine du projet :

```bash
cd frontend
npm run build
```

Le dossier `frontend/dist/` est créé. C'est ce dossier qui va sur le serveur.

### 3b. Uploader le contenu de dist/

Avec **FileZilla**, uploader **le contenu** du dossier `frontend/dist/` dans `/home/cpanelusername/public_html/`.

> Uploader le contenu, pas le dossier lui-même — `index.html` doit être directement dans `public_html/`.

### 3c. Uploader le .htaccess

Uploader le fichier `public_html/.htaccess` (déjà prêt dans le projet) dans `/home/cpanelusername/public_html/`.

> Ce fichier gère le routing React et la redirection vers le backend. Sans lui, toutes les pages sauf la home donnent une erreur 404.

---

## ÉTAPE 4 — SSL (HTTPS)

**Dans cPanel → SSL/TLS → Let's Encrypt SSL**

1. Sélectionner `rif-line.com` et `www.rif-line.com`
2. Cliquer **Issue** — le certificat est généré et renouvelé automatiquement

> Si le SSL est déjà actif sur O2switch (souvent automatique sur les offres Cloud), cette étape est déjà faite.

---

## ÉTAPE 5 — Compte admin

Aller sur `https://rif-line.com/register` et créer le compte admin avec l'email souhaité.

Puis dans **cPanel → phpMyAdmin**, cliquer sur la base → onglet **SQL**, exécuter :

```sql
UPDATE users SET role = 'admin' WHERE email = 'ali@rifline.com';
```

---

## ÉTAPE 6 — Webhook SumUp (paiement)

Dans le dashboard SumUp → **Développeurs → Webhooks → Ajouter** :

- URL : `https://rif-line.com/api/sumup/webhook`
- Événement : `CHECKOUT_STATUS_CHANGED`
- Secret : la valeur de `SUMUP_WEBHOOK_SECRET` saisie à l'étape 2c

---

## Checklist finale

Tester dans l'ordre après déploiement :

- [ ] `https://rif-line.com/api/health` → `{"status":"ok"}`
- [ ] Page d'accueil s'affiche
- [ ] Catalogue produits fonctionne
- [ ] Inscription + connexion fonctionnent
- [ ] Ajout au panier
- [ ] Checkout (adresse → livraison → paiement SumUp test)
- [ ] Email de confirmation reçu
- [ ] Reset mot de passe → email reçu
- [ ] Panel admin `/admin` accessible
- [ ] Upload d'image produit fonctionne

---

## Mettre à jour le site après la mise en ligne

### Modifier le backend
1. Uploader les fichiers modifiés via FileZilla dans `/home/cpanelusername/backend/`
2. cPanel → Setup Node.js App → **Restart**

### Modifier le frontend
1. `cd frontend && npm run build` en local
2. Uploader le nouveau contenu de `dist/` dans `public_html/` via FileZilla

---

## Problèmes fréquents

| Symptôme | Solution |
|---|---|
| `/api/health` → 502 | cPanel → Setup Node.js App → Restart |
| Page blanche ou 404 sur une route React | Vérifier que `.htaccess` est bien dans `public_html/` |
| Cookies / connexion ne fonctionnent pas | Vérifier que `FRONTEND_URL` = `https://rif-line.com` (sans slash final) |
| Images produits non affichées | Vérifier que les dossiers `uploads/products/` et `uploads/categories/` existent sur le serveur |
| Email non reçu | Vérifier `GMAIL_APP_PASSWORD` dans les variables d'env cPanel |
| Paiement SumUp échoue | Vérifier `SUMUP_MERCHANT_CODE` dans le dashboard SumUp → Profil marchand |
