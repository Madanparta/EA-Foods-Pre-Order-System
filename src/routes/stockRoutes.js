import express from 'express';
const router = express.Router();

import * as stockController from '../controllers/stockController.js';
import { validateStockUpdate, validateBulkStockUpdate, validateQuery } from '../middleware/validation.js';
import { authenticate, authorize } from '../middleware/auth.js';

// All routes require authentication and Ops Manager authorization
router.use(authenticate);
router.use(authorize('OPS_MANAGER'));

// Get stock history
router.get('/history', validateQuery, stockController.getStockHistory);

// Update stock for a specific product
router.patch('/:productId', validateStockUpdate, stockController.updateStock);

// Bulk update stock for multiple products
router.patch('/', validateBulkStockUpdate, stockController.bulkUpdateStock);

// Get current stock levels
router.get('/current', validateQuery, stockController.getCurrentStock);

export default router;
