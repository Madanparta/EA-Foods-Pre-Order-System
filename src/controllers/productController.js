import productService from '../services/productService.js';

export async function getProducts(req, res, next) {
  try {
    const result = await productService.getAllProducts(req.query, req.query.page, req.query.limit);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getProduct(req, res, next) {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    next(error);
  }
}

export async function getLowStockProducts(req, res, next) {
  try {
    const threshold = req.query.threshold || 10;
    const products = await productService.getLowStockProducts(threshold);

    res.json({
      products,
      count: products.length,
      threshold,
    });
  } catch (error) {
    next(error);
  }
}