# MongoDB Backend Setup Guide

## Quick Start Guide

Follow these steps to get your MongoDB backend up and running:

### Step 1: Install MongoDB

Choose one of the following options:

#### Option A: Local MongoDB Installation

**Windows:**
1. Download MongoDB Community Server from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Run the installer and follow the installation wizard
3. MongoDB will be installed as a Windows Service and start automatically
4. Verify installation by opening Command Prompt and typing: `mongod --version`

**Mac:**
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file for MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Option B: MongoDB Atlas (Cloud - Recommended for Beginners)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free account
3. Create a new cluster (Free tier available)
4. Click "Connect" on your cluster
5. Add your IP address to the whitelist (or allow access from anywhere for development: 0.0.0.0/0)
6. Create a database user with username and password
7. Choose "Connect your application"
8. Copy the connection string
9. Replace `<password>` with your database user password
10. Update the `MONGODB_URI` in your `.env` file

Example Atlas connection string:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ecommerce-db?retryWrites=true&w=majority
```

### Step 2: Configure Environment Variables

1. The `.env` file has already been created in the server directory
2. Update the values if needed:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ecommerce-db  # Change this if using Atlas
JWT_SECRET=your-super-secret-jwt-key-please-change-this-in-production
CLIENT_URL=http://localhost:5173
```

**Important:** 
- For production, change `JWT_SECRET` to a strong random string
- If using MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string

### Step 3: Install Dependencies

Dependencies are already installed, but if you need to reinstall:

```bash
cd server
npm install
```

### Step 4: Seed the Database (Optional but Recommended)

Populate the database with sample products and test users:

```bash
npm run seed
```

This creates:
- **Admin User:** 
  - Email: `admin@example.com`
  - Password: `admin123`
- **Test User:** 
  - Email: `user@example.com`
  - Password: `user123`
- **8 Sample Products** in various categories

### Step 5: Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

### Step 6: Verify the Server is Running

Open your browser or use curl to test:

```bash
# Health check
curl http://localhost:5000/api/health

# Get all products
curl http://localhost:5000/api/products
```

You should see a JSON response.

## Testing the API

### Using Browser (for GET requests)
- Health Check: http://localhost:5000/api/health
- Get Products: http://localhost:5000/api/products

### Using Postman or Thunder Client

1. **Register a new user:**
   - Method: POST
   - URL: http://localhost:5000/api/auth/register
   - Body (JSON):
   ```json
   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "password123"
   }
   ```

2. **Login:**
   - Method: POST
   - URL: http://localhost:5000/api/auth/login
   - Body (JSON):
   ```json
   {
     "email": "admin@example.com",
     "password": "admin123"
   }
   ```

3. **Get Products:**
   - Method: GET
   - URL: http://localhost:5000/api/products

4. **Add to Cart (requires authentication):**
   - Method: POST
   - URL: http://localhost:5000/api/cart/add
   - Body (JSON):
   ```json
   {
     "productId": "PRODUCT_ID_HERE",
     "quantity": 1
   }
   ```

## Troubleshooting

### Issue: "MongoDB connection error"

**Solution:**
- Verify MongoDB is running:
  - Windows: Check Services for "MongoDB Server"
  - Mac/Linux: Run `sudo systemctl status mongod`
- Check if the connection string in `.env` is correct
- For Atlas: Ensure your IP is whitelisted

### Issue: "Port 5000 already in use"

**Solution:**
- Change the PORT in `.env` to another port (e.g., 5001)
- Or find and kill the process using port 5000:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  
  # Mac/Linux
  lsof -ti:5000 | xargs kill -9
  ```

### Issue: "JWT_SECRET is not defined"

**Solution:**
- Ensure `.env` file exists in the server directory
- Verify `JWT_SECRET` is set in `.env`
- Restart the server after making changes

### Issue: Cannot seed database

**Solution:**
- Ensure MongoDB is running
- Check MongoDB connection string
- Try running: `npm run seed` again

### Issue: CORS errors from frontend

**Solution:**
- Verify `CLIENT_URL` in `.env` matches your frontend URL
- Default is `http://localhost:5173` for Vite apps

## MongoDB GUI Tools (Optional)

To visualize your database, you can use:

1. **MongoDB Compass** (Official GUI)
   - Download: https://www.mongodb.com/products/compass
   - Connect using: `mongodb://localhost:27017`

2. **Studio 3T** (Free for non-commercial use)
   - Download: https://studio3t.com/download/

3. **Robo 3T** (Free and lightweight)
   - Download: https://robomongo.org/download

## Next Steps

1. ✅ MongoDB is installed and running
2. ✅ Server is configured and running
3. ✅ Database is seeded with sample data
4. 🎯 Connect your frontend application
5. 🎯 Test all API endpoints
6. 🎯 Build your features!

## Useful Commands

```bash
# Start development server
npm run dev

# Start production server
npm start

# Seed database
npm run seed

# Install dependencies
npm install

# Check MongoDB status (Linux/Mac)
sudo systemctl status mongod

# View MongoDB logs (Linux/Mac)
sudo tail -f /var/log/mongodb/mongod.log
```

## API Documentation

For complete API documentation, see [README.md](./README.md)

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Ensure MongoDB is running
4. Check server logs for error messages

Happy coding! 🚀