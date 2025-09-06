import orderService from '../services/orderService.js';
import {
  checkIdempotency,
  storeIdempotencyKey,
  getIdempotencyResponse,
} from '../utils/idempotency.js';

// Create a new order
export async function createOrder(req, res, next) {
  try {
    const idempotencyKey = req.headers['idempotency-key'];

    if (idempotencyKey && checkIdempotency(idempotencyKey)) {
      const cachedResponse = getIdempotencyResponse(idempotencyKey);
      return res.status(200).json(cachedResponse);
    }

    const order = await orderService.createOrder(req.body, idempotencyKey);

    if (idempotencyKey) {
      storeIdempotencyKey(idempotencyKey, order);
    }

    res.status(201).json({
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    next(error);
  }
}

export async function getOrder(req, res, next) {
  try {
    const { id } = req.params;
    const order = await orderService.getOrderById(id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order });
  } catch (error) {
    next(error);
  }
}

export async function getOrderByOrderId(req, res, next) {
  try {
    const { orderId } = req.params;
    const order = await orderService.getOrderByOrderId(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order });
  } catch (error) {
    next(error);
  }
}

export async function getOrders(req, res, next) {
  try {
    const result = await orderService.getAllOrders(req.query, req.query.page, req.query.limit);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function cancelOrder(req, res, next) {
  try {
    const { orderId } = req.params;
    const order = await orderService.cancelOrder(orderId);

    res.json({
      message: 'Order cancelled successfully',
      order,
    });
  } catch (error) {
    next(error);
  }
}

export async function getOrdersByDeliveryDate(req, res, next) {
  try {
    const { date } = req.params;
    const orders = await orderService.getOrdersByDeliveryDate(date);

    res.json({
      date,
      orders,
      count: orders.length,
    });
  } catch (error) {
    next(error);
  }
}

export async function getDailySummary(req, res, next) {
  try {
    const { date } = req.params;
    const summary = await orderService.getDailyOrderSummary(date);

    res.json(summary);
  } catch (error) {
    next(error);
  }
}