import express from 'express';
const router = express.Router();

import * as stockController from '../controllers/stockController.js';
import { validateStockUpdate, validateBulkStockUpdate, validateQuery } from '../middleware/validation.js';
import { authenticate, authorize } from '../middleware/auth.js';

router.use(authenticate);
router.use(authorize('OPS_MANAGER'));

router.get('/history', validateQuery, stockController.getStockHistory);

router.patch('/:productId', validateStockUpdate, stockController.updateStock);

router.patch('/', validateBulkStockUpdate, stockController.bulkUpdateStock);

router.get('/current', validateQuery, stockController.getCurrentStock);

export default router;
