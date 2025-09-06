import { Product, syncDatabase } from '../models/index.js';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);

const isDirectlyExecuted = path.resolve(process.argv[1]) === path.resolve(__filename);

async function seedData() {
  try {
    await syncDatabase();

    const products = [
      {
        name: 'Organic Whole Milk',
        description: 'Fresh organic whole milk from grass-fed cows',
        price: 4.99,
        currentStock: 50,
        sku: 'MILK-ORG-001',
        category: 'Dairy',
        isActive: true,
      },
      {
        name: 'Free Range Eggs (Dozen)',
        description: 'Farm fresh free range eggs',
        price: 6.49,
        currentStock: 30,
        sku: 'EGG-FR-001',
        category: 'Dairy',
        isActive: true,
      },
      {
        name: 'Whole Wheat Bread',
        description: 'Freshly baked whole wheat bread',
        price: 3.99,
        currentStock: 25,
        sku: 'BREAD-WW-001',
        category: 'Bakery',
        isActive: true,
      },
      {
        name: 'Organic Apples (1lb)',
        description: 'Fresh organic apples',
        price: 2.99,
        currentStock: 40,
        sku: 'FRUIT-APP-001',
        category: 'Fruits',
        isActive: true,
      },
      {
        name: 'Bananas (1lb)',
        description: 'Fresh bananas',
        price: 0.59,
        currentStock: 60,
        sku: 'FRUIT-BAN-001',
        category: 'Fruits',
        isActive: true,
      },
      {
        name: 'Organic Chicken Breast (1lb)',
        description: 'Fresh organic chicken breast',
        price: 8.99,
        currentStock: 20,
        sku: 'MEAT-CHK-001',
        category: 'Meat',
        isActive: true,
      },
      {
        name: 'Atlantic Salmon (1lb)',
        description: 'Fresh Atlantic salmon fillet',
        price: 12.99,
        currentStock: 15,
        sku: 'FISH-SAL-001',
        category: 'Seafood',
        isActive: true,
      },
      {
        name: 'Organic Spinach (1lb)',
        description: 'Fresh organic spinach',
        price: 3.49,
        currentStock: 35,
        sku: 'VEG-SPN-001',
        category: 'Vegetables',
        isActive: true,
      },
      {
        name: 'Carrots (1lb)',
        description: 'Fresh carrots',
        price: 1.99,
        currentStock: 45,
        sku: 'VEG-CAR-001',
        category: 'Vegetables',
        isActive: true,
      },
      {
        name: 'Italian Pasta (1lb)',
        description: 'Authentic Italian pasta',
        price: 2.49,
        currentStock: 50,
        sku: 'PASTA-IT-001',
        category: 'Pantry',
        isActive: true,
      },
    ];

    for (const productData of products) {
      console.log(`Seeding product: ${productData.name}`);
      await Product.create(productData);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

if (isDirectlyExecuted) {
  seedData();
}

export default seedData;
