const repo = require('../repositories/wishlists.repository');

async function getWishlist(user_id) { return repo.findByUser(user_id); }
async function addToWishlist(user_id, product_id) { await repo.add(user_id, product_id); }
async function removeFromWishlist(user_id, product_id) { await repo.remove(user_id, product_id); }

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
