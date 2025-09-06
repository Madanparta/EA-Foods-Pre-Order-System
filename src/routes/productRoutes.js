import express from 'express';
const router = express.Router();

import * as productController from '../controllers/productController.js';
import { validateQuery } from '../middleware/validation.js';
import { authenticate } from '../middleware/auth.js';

router.use(authenticate);

router.get('/', validateQuery, productController.getProducts);

router.get('/inventory/low-stock', productController.getLowStockProducts);

router.get('/:id', productController.getProduct);

export default router;