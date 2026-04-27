// Toutes les requêtes SQL liées à l'authentification
const db = require('../config/db');

async function findUserByEmail(email) {
  const [rows] = await db.query(
    'SELECT id, email, password_hash, first_name, last_name, role, is_verified, deleted_at FROM users WHERE email = ?',
    [email]
  );
  return rows[0] || null;
}

async function createUser({ email, password_hash, first_name, last_name }) {
  const [result] = await db.query(
    'INSERT INTO users (email, password_hash, first_name, last_name) VALUES (?, ?, ?, ?)',
    [email, password_hash, first_name, last_name]
  );
  return result.insertId;
}

async function saveRefreshToken({ user_id, token_hash, expires_at }) {
  await db.query(
    'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
    [user_id, token_hash, expires_at]
  );
}

async function findRefreshToken(token_hash) {
  const [rows] = await db.query(
    'SELECT * FROM refresh_tokens WHERE token_hash = ? AND expires_at > NOW()',
    [token_hash]
  );
  return rows[0] || null;
}

async function deleteRefreshToken(token_hash) {
  await db.query('DELETE FROM refresh_tokens WHERE token_hash = ?', [token_hash]);
}

async function deleteAllRefreshTokens(user_id) {
  await db.query('DELETE FROM refresh_tokens WHERE user_id = ?', [user_id]);
}

async function findUserById(id) {
  const [rows] = await db.query(
    'SELECT id, email, first_name, last_name, phone, role, is_verified FROM users WHERE id = ? AND deleted_at IS NULL',
    [id]
  );
  return rows[0] || null;
}

async function savePasswordResetToken({ user_id, token_hash, expires_at }) {
  // Invalider les tokens précédents non utilisés pour cet utilisateur
  await db.query('DELETE FROM password_reset_tokens WHERE user_id = ? AND used_at IS NULL', [user_id]);
  await db.query(
    'INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
    [user_id, token_hash, expires_at]
  );
}

async function findPasswordResetToken(token_hash) {
  const [rows] = await db.query(
    'SELECT * FROM password_reset_tokens WHERE token_hash = ? AND expires_at > NOW() AND used_at IS NULL',
    [token_hash]
  );
  return rows[0] || null;
}

async function markPasswordResetTokenUsed(token_hash) {
  await db.query('UPDATE password_reset_tokens SET used_at = NOW() WHERE token_hash = ?', [token_hash]);
}

async function updatePassword(user_id, password_hash) {
  await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [password_hash, user_id]);
}

module.exports = {
  findUserByEmail,
  createUser,
  saveRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
  deleteAllRefreshTokens,
  findUserById,
  savePasswordResetToken,
  findPasswordResetToken,
  markPasswordResetTokenUsed,
  updatePassword,
};
