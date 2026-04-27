const service = require('../services/orders.service');

async function create(req, res, next) {
  try {
    const order = await service.createOrder({ user_id: req.user.id, ...req.body });
    res.status(201).json({ order });
  } catch (err) { next(err); }
}

async function show(req, res, next) {
  try {
    const order = await service.getOrder(Number(req.params.id), req.user.id, req.user.role);
    res.json({ order });
  } catch (err) { next(err); }
}

async function myOrders(req, res, next) {
  try {
    const orders = await service.listUserOrders(req.user.id);
    res.json({ orders });
  } catch (err) { next(err); }
}

// Admin
async function adminList(req, res, next) {
  try {
    const result = await service.listAllOrders(req.query);
    res.json(result);
  } catch (err) { next(err); }
}

async function adminUpdateStatus(req, res, next) {
  try {
    const { status, ...extra } = req.body;
    await service.updateOrderStatus(Number(req.params.id), status, extra);
    res.json({ ok: true });
  } catch (err) { next(err); }
}

module.exports = { create, show, myOrders, adminList, adminUpdateStatus };
