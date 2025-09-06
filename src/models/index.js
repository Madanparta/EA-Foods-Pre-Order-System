import sequelize from '../config/database.js';
import Product from './product.js';
import Order from './order.js';
import StockUpdate from './stockUpdate.js';

// Define associations
Product.hasMany(Order, { foreignKey: 'productId' });
Order.belongsTo(Product, { foreignKey: 'productId' });

Product.hasMany(StockUpdate, { foreignKey: 'productId' });
StockUpdate.belongsTo(Product, { foreignKey: 'productId' });


export async function syncDatabase() {
  try {
    await sequelize.sync({ force: process.env.NODE_ENV === 'test' });
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
    throw error;
  }
}

export {
  sequelize,
  Product,
  Order,
  StockUpdate
};
