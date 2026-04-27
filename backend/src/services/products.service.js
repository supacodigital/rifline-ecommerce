// Logique métier — produits
const slugify = require('slugify');
const repo = require('../repositories/products.repository');
const path = require('path');
const fs = require('fs');

const MAX_IMAGES = 5;

async function listProducts(filters) {
  // Les tags sont déjà inclus via GROUP_CONCAT dans findAll — pas de N+1
  const { rows, total } = await repo.findAll(filters);
  return { products: rows, total };
}

async function getProduct(slug) {
  const product = await repo.findBySlug(slug);
  if (!product) {
    const err = new Error('Produit introuvable');
    err.status = 404;
    throw err;
  }
  product.images    = await repo.getImages(product.id);
  product.tags      = await repo.getTags(product.id);
  product.cover_url = product.images.find(i => i.is_cover)?.url || product.images[0]?.url || null;
  return product;
}

async function createProduct(data) {
  const slug = slugify(data.name_fr, { lower: true, strict: true });
  const id = await repo.create({ ...data, slug });

  if (data.tags?.length) {
    await repo.setTags(id, data.tags);
  }

  return repo.findById(id);
}

async function updateProduct(id, data) {
  const product = await repo.findById(id);
  if (!product) {
    const err = new Error('Produit introuvable');
    err.status = 404;
    throw err;
  }

  if (data.name_fr && data.name_fr !== product.name_fr) {
    data.slug = slugify(data.name_fr, { lower: true, strict: true });
  }

  await repo.update(id, data);

  if (Array.isArray(data.tags)) {
    await repo.setTags(id, data.tags);
  }
}

async function deleteProduct(id) {
  const product = await repo.findById(id);
  if (!product) {
    const err = new Error('Produit introuvable');
    err.status = 404;
    throw err;
  }
  await repo.softDelete(id);
}

async function addImage(product_id, file, { is_cover = false } = {}) {
  const count = await repo.countImages(product_id);
  if (count >= MAX_IMAGES) {
    const err = new Error(`Maximum ${MAX_IMAGES} images par produit`);
    err.status = 400;
    throw err;
  }
  const url = `/uploads/products/${file.filename}`;
  const id  = await repo.addImage({ product_id, url, sort_order: count, is_cover });
  return { id, url };
}

async function removeImage(image_id, uploadsDir) {
  const [rows] = await require('../config/db').query('SELECT url FROM product_images WHERE id = ?', [image_id]);
  if (rows[0]) {
    const filepath = path.join(uploadsDir, path.basename(rows[0].url));
    fs.unlink(filepath, () => {});
  }
  await repo.deleteImage(image_id);
}

async function setCoverImage(product_id, image_id) {
  await repo.setCover(product_id, image_id);
}

module.exports = { listProducts, getProduct, createProduct, updateProduct, deleteProduct, addImage, removeImage, setCoverImage };
