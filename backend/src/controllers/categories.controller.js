const path    = require('path');
const fs      = require('fs');
const service = require('../services/categories.service');
const repo    = require('../repositories/categories.repository');

const UPLOADS_DIR = path.join(__dirname, '../../uploads/categories');

async function list(req, res, next) {
  try { res.json(await service.listCategories()); } catch (err) { next(err); }
}

async function show(req, res, next) {
  try { res.json(await service.getCategory(Number(req.params.id))); } catch (err) { next(err); }
}

async function create(req, res, next) {
  try { res.status(201).json(await service.createCategory(req.body)); } catch (err) { next(err); }
}

async function update(req, res, next) {
  try { await service.updateCategory(Number(req.params.id), req.body); res.json({ ok: true }); } catch (err) { next(err); }
}

async function destroy(req, res, next) {
  try { await service.deleteCategory(Number(req.params.id)); res.json({ ok: true }); } catch (err) { next(err); }
}

async function uploadImage(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ error: 'Aucun fichier reçu' });
    const id  = Number(req.params.id);
    const cat = await repo.findById(id);
    if (!cat) return res.status(404).json({ error: 'Catégorie introuvable' });

    // Supprimer l'ancienne image si elle existe
    if (cat.image_url) {
      const old = path.join(UPLOADS_DIR, path.basename(cat.image_url));
      if (fs.existsSync(old)) fs.unlinkSync(old);
    }

    const imageUrl = `/uploads/categories/${req.file.filename}`;
    await repo.update(id, { image_url: imageUrl });
    res.json({ image_url: imageUrl });
  } catch (err) { next(err); }
}

async function deleteImage(req, res, next) {
  try {
    const id  = Number(req.params.id);
    const cat = await repo.findById(id);
    if (!cat) return res.status(404).json({ error: 'Catégorie introuvable' });
    if (cat.image_url) {
      const file = path.join(UPLOADS_DIR, path.basename(cat.image_url));
      if (fs.existsSync(file)) fs.unlinkSync(file);
    }
    await repo.update(id, { image_url: null });
    res.json({ ok: true });
  } catch (err) { next(err); }
}

module.exports = { list, show, create, update, destroy, uploadImage, deleteImage };
