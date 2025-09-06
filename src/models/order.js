import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { ORDER_STATUS } from '../utils/constants.js';

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  orderId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  customerType: {
    type: DataTypes.ENUM('CUSTOMER', 'TSU', 'SR'),
    allowNull: false,
    defaultValue: 'CUSTOMER',
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id',
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  deliveryDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  deliverySlot: {
    type: DataTypes.ENUM('MORNING', 'AFTERNOON', 'EVENING'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM(
      ORDER_STATUS.PENDING,
      ORDER_STATUS.CONFIRMED,
      ORDER_STATUS.CANCELLED,
      ORDER_STATUS.DELIVERED
    ),
    defaultValue: ORDER_STATUS.PENDING,
  },
  orderDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  idempotencyKey: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },
}, {
  tableName: 'orders',
  timestamps: true,
  indexes: [
    { fields: ['orderId'] },
    { fields: ['customerType'] },
    { fields: ['deliveryDate'] },
    { fields: ['status'] },
  ],
});

export default Order;
