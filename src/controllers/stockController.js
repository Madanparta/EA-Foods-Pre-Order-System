import stockService from '../services/stockService.js';
import productService from '../services/productService.js';

// Get stock history
export async function getStockHistory(req, res, next) {
  try {
    const result = await stockService.getStockHistory(req.query, req.query.page, req.query.limit);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

// Update stock for a product
export async function updateStock(req, res, next) {
  try {
    const { productId } = req.params;
    const { stock, notes } = req.body;

    const product = await productService.updateProductStock(
      productId,
      stock,
      req.user.name,
      'MANUAL',
      notes
    );

    res.json({
      message: 'Stock updated successfully',
      product,
    });
  } catch (error) {
    next(error);
  }
}

// Bulk update stock for multiple products
export async function bulkUpdateStock(req, res, next) {
  try {
    const results = await stockService.bulkUpdateStock(req.body, req.user.name);

    res.json({
      message: 'Bulk stock update completed',
      results,
    });
  } catch (error) {
    next(error);
  }
}

// Get current stock levels
export async function getCurrentStock(req, res, next) {
  try {
    const products = await stockService.getCurrentStockLevels(req.query);

    res.json({
      products,
      count: products.length,
    });
  } catch (error) {
    next(error);
  }
}
