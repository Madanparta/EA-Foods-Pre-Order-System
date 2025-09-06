import orderService from '../services/orderService.js';
import {
  checkIdempotency,
  storeIdempotencyKey,
  getIdempotencyResponse,
} from '../utils/idempotency.js';

export async function createOrder(req, res, next) {
  try {
    const idempotencyKey = req.headers['idempotency-key'];

    if (idempotencyKey && checkIdempotency(idempotencyKey)) {
      const cachedResponse = getIdempotencyResponse(idempotencyKey);
      return res.status(200).json({
        status: 200,
        message: 'Order already processed (idempotent)',
        data: cachedResponse,
      });
    }

    const order = await orderService.createOrder(req.body, idempotencyKey);

    if (idempotencyKey) {
      storeIdempotencyKey(idempotencyKey, order);
    }

    res.status(201).json({
      status: 201,
      message: 'Order created successfully',
      data: order,
    });
    } catch (error) {
      res.status(error.status || 500).json({
        status: error.status || 500,
        error: error.message || 'Internal Server Error',
      });
  }
}

export async function getOrder(req, res, next) {
  try {
    const { id } = req.params;
    const order = await orderService.getOrderById(id);

    if (!order) {
      return res.status(404).json({ status: 404, error: 'Order not found' });
    }

    res.status(200).json({
      status: 200,
      message: 'Order fetched successfully',
      data: order,
    });
    } catch (error) {
      res.status(error.status || 500).json({
        status: error.status || 500,
        error: error.message || 'Internal Server Error',
      });
  }
}

export async function getOrderByOrderId(req, res, next) {
  try {
    const { orderId } = req.params;
    const order = await orderService.getOrderByOrderId(orderId);

    if (!order) {
      return res.status(404).json({ status: 404, error: 'Order not found' });
    }

    res.status(200).json({
      status: 200,
      message: 'Order fetched successfully by Order ID',
      data: order,
    });
    } catch (error) {
      res.status(error.status || 500).json({
        status: error.status || 500,
        error: error.message || 'Internal Server Error',
      });
  }
}

export async function getOrders(req, res, next) {
  try {
    const result = await orderService.getAllOrders(req.query, req.query.page, req.query.limit);

    res.status(200).json({
      status: 200,
      message: 'Orders fetched successfully',
      data: result,
    });
    } catch (error) {
      res.status(error.status || 500).json({
        status: error.status || 500,
        error: error.message || 'Internal Server Error',
      });
  }
}

export async function cancelOrder(req, res, next) {
  try {
    const { orderId } = req.params;
    const order = await orderService.cancelOrder(orderId);

    res.status(200).json({
      status: 200,
      message: 'Order cancelled successfully',
      data: order,
    });
    } catch (error) {
      res.status(error.status || 500).json({
        status: error.status || 500,
        error: error.message || 'Internal Server Error',
      });
  }
}

export async function getOrdersByDeliveryDate(req, res, next) {
  try {
    const { date } = req.params;
    const orders = await orderService.getOrdersByDeliveryDate(date);

    res.status(200).json({
      status: 200,
      message: 'Orders fetched successfully by delivery date',
      data: {
        date,
        count: orders.length,
        orders,
      },
    });
    } catch (error) {
      res.status(error.status || 500).json({
        status: error.status || 500,
        error: error.message || 'Internal Server Error',
      });
  }
}

export async function getDailySummary(req, res, next) {
  try {
    const { date } = req.params;
    const summary = await orderService.getDailyOrderSummary(date);

    res.status(200).json({
      status: 200,
      message: 'Daily summary fetched successfully',
      data: summary,
    });
    } catch (error) {
      res.status(error.status || 500).json({
        status: error.status || 500,
        error: error.message || 'Internal Server Error',
      });
  }
}
