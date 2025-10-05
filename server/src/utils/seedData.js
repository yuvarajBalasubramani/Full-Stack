require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');

const products = [
  {
    name: 'Wireless Headphones',
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    category: 'Electronics',
    stock: 50,
    rating: 4.5,
    reviews: 128
  },
  {
    name: 'Smart Watch',
    description: 'Fitness tracking smartwatch with heart rate monitor and GPS',
    price: 399.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    category: 'Electronics',
    stock: 30,
    rating: 4.7,
    reviews: 256
  },
  {
    name: 'Laptop Backpack',
    description: 'Durable water-resistant backpack with laptop compartment',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    category: 'Accessories',
    stock: 100,
    rating: 4.3,
    reviews: 89
  },
  {
    name: 'Mechanical Keyboard',
    description: 'RGB mechanical gaming keyboard with customizable keys',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
    category: 'Electronics',
    stock: 45,
    rating: 4.6,
    reviews: 167
  },
  {
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with precision tracking',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
    category: 'Electronics',
    stock: 80,
    rating: 4.4,
    reviews: 203
  },
  {
    name: 'USB-C Hub',
    description: '7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500',
    category: 'Accessories',
    stock: 60,
    rating: 4.2,
    reviews: 94
  },
  {
    name: 'Portable Charger',
    description: '20000mAh power bank with fast charging support',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500',
    category: 'Accessories',
    stock: 120,
    rating: 4.5,
    reviews: 312
  },
  {
    name: 'Webcam HD',
    description: '1080p HD webcam with built-in microphone',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500',
    category: 'Electronics',
    stock: 40,
    rating: 4.3,
    reviews: 145
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Insert products
    const createdProducts = await Product.insertMany(products);
    console.log(`Inserted ${createdProducts.length} products`);

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log('Created admin user:', adminUser.email);

    // Create test user
    const testUser = await User.create({
      name: 'Test User',
      email: 'user@example.com',
      password: 'user123',
      role: 'user'
    });
    console.log('Created test user:', testUser.email);

    console.log('\n✅ Database seeded successfully!');
    console.log('\nTest Credentials:');
    console.log('Admin - Email: admin@example.com, Password: admin123');
    console.log('User - Email: user@example.com, Password: user123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();