const slugify = require('slugify');
const repo = require('../repositories/categories.repository');

async function listCategories() {
  return repo.findAll();
}

async function getCategory(id) {
  const cat = await repo.findById(id);
  if (!cat) { const e = new Error('Catégorie introuvable'); e.status = 404; throw e; }
  return cat;
}

async function createCategory(data) {
  const slug = slugify(data.name_fr, { lower: true, strict: true });
  const id = await repo.create({ ...data, slug });
  return repo.findById(id);
}

async function updateCategory(id, data) {
  const cat = await repo.findById(id);
  if (!cat) { const e = new Error('Catégorie introuvable'); e.status = 404; throw e; }
  if (data.name_fr && data.name_fr !== cat.name_fr) {
    data.slug = slugify(data.name_fr, { lower: true, strict: true });
  }
  await repo.update(id, data);
}

async function deleteCategory(id) {
  const cat = await repo.findById(id);
  if (!cat) { const e = new Error('Catégorie introuvable'); e.status = 404; throw e; }
  await repo.softDelete(id);
}

module.exports = { listCategories, getCategory, createCategory, updateCategory, deleteCategory };
