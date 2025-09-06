import express from 'express';
const router = express.Router();

import * as orderController from '../controllers/orderController.js';
import {validateOrder,validateQuery,} from '../middleware/validation.js';
import {authenticate, authorize,} from '../middleware/auth.js';

router.use(authenticate);

router.post('/', validateOrder, orderController.createOrder);

router.get('/:id', orderController.getOrder);

router.get('/order-id/:orderId', orderController.getOrderByOrderId);

router.get('/', validateQuery, orderController.getOrders);

router.patch('/:orderId/cancel', orderController.cancelOrder);

router.get('/delivery-date/:date', authorize('OPS_MANAGER'), orderController.getOrdersByDeliveryDate);

router.get('/summary/:date', authorize('OPS_MANAGER'), orderController.getDailySummary);

export default router;
