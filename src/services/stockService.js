import { Product, StockUpdate } from '../models/index.js';
import { Op } from 'sequelize';

export async function getStockHistory(filters = {}, page = 1, limit = 10) {
  const whereClause = {};

  if (filters.productId) {
    whereClause.productId = filters.productId;
  }

  if (filters.updateType) {
    whereClause.updateType = filters.updateType;
  }

  if (filters.dateFrom && filters.dateTo) {
    whereClause.createdAt = {
      [Op.between]: [new Date(filters.dateFrom), new Date(filters.dateTo)],
    };
  }

  const offset = (page - 1) * limit;

  const { count, rows } = await StockUpdate.findAndCountAll({
    where: whereClause,
    limit: parseInt(limit),
    offset,
    include: [
      {
        model: Product,
        attributes: ['id', 'name', 'sku'],
      },
    ],
    order: [['createdAt', 'DESC']],
  });

  return {
    updates: rows,
    total: count,
    page: parseInt(page),
    totalPages: Math.ceil(count / limit),
  };
}

export async function bulkUpdateStock(updates, updatedBy = 'OPS_MANAGER') {
  const results = [];

  for (const update of updates) {
    try {
      const product = await Product.findByPk(update.productId);

      if (!product) {
        results.push({
          productId: update.productId,
          success: false,
          error: 'Product not found',
        });
        continue;
      }

      const previousStock = product.currentStock;
      const newStock = update.stock;

      product.currentStock = newStock;
      await product.save();

      await StockUpdate.create({
        productId: update.productId,
        previousStock,
        newStock,
        updatedBy,
        updateType: 'MANUAL',
        notes: update.notes || 'Bulk stock update',
      });

      results.push({
        productId: update.productId,
        productName: product.name,
        previousStock,
        newStock,
        success: true,
      });
    } catch (error) {
      results.push({
        productId: update.productId,
        success: false,
        error: error.message,
      });
    }
  }

  return results;
}

export async function getCurrentStockLevels(filters = {}) {
  const whereClause = {};

  if (filters.category) {
    whereClause.category = filters.category;
  }

  if (filters.isActive !== undefined) {
    whereClause.isActive = filters.isActive;
  }

  if (filters.lowStock) {
    whereClause.currentStock = { [Op.lte]: 10 };
  }

  return await Product.findAll({
    where: whereClause,
    attributes: ['id', 'name', 'sku', 'category', 'currentStock', 'price'],
    order: [
      ['category', 'ASC'],
      ['name', 'ASC'],
    ],
  });
}

export default {
  getStockHistory,
  bulkUpdateStock,
  getCurrentStockLevels,
};