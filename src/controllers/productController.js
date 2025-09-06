import productService from '../services/productService.js';

export async function getProducts(req, res, next) {
  try {
    const result = await productService.getAllProducts(req.query, req.query.page, req.query.limit);

    res.status(200).json({
      status: 200,
      message: 'Products fetched successfully',
      data: result,
    });
    } catch (error) {
      res.status(error.status || 500).json({
        status: error.status || 500,
        error: error.message || 'Internal Server Error',
      });
  }
}

export async function getProduct(req, res, next) {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);

    if (!product) {
      return res.status(404).json({
        status: 404,
        error: 'Product not found',
      });
    }

    res.status(200).json({
      status: 200,
      message: 'Product fetched successfully',
      data: product,
    });
    } catch (error) {
      res.status(error.status || 500).json({
        status: error.status || 500,
        error: error.message || 'Internal Server Error',
      });
  }
}

export async function getLowStockProducts(req, res, next) {
  try {
    const threshold = parseInt(req.query.threshold, 10) || 10;
    const products = await productService.getLowStockProducts(threshold);

    res.status(200).json({
      status: 200,
      message: 'Low stock products fetched successfully',
      data: {
        threshold,
        count: products.length,
        products,
      },
    });
    } catch (error) {
      res.status(error.status || 500).json({
        status: error.status || 500,
        error: error.message || 'Internal Server Error',
      });
  }
}
