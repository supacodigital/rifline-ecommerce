const service = require('../services/users.service');

async function getProfile(req, res, next) {
  try { res.json(await service.getProfile(req.user.id)); } catch (err) { next(err); }
}

async function updateProfile(req, res, next) {
  try { await service.updateProfile(req.user.id, req.body); res.json({ ok: true }); } catch (err) { next(err); }
}

async function changePassword(req, res, next) {
  try { await service.changePassword(req.user.id, req.body); res.json({ ok: true }); } catch (err) { next(err); }
}

async function listAddresses(req, res, next) {
  try { res.json(await service.getAddresses(req.user.id)); } catch (err) { next(err); }
}

async function addAddress(req, res, next) {
  try { res.status(201).json(await service.addAddress(req.user.id, req.body)); } catch (err) { next(err); }
}

async function updateAddress(req, res, next) {
  try { await service.editAddress(req.user.id, Number(req.params.id), req.body); res.json({ ok: true }); } catch (err) { next(err); }
}

async function deleteAddress(req, res, next) {
  try { await service.removeAddress(req.user.id, Number(req.params.id)); res.json({ ok: true }); } catch (err) { next(err); }
}

// Admin
async function adminList(req, res, next) {
  try { res.json(await service.listUsers(req.query)); } catch (err) { next(err); }
}

module.exports = { getProfile, updateProfile, changePassword, listAddresses, addAddress, updateAddress, deleteAddress, adminList };
