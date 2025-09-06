import { Product, StockUpdate } from '../models/index.js';
import { Op } from 'sequelize';

export async function getAllProducts(filters = {}, page = 1, limit = 10) {
  const whereClause = {};

  if (filters.category) {
    whereClause.category = filters.category;
  }

  if (filters.isActive !== undefined) {
    whereClause.isActive = filters.isActive;
  }

  if (filters.search) {
    whereClause.name = { [Op.like]: `%${filters.search}%` };
  }

  const offset = (page - 1) * limit;

  const { count, rows } = await Product.findAndCountAll({
    where: whereClause,
    limit: parseInt(limit),
    offset,
    order: [['name', 'ASC']],
  });

  return {
    products: rows,
    total: count,
    page: parseInt(page),
    totalPages: Math.ceil(count / limit),
  };
}

// Get product by ID
export async function getProductById(id) {
  return await Product.findByPk(id);
}

// Get product by SKU
export async function getProductBySku(sku) {
  return await Product.findOne({ where: { sku } });
}

// Update product stock
export async function updateProductStock(productId, newStock, updatedBy = 'SYSTEM', updateType = 'MANUAL', notes = '') {
  const product = await Product.findByPk(productId);

  if (!product) {
    throw new Error('Product not found');
  }

  const previousStock = product.currentStock;

  // Update product stock
  product.currentStock = newStock;
  await product.save();

  // Record stock update
  await StockUpdate.create({
    productId,
    previousStock,
    newStock,
    updatedBy,
    updateType,
    notes,
  });

  return product;
}

// Get low stock products
export async function getLowStockProducts(threshold = 10) {
  return await Product.findAll({
    where: {
      currentStock: { [Op.lte]: threshold },
      isActive: true,
    },
    order: [['currentStock', 'ASC']],
  });
}

// Default export for the service
export default {
  getAllProducts,
  getProductById,
  getProductBySku,
  updateProductStock,
  getLowStockProducts,
};
