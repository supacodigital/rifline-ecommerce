// Contrôleur Produits
const path = require('path');
const service = require('../services/products.service');

const UPLOADS_DIR = path.join(__dirname, '../../uploads/products');

async function list(req, res, next) {
  try {
    const { category_id, min_price, max_price, tag, search, limit, offset } = req.query;
    const result = await service.listProducts({ category_id, min_price, max_price, tag, search, limit, offset });
    res.json(result);
  } catch (err) { next(err); }
}

async function show(req, res, next) {
  try {
    const product = await service.getProduct(req.params.slug);
    res.json({ product });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const product = await service.createProduct(req.body);
    res.status(201).json({ product });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    await service.updateProduct(Number(req.params.id), req.body);
    res.json({ ok: true });
  } catch (err) { next(err); }
}

async function destroy(req, res, next) {
  try {
    await service.deleteProduct(Number(req.params.id));
    res.json({ ok: true });
  } catch (err) { next(err); }
}

async function uploadImage(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ error: 'Aucun fichier reçu' });
    const result = await service.addImage(Number(req.params.id), req.file, { is_cover: req.body.is_cover === 'true' });
    res.status(201).json(result);
  } catch (err) { next(err); }
}

async function deleteImage(req, res, next) {
  try {
    await service.removeImage(Number(req.params.imageId), UPLOADS_DIR);
    res.json({ ok: true });
  } catch (err) { next(err); }
}

async function setCover(req, res, next) {
  try {
    await service.setCoverImage(Number(req.params.id), Number(req.params.imageId));
    res.json({ ok: true });
  } catch (err) { next(err); }
}

async function listVariants(req, res, next) {
  try {
    const variants = await service.listVariants(Number(req.params.id));
    res.json({ variants });
  } catch (err) { next(err); }
}

async function createVariant(req, res, next) {
  try {
    const variant = await service.addVariant(Number(req.params.id), req.body);
    res.status(201).json({ variant });
  } catch (err) { next(err); }
}

async function updateVariant(req, res, next) {
  try {
    const variant = await service.editVariant(Number(req.params.id), Number(req.params.variantId), req.body);
    res.json({ variant });
  } catch (err) { next(err); }
}

async function deleteVariant(req, res, next) {
  try {
    await service.removeVariant(Number(req.params.id), Number(req.params.variantId));
    res.json({ ok: true });
  } catch (err) { next(err); }
}

async function uploadVariantImage(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ error: 'Aucun fichier reçu' });
    const variant = await service.setVariantImage(Number(req.params.id), Number(req.params.variantId), req.file, UPLOADS_DIR);
    res.json({ variant });
  } catch (err) { next(err); }
}

async function deleteVariantImage(req, res, next) {
  try {
    await service.removeVariantImage(Number(req.params.id), Number(req.params.variantId), UPLOADS_DIR);
    res.json({ ok: true });
  } catch (err) { next(err); }
}

module.exports = { list, show, create, update, destroy, uploadImage, deleteImage, setCover, listVariants, createVariant, updateVariant, deleteVariant, uploadVariantImage, deleteVariantImage };
