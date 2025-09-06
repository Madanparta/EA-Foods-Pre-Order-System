import express from 'express';
const router = express.Router();

import * as productController from '../controllers/productController.js';
import { validateQuery } from '../middleware/validation.js';
import { authenticate } from '../middleware/auth.js';

// All routes require authentication
router.use(authenticate);

// Get all products
router.get('/', validateQuery, productController.getProducts);

// Get low stock products (make sure this is before '/:id')
router.get('/inventory/low-stock', productController.getLowStockProducts);

// Get product by ID
router.get('/:id', productController.getProduct);

export default router;
