import express from 'express';
const router = express.Router();

import * as orderController from '../controllers/orderController.js';
import {validateOrder,validateQuery,} from '../middleware/validation.js';
import {authenticate, authorize,} from '../middleware/auth.js';

// All routes require authentication
router.use(authenticate);

// Create a new order
router.post('/', validateOrder, orderController.createOrder);

// Get order by ID
router.get('/:id', orderController.getOrder);

// Get order by order ID
router.get('/order-id/:orderId', orderController.getOrderByOrderId);

// Get all orders with filtering
router.get('/', validateQuery, orderController.getOrders);

// Cancel an order
router.patch('/:orderId/cancel', orderController.cancelOrder);

// Get orders for a specific delivery date (Ops Manager only)
router.get('/delivery-date/:date', authorize('OPS_MANAGER'), orderController.getOrdersByDeliveryDate);

// Get daily order summary (Ops Manager only)
router.get('/summary/:date', authorize('OPS_MANAGER'), orderController.getDailySummary);

export default router;
