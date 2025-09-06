import Joi from 'joi';
import { isValidDeliverySlot } from '../utils/helpers.js';
import { USER_TYPES } from '../utils/constants.js';

// Order validation schema
const orderSchema = Joi.object({
  customerName: Joi.string().min(1).max(100).required(),
  customerType: Joi.string().valid(...Object.values(USER_TYPES)).default('CUSTOMER'),
  productId: Joi.number().integer().positive().required(),
  quantity: Joi.number().integer().positive().required(),
  deliverySlot: Joi.string().custom((value, helpers) => {
    if (!isValidDeliverySlot(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }, 'Delivery Slot Validation').required(),
  orderDate: Joi.date().optional(),
});

// Product validation schema
const productSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  description: Joi.string().max(1000).optional().allow(''),
  price: Joi.number().positive().precision(2).required(),
  currentStock: Joi.number().integer().min(0).default(0),
  sku: Joi.string().min(1).max(50).required(),
  category: Joi.string().min(1).max(100).required(),
  isActive: Joi.boolean().default(true),
});

// Stock update validation schema
const stockUpdateSchema = Joi.object({
  productId: Joi.number().integer().positive().required(),
  stock: Joi.number().integer().min(0).required(),
  notes: Joi.string().max(500).optional().allow(''),
});

// Bulk stock update validation schema
const bulkStockUpdateSchema = Joi.array().items(stockUpdateSchema).min(1);

// Query parameters validation schema
const querySchema = Joi.object({
  page: Joi.number().integer().positive().default(1),
  limit: Joi.number().integer().positive().max(100).default(10),
  status: Joi.string().optional(),
  category: Joi.string().optional(),
  search: Joi.string().optional(),
  deliveryDate: Joi.date().optional(),
  orderDateFrom: Joi.date().optional(),
  orderDateTo: Joi.date().optional(),
  lowStock: Joi.boolean().optional(),
});

const validate = (schema) => {
  return (req, res, next) => {
    const dataToValidate = req.method === 'GET' ? req.query : req.body;

    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        error: 'Validation failed',
        details: errors,
      });
    }

    if (req.method === 'GET') {
      req.query = value;
    } else {
      req.body = value;
    }

    next();
  };
};

// Export validators
export const validateOrder = validate(orderSchema);
export const validateProduct = validate(productSchema);
export const validateStockUpdate = validate(stockUpdateSchema);
export const validateBulkStockUpdate = validate(bulkStockUpdateSchema);
export const validateQuery = validate(querySchema);
