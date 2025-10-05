require('dotenv').config();
const mongoose = require('mongoose');

const testConnection = async () => {
  console.log('🔍 Testing MongoDB connection...\n');
  console.log('Connection String:', process.env.MONGODB_URI);
  console.log('-----------------------------------\n');

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('✅ MongoDB Connected Successfully!');
    console.log('-----------------------------------');
    console.log('Host:', conn.connection.host);
    console.log('Database:', conn.connection.name);
    console.log('Port:', conn.connection.port);
    console.log('-----------------------------------\n');

    // Test a simple query
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('📦 Available Collections:');
    if (collections.length === 0) {
      console.log('   No collections found (database is empty)');
      console.log('   Run "npm run seed" to populate the database\n');
    } else {
      collections.forEach(col => {
        console.log(`   - ${col.name}`);
      });
      console.log('');
    }

    await mongoose.connection.close();
    console.log('✅ Connection test completed successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB Connection Failed!');
    console.error('-----------------------------------');
    console.error('Error:', error.message);
    console.error('-----------------------------------\n');
    
    console.log('💡 Troubleshooting Tips:');
    console.log('1. Make sure MongoDB is running');
    console.log('2. Check your MONGODB_URI in .env file');
    console.log('3. For local MongoDB: mongodb://localhost:27017/database-name');
    console.log('4. For Atlas: mongodb+srv://username:password@cluster.mongodb.net/database-name\n');
    
    process.exit(1);
  }
};

testConnection();