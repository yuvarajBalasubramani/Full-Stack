require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

// Get product name/ID from command line argument
const searchTerm = process.argv[2];

const deleteProduct = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    if (!searchTerm) {
      // List all products if no search term provided
      const products = await Product.find();
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
      console.log('\nUsage: node deleteProduct.js "product name or ID"');
      console.log('Example: node deleteProduct.js "test"');
      console.log('Example: node deleteProduct.js "Wireless Headphones"');
      process.exit(0);
    }

    // Search for product by name (case-insensitive) or ID
    let productToDelete;
    
    // Try to find by ID first
    if (mongoose.Types.ObjectId.isValid(searchTerm)) {
      productToDelete = await Product.findById(searchTerm);
    }
    
    // If not found by ID, search by name
    if (!productToDelete) {
      productToDelete = await Product.findOne({
        name: { $regex: searchTerm, $options: 'i' }
      });
    }

    if (!productToDelete) {
      console.log(`❌ No product found matching: "${searchTerm}"`);
      console.log('\nSearching for similar products...');
      
      const similarProducts = await Product.find({
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { category: { $regex: searchTerm, $options: 'i' } }
        ]
      });
      
      if (similarProducts.length > 0) {
        console.log('\n📦 Similar products found:');
        similarProducts.forEach((product, index) => {
          console.log(`${index + 1}. ${product.name} (ID: ${product._id})`);
        });
      }
      
      process.exit(0);
    }

    console.log(`🔍 Found product:`);
    console.log(`   Name: ${productToDelete.name}`);
    console.log(`   ID: ${productToDelete._id}`);
    console.log(`   Price: $${productToDelete.price}`);
    console.log(`   Category: ${productToDelete.category}`);
    console.log(`   Stock: ${productToDelete.stock}`);

    // Delete the product
    await Product.findByIdAndDelete(productToDelete._id);
    console.log(`\n✅ Successfully deleted "${productToDelete.name}"!`);

    // Show remaining products count
    const remainingCount = await Product.countDocuments();
    console.log(`\n📦 Remaining products in database: ${remainingCount}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

deleteProduct();