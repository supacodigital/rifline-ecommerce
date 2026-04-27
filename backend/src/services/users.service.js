const bcrypt = require('bcryptjs');
const repo = require('../repositories/users.repository');

async function getProfile(id) {
  const user = await repo.findById(id);
  if (!user) { const e = new Error('Utilisateur introuvable'); e.status = 404; throw e; }
  return user;
}

async function updateProfile(id, data) {
  await repo.update(id, data);
}

async function changePassword(id, { current_password, new_password }) {
  if (!new_password || new_password.length < 8) {
    const e = new Error('Le nouveau mot de passe doit contenir au moins 8 caractères'); e.status = 400; throw e;
  }
  const user = await repo.findPasswordHash(id);
  if (!user) { const e = new Error('Utilisateur introuvable'); e.status = 404; throw e; }
  const valid = await bcrypt.compare(current_password, user.password_hash);
  if (!valid) { const e = new Error('Mot de passe actuel incorrect'); e.status = 400; throw e; }
  const hash = await bcrypt.hash(new_password, 12);
  await repo.updatePassword(id, hash);
}

async function getAddresses(user_id) {
  return repo.getAddresses(user_id);
}

async function addAddress(user_id, data) {
  if (data.is_default) await repo.clearDefault(user_id);
  const id = await repo.createAddress({ ...data, user_id });
  return repo.findAddress(id, user_id);
}

async function editAddress(user_id, address_id, data) {
  const addr = await repo.findAddress(address_id, user_id);
  if (!addr) { const e = new Error('Adresse introuvable'); e.status = 404; throw e; }
  if (data.is_default) await repo.clearDefault(user_id);
  await repo.updateAddress(address_id, data);
}

async function removeAddress(user_id, address_id) {
  const addr = await repo.findAddress(address_id, user_id);
  if (!addr) { const e = new Error('Adresse introuvable'); e.status = 404; throw e; }
  await repo.deleteAddress(address_id);
}

async function listUsers(filters) {
  return repo.findAllUsers(filters);
}

module.exports = { getProfile, updateProfile, changePassword, getAddresses, addAddress, editAddress, removeAddress, listUsers };
