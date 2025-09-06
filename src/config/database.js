import { Sequelize } from 'sequelize';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use separate DB for tests to avoid EPERM
const storagePath = process.env.NODE_ENV === 'test'
  ? path.join(__dirname, 'test.sqlite')
  : process.env.DB_STORAGE || path.join(__dirname, '../../database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: storagePath,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export default sequelize;
