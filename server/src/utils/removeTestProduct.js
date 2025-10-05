require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const removeTestProduct = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all products
    const allProducts = await Product.find();
    console.log('\n📦 Current Products in Database:');
    console.log('================================');
    allProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} (ID: ${product._id})`);
    });

    // Find products with "test" in the name (case-insensitive)
    const testProducts = await Product.find({
      name: { $regex: /test/i }
    });

    if (testProducts.length === 0) {
      console.log('\n✅ No products with "test" in the name found.');
      process.exit(0);
    }

    console.log('\n🔍 Found Test Products:');
    console.log('======================');
    testProducts.forEach((product) => {
      console.log(`- ${product.name} (ID: ${product._id})`);
    });

    // Delete test products
    const result = await Product.deleteMany({
      name: { $regex: /test/i }
    });

    console.log(`\n✅ Successfully removed ${result.deletedCount} test product(s)!`);

    // Show remaining products
    const remainingProducts = await Product.find();
    console.log('\n📦 Remaining Products:');
    console.log('=====================');
    remainingProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error removing test product:', error);
    process.exit(1);
  }
};

removeTestProduct();