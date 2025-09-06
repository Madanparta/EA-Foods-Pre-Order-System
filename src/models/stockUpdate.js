import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const StockUpdate = sequelize.define('StockUpdate', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id',
    },
  },
  previousStock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  newStock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  updatedBy: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'SYSTEM',
  },
  updateType: {
    type: DataTypes.ENUM('MANUAL', 'ORDER', 'CANCELLATION', 'SYSTEM'),
    allowNull: false,
    defaultValue: 'MANUAL',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'stock_updates',
  timestamps: true,
});

export default StockUpdate;