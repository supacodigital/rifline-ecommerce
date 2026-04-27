// Logique métier de l'authentification
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const repo = require('../repositories/auth.repository');
const emailService = require('./email.service');

const RESET_TOKEN_TTL = 60 * 60 * 1000; // 1 heure en ms

const ACCESS_TOKEN_TTL  = '15m';
const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60 * 1000; // 7 jours en ms

function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_TTL }
  );
}

function generateRefreshToken() {
  return crypto.randomBytes(64).toString('hex');
}

async function register({ email, password, first_name, last_name }) {
  const existing = await repo.findUserByEmail(email);
  if (existing) {
    const err = new Error('Email déjà utilisé');
    err.status = 409;
    throw err;
  }

  const password_hash = await bcrypt.hash(password, 12);
  const userId = await repo.createUser({ email, password_hash, first_name, last_name });
  const user   = await repo.findUserById(userId);

  // Émettre les tokens directement après l'inscription — même comportement que login
  const accessToken  = generateAccessToken(user);
  const refreshToken = generateRefreshToken();
  const tokenHash    = crypto.createHash('sha256').update(refreshToken).digest('hex');
  const expiresAt    = new Date(Date.now() + REFRESH_TOKEN_TTL);
  await repo.saveRefreshToken({ user_id: user.id, token_hash: tokenHash, expires_at: expiresAt });

  return { user: { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name, role: user.role }, accessToken, refreshToken };
}

async function login({ email, password }) {
  const user = await repo.findUserByEmail(email);
  if (!user || user.deleted_at) {
    const err = new Error('Identifiants invalides');
    err.status = 401;
    throw err;
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    const err = new Error('Identifiants invalides');
    err.status = 401;
    throw err;
  }

  const accessToken  = generateAccessToken(user);
  const refreshToken = generateRefreshToken();
  const tokenHash    = crypto.createHash('sha256').update(refreshToken).digest('hex');
  const expiresAt    = new Date(Date.now() + REFRESH_TOKEN_TTL);

  await repo.saveRefreshToken({ user_id: user.id, token_hash: tokenHash, expires_at: expiresAt });

  return { user: { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name, role: user.role }, accessToken, refreshToken };
}

async function refresh(rawRefreshToken) {
  if (!rawRefreshToken) {
    const err = new Error('Refresh token manquant');
    err.status = 401;
    throw err;
  }

  const tokenHash = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');
  const stored    = await repo.findRefreshToken(tokenHash);
  if (!stored) {
    const err = new Error('Refresh token invalide ou expiré');
    err.status = 401;
    throw err;
  }

  const user = await repo.findUserById(stored.user_id);
  if (!user) {
    const err = new Error('Utilisateur introuvable');
    err.status = 401;
    throw err;
  }

  // Rotation du refresh token
  await repo.deleteRefreshToken(tokenHash);
  const newRefreshToken = generateRefreshToken();
  const newHash         = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
  const expiresAt       = new Date(Date.now() + REFRESH_TOKEN_TTL);
  await repo.saveRefreshToken({ user_id: user.id, token_hash: newHash, expires_at: expiresAt });

  const accessToken = generateAccessToken(user);
  return { accessToken, refreshToken: newRefreshToken };
}

async function logout(rawRefreshToken) {
  if (!rawRefreshToken) return;
  const tokenHash = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');
  await repo.deleteRefreshToken(tokenHash);
}

async function getMe(userId) {
  return repo.findUserById(userId);
}

async function forgotPassword(email) {
  const user = await repo.findUserByEmail(email);
  // Toujours répondre OK pour ne pas exposer si l'email existe en base
  if (!user || user.deleted_at) return;

  const rawToken  = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL);

  await repo.savePasswordResetToken({ user_id: user.id, token_hash: tokenHash, expires_at: expiresAt });
  await emailService.sendPasswordReset(user, rawToken);
}

async function resetPassword(rawToken, newPassword) {
  if (!newPassword || newPassword.length < 8) {
    const err = new Error('Le mot de passe doit contenir au moins 8 caractères');
    err.status = 400;
    throw err;
  }

  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const record    = await repo.findPasswordResetToken(tokenHash);

  if (!record) {
    const err = new Error('Lien invalide ou expiré');
    err.status = 400;
    throw err;
  }

  const password_hash = await bcrypt.hash(newPassword, 12);
  await repo.updatePassword(record.user_id, password_hash);
  await repo.markPasswordResetTokenUsed(tokenHash);
  // Invalider toutes les sessions actives par sécurité
  await repo.deleteAllRefreshTokens(record.user_id);
}

module.exports = { register, login, refresh, logout, getMe, forgotPassword, resetPassword };
