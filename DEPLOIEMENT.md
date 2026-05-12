# Déploiement RifLine — rif-line.com (O2switch)

Tout se fait depuis le **cPanel O2switch** et **FileZilla** (FTP). Aucune ligne de commande requise côté serveur.

---

## Ce qu'il faut avoir sous la main

- Identifiants cPanel O2switch du client
- FileZilla (FTP) — [filezilla-project.org](https://filezilla-project.org)
- Le mot de passe d'application Gmail du client (16 caractères)
- Les clés API SumUp et Sendcloud de **production** (pas sandbox)

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

> Le fichier contient uniquement le schéma (tables, index). Aucune donnée de session ni compte utilisateur n'est importé — tout est créé manuellement.

---

## ÉTAPE 2 — Backend (Node.js)

### 2a. Uploader les fichiers

Avec **FileZilla**, se connecter au serveur FTP O2switch.

Uploader le dossier `backend/` à la racine du compte (`/home/cpanelusername/`) en **excluant obligatoirement** :
- `node_modules/` ← ne jamais uploader, trop lourd et inutile
- `.env` ← les variables sont saisies directement dans cPanel, jamais de fichier .env sur le serveur

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
| Application URL | `rif-line.com` ← **sans** `api.` devant, toujours le domaine racine |
| Application startup file | `server.js` |

Cliquer **Create**.

Ensuite cliquer **Run NPM Install** — O2switch lit le `package.json` et installe toutes les librairies automatiquement côté serveur.

> Si le bouton **Run NPM Install** n'apparaît pas immédiatement, recharger la page cPanel.

### 2c. Variables d'environnement

Toujours dans **Setup Node.js App**, section **Environment variables**, ajouter une par une.

> **Le backend refuse de démarrer si l'une de ces variables est absente** : `FRONTEND_URL`, `JWT_SECRET`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.

| Clé | Valeur |
|---|---|
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | `https://rif-line.com` ← sans slash final, doit correspondre exactement |
| `DB_HOST` | `127.0.0.1` |
| `DB_PORT` | `3306` |
| `DB_USER` | `cpanelusername_rifline` |
| `DB_PASSWORD` | *(mot de passe créé à l'étape 1)* |
| `DB_NAME` | `cpanelusername_rifline` |
| `JWT_SECRET` | *(chaîne aléatoire longue — voir ci-dessous)* |
| `GMAIL_USER` | *(adresse Gmail du client)* |
| `GMAIL_APP_PASSWORD` | *(mot de passe d'application Google 16 chars)* |
| `SUMUP_API_KEY` | *(clé API SumUp production)* |
| `SUMUP_MERCHANT_CODE` | *(code marchand SumUp — dashboard SumUp → Profil marchand)* |
| `SUMUP_WEBHOOK_SECRET` | *(chaîne aléatoire — voir ci-dessous)* |
| `SENDCLOUD_PUBLIC_KEY` | *(clé publique Sendcloud production)* |
| `SENDCLOUD_SECRET_KEY` | *(clé secrète Sendcloud production)* |
| `SHOP_NAME` | `Rifline` |
| `SHOP_ADDRESS_LINE1` | *(adresse de la boutique)* |
| `SHOP_CITY` | *(ville)* |
| `SHOP_POSTAL_CODE` | *(code postal)* |
| `SHOP_COUNTRY_CODE` | `FR` |

**Générer JWT_SECRET et SUMUP_WEBHOOK_SECRET** — dans un terminal sur ton Mac, lancer deux fois :
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```
Utiliser une valeur pour `JWT_SECRET`, une autre pour `SUMUP_WEBHOOK_SECRET`.

Cliquer **Save** puis **Restart**.

### 2d. Vérifier que le backend fonctionne

Ouvrir dans le navigateur : `https://rif-line.com/api/health`

Réponse attendue : `{"status":"ok"}`

> Si erreur 502 : retourner dans Setup Node.js App → cliquer **Restart**. Attendre 30 secondes puis recharger.

---

## ÉTAPE 3 — Frontend (React)

### 3a. Builder en local

> **Ne pas builder depuis le terminal cPanel** — manque de mémoire. Toujours builder sur ton Mac.

S'assurer que `frontend/.env` ne contient **pas** de ligne `VITE_API_URL` active (elle doit être commentée). Le frontend utilise l'URL relative `/api` en production — Apache redirige vers le backend.

Dans un terminal sur ton Mac, depuis la racine du projet :

```bash
cd frontend
npm run build
```

Le dossier `frontend/dist/` est créé. C'est ce dossier qui va sur le serveur.

### 3b. Uploader le contenu de dist/

Avec **FileZilla**, uploader **le contenu** du dossier `frontend/dist/` dans `/home/cpanelusername/public_html/`.

> Uploader le contenu, pas le dossier lui-même — `index.html` doit être directement dans `public_html/`, pas dans un sous-dossier `dist/`.

### 3c. Uploader le .htaccess

Uploader le fichier `public_html/.htaccess` (à la racine du projet) dans `/home/cpanelusername/public_html/`.

> Ce fichier gère : la redirection HTTPS, www → non-www, le routing React (SPA), et le passage des `/api/*` vers Passenger. Sans lui, toutes les pages sauf la home donnent une erreur 404.

---

## ÉTAPE 4 — SSL (HTTPS)

**Dans cPanel → SSL/TLS → Let's Encrypt SSL**

1. Sélectionner `rif-line.com` et `www.rif-line.com`
2. Cliquer **Issue** — le certificat est généré et renouvelé automatiquement

> Sur les offres Cloud O2switch, le SSL est souvent déjà activé automatiquement. Vérifier en ouvrant `https://rif-line.com` dans le navigateur.

---

## ÉTAPE 5 — Compte admin

1. Aller sur `https://rif-line.com/register` et créer le compte admin avec l'email souhaité
2. Dans **cPanel → phpMyAdmin**, cliquer sur la base → onglet **SQL**, exécuter :

```sql
UPDATE users SET role = 'admin' WHERE email = 'ali@rifline.com';
```

> Ne pas importer de compte depuis le fichier SQL — il ne contient plus de données utilisateur.

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
- [ ] Page d'accueil s'affiche correctement
- [ ] Catalogue produits fonctionne
- [ ] Inscription + connexion fonctionnent
- [ ] Ajout au panier
- [ ] Checkout complet (adresse → livraison → paiement SumUp)
- [ ] Email de confirmation reçu après commande
- [ ] Reset mot de passe → email reçu avec lien valide
- [ ] Panel admin `/admin` accessible
- [ ] Upload d'image produit fonctionne
- [ ] Images uploadées s'affichent sur les pages produit

---

## Mettre à jour le site après la mise en ligne

### Modifier le backend
1. Uploader les fichiers modifiés via FileZilla dans `/home/cpanelusername/backend/`
2. cPanel → Setup Node.js App → **Restart**

### Modifier le frontend
1. `cd frontend && npm run build` en local (vérifier que `VITE_API_URL` n'est pas défini dans `.env`)
2. Uploader le nouveau contenu de `dist/` dans `public_html/` via FileZilla (remplacer les anciens fichiers)

### Modifier la base de données
Appliquer le fichier SQL dans phpMyAdmin **avant** de déployer le code qui en dépend.

---

## Problèmes fréquents

| Symptôme | Solution |
|---|---|
| `/api/health` → 502 | cPanel → Setup Node.js App → Restart. Vérifier que **Application URL** = `rif-line.com` (pas `api.rif-line.com`) |
| Backend ne démarre pas (logs Passenger) | Une variable d'env obligatoire est manquante (`FRONTEND_URL`, `JWT_SECRET`, `DB_*`). Vérifier dans Setup Node.js App → Environment variables |
| URLs API invalides (`api.rif-line.com/api:3000/...`) | `VITE_API_URL` était défini dans `frontend/.env` au moment du build. Commenter la ligne, rebuilder et re-uploader `dist/` |
| Page blanche ou 404 sur une route React | Vérifier que `.htaccess` est bien dans `public_html/` (pas dans un sous-dossier) |
| Cookies / connexion ne fonctionnent pas | Vérifier que `FRONTEND_URL` = `https://rif-line.com` (sans slash final, avec https) |
| Images produits non affichées | Vérifier que les dossiers `uploads/products/` et `uploads/categories/` existent dans `/home/cpanelusername/backend/` |
| Email non reçu | Vérifier `GMAIL_APP_PASSWORD` dans les variables d'env cPanel. Le mot de passe d'application Google se génère dans Compte Google → Sécurité → Mots de passe des applications |
| Paiement SumUp échoue | Vérifier `SUMUP_MERCHANT_CODE` dans le dashboard SumUp → Profil marchand |
| Livraison Sendcloud indisponible | Régénérer les clés API dans le dashboard Sendcloud et mettre à jour `SENDCLOUD_PUBLIC_KEY` / `SENDCLOUD_SECRET_KEY` dans cPanel |
