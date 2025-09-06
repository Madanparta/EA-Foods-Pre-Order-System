import { Order, Product, StockUpdate } from '../models/index.js';
import { calculateDeliveryDate, formatDate } from '../utils/helpers.js';
import { ORDER_STATUS } from '../utils/constants.js';
import { Op } from 'sequelize';

export async function createOrder(orderData, idempotencyKey = null) {
  const {
    customerName,
    customerType,
    productId,
    quantity,
    deliverySlot,
    orderDate = new Date(),
  } = orderData;

  const product = await Product.findById(productId);

  if (!product) throw new Error('Product not found');
  if (!product.isActive) throw new Error('Product is not available');
  if (product.currentStock < quantity) throw new Error('Insufficient stock');

  const totalAmount = product.price * quantity;
  const deliveryDate = calculateDeliveryDate(orderDate);

  const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`.toUpperCase();

  const order = await Order.create({
    orderId,
    customerName,
    customerType,
    productId,
    quantity,
    totalAmount,
    deliveryDate,
    deliverySlot: deliverySlot.toUpperCase(),
    status: ORDER_STATUS.CONFIRMED,
    orderDate,
    idempotencyKey,
  });

  const previousStock = product.currentStock;
  const newStock = previousStock - quantity;
  await product.update({ currentStock: newStock });

  await StockUpdate.create({
    productId,
    previousStock,
    newStock,
    updatedBy: `ORDER_${orderId}`,
    updateType: 'ORDER',
    notes: `Order placed: ${orderId}`,
  });

  return order;
}

export async function getOrderById(id) {
  return await Order.findByPk(id, {
    include: [{
      model: Product,
      attributes: ['id', 'name', 'sku', 'price'],
    }],
  });
}

export async function getOrderByOrderId(orderId) {
  return await Order.findOne({
    where: { orderId },
    include: [{
      model: Product,
      attributes: ['id', 'name', 'sku', 'price'],
    }],
  });
}

export async function getAllOrders(filters = {}, page = 1, limit = 10) {
  const whereClause = {};

  if (filters.status) {
    whereClause.status = filters.status;
  }

  if (filters.customerType) {
    whereClause.customerType = filters.customerType;
  }

  if (filters.deliveryDate) {
    whereClause.deliveryDate = formatDate(filters.deliveryDate);
  }

  if (filters.orderDateFrom && filters.orderDateTo) {
    whereClause.orderDate = {
      [Op.between]: [new Date(filters.orderDateFrom), new Date(filters.orderDateTo)],
    };
  }

  const offset = (page - 1) * limit;

  const { count, rows } = await Order.findAndCountAll({
    where: whereClause,
    limit: parseInt(limit),
    offset,
    include: [{
      model: Product,
      attributes: ['id', 'name', 'sku'],
    }],
    order: [['orderDate', 'DESC']],
  });

  return {
    orders: rows,
    total: count,
    page: parseInt(page),
    totalPages: Math.ceil(count / limit),
  };
}

export async function cancelOrder(orderId) {
  const order = await Order.findOne({ where: { orderId } });

  if (!order) throw new Error('Order not found');
  if (order.status === ORDER_STATUS.CANCELLED) throw new Error('Order is already cancelled');
  if (order.status === ORDER_STATUS.DELIVERED) throw new Error('Cannot cancel delivered order');

  order.status = ORDER_STATUS.CANCELLED;
  await order.save();

  const product = await Product.findByPk(order.productId);
  const previousStock = product.currentStock;
  const newStock = previousStock + order.quantity;

  await product.update({ currentStock: newStock });

  await StockUpdate.create({
    productId: order.productId,
    previousStock,
    newStock,
    updatedBy: `ORDER_${orderId}`,
    updateType: 'CANCELLATION',
    notes: `Order cancelled: ${orderId}`,
  });

  return order;
}

export async function getOrdersByDeliveryDate(deliveryDate) {
  return await Order.findAll({
    where: {
      deliveryDate: formatDate(deliveryDate),
      status: { [Op.ne]: ORDER_STATUS.CANCELLED },
    },
    include: [{
      model: Product,
      attributes: ['id', 'name', 'sku'],
    }],
    order: [['deliverySlot', 'ASC']],
  });
}

export async function getDailyOrderSummary(date = new Date()) {
  const formattedDate = formatDate(date);

  const orders = await Order.findAll({
    where: {
      deliveryDate: formattedDate,
      status: { [Op.ne]: ORDER_STATUS.CANCELLED },
    },
    include: [{
      model: Product,
      attributes: ['id', 'name', 'category'],
    }],
  });

  const summary = {
    date: formattedDate,
    totalOrders: orders.length,
    totalQuantity: 0,
    totalRevenue: 0,
    bySlot: {
      MORNING: { orders: 0, quantity: 0, revenue: 0 },
      AFTERNOON: { orders: 0, quantity: 0, revenue: 0 },
      EVENING: { orders: 0, quantity: 0, revenue: 0 },
    },
    byCategory: {},
  };

  orders.forEach(order => {
    const slot = order.deliverySlot;
    const amount = parseFloat(order.totalAmount);
    const category = order.Product.category;

    summary.totalQuantity += order.quantity;
    summary.totalRevenue += amount;

    summary.bySlot[slot].orders += 1;
    summary.bySlot[slot].quantity += order.quantity;
    summary.bySlot[slot].revenue += amount;

    if (!summary.byCategory[category]) {
      summary.byCategory[category] = { orders: 0, quantity: 0, revenue: 0 };
    }

    summary.byCategory[category].orders += 1;
    summary.byCategory[category].quantity += order.quantity;
    summary.byCategory[category].revenue += amount;
  });

  return summary;
}


export default {
  createOrder,
  getOrderById,
  getOrderByOrderId,
  getAllOrders,
  cancelOrder,
  getOrdersByDeliveryDate,
  getDailyOrderSummary,
};
