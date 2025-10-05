require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const manageProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find all products
    const products = await Product.find();
    
    if (products.length === 0) {
      console.log('❌ No products found in database.');
      rl.close();
      process.exit(0);
    }

    console.log('📦 CURRENT PRODUCTS IN DATABASE:');
    console.log('================================\n');
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   ID: ${product._id}`);
      console.log(`   Price: $${product.price}`);
      console.log(`   Category: ${product.category}`);
      console.log(`   Stock: ${product.stock}`);
      console.log('');
    });

    console.log('================================\n');
    
    const answer = await question('Enter the NUMBER or NAME of the product to delete (or "cancel" to exit): ');
    
    if (answer.toLowerCase() === 'cancel') {
      console.log('❌ Operation cancelled.');
      rl.close();
      process.exit(0);
    }

    let productToDelete = null;

    // Check if input is a number (index)
    const index = parseInt(answer);
    if (!isNaN(index) && index > 0 && index <= products.length) {
      productToDelete = products[index - 1];
    } else {
      // Search by name (case-insensitive)
      productToDelete = products.find(p => 
        p.name.toLowerCase().includes(answer.toLowerCase())
      );
    }

    if (!productToDelete) {
      console.log('❌ Product not found. Please check the name or number and try again.');
      rl.close();
      process.exit(0);
    }

    console.log(`\n⚠️  You are about to delete:`);
    console.log(`   Name: ${productToDelete.name}`);
    console.log(`   ID: ${productToDelete._id}`);
    console.log(`   Price: $${productToDelete.price}`);
    
    const confirm = await question('\nAre you sure? (yes/no): ');
    
    if (confirm.toLowerCase() !== 'yes') {
      console.log('❌ Deletion cancelled.');
      rl.close();
      process.exit(0);
    }

    // Delete the product
    await Product.findByIdAndDelete(productToDelete._id);
    console.log(`\n✅ Successfully deleted "${productToDelete.name}"!`);

    // Show remaining products
    const remainingProducts = await Product.find();
    console.log(`\n📦 Remaining Products: ${remainingProducts.length}`);
    remainingProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
    });

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    rl.close();
    process.exit(1);
  }
};

manageProducts();