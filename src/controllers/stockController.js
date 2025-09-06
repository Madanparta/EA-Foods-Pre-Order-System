import stockService from '../services/stockService.js';
import productService from '../services/productService.js';

export async function getStockHistory(req, res, next) {
  try {
    const result = await stockService.getStockHistory(req.query, req.query.page, req.query.limit);

    res.status(200).json({
      status: 200,
      message: 'Stock history fetched successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

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

    res.status(200).json({
      status: 200,
      message: 'Stock updated successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

export async function bulkUpdateStock(req, res, next) {
  try {
    const results = await stockService.bulkUpdateStock(req.body, req.user.name);

    res.status(200).json({
      status: 200,
      message: 'Bulk stock update completed successfully',
      data: results,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCurrentStock(req, res, next) {
  try {
    const products = await stockService.getCurrentStockLevels(req.query);

    res.status(200).json({
      status: 200,
      message: 'Current stock levels fetched successfully',
      data: {
        count: products.length,
        products,
      },
    });
  } catch (error) {
    next(error);
  }
}