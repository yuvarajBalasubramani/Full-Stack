# E-Commerce Backend Server

This is the backend server for the e-commerce application built with Node.js, Express, and MongoDB.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control (User/Admin)
- **User Management**: User registration, login, profile management
- **Product Management**: CRUD operations for products (Admin only)
- **Shopping Cart**: Add, update, remove items from cart
- **Order Management**: Create orders, view order history, update order status
- **Address Management**: Save and manage multiple shipping addresses

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **dotenv** - Environment variables

## Prerequisites

Before running this server, make sure you have:

- Node.js (v14 or higher)
- MongoDB installed locally OR MongoDB Atlas account
- npm or yarn package manager

## Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the values in `.env` file:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ecommerce-db
JWT_SECRET=your-super-secret-jwt-key
CLIENT_URL=http://localhost:5173
```

### MongoDB Setup Options

#### Option 1: Local MongoDB
```bash
# Install MongoDB locally and start the service
# Windows: Start MongoDB service from Services
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

#### Option 2: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce-db?retryWrites=true&w=majority
```

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## Seeding the Database

To populate the database with sample data (products and test users):

```bash
npm run seed
```

This will create:
- 8 sample products
- Admin user: `admin@example.com` / `admin123`
- Test user: `user@example.com` / `user123`

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile (Protected)

### Product Routes (`/api/products`)
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Cart Routes (`/api/cart`) - All Protected
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/remove/:productId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Order Routes (`/api/orders`) - All Protected
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order
- `GET /api/orders/all` - Get all orders (Admin only)
- `PUT /api/orders/:id/status` - Update order status (Admin only)

### Address Routes (`/api/addresses`) - All Protected
- `GET /api/addresses` - Get user's addresses
- `POST /api/addresses` - Create new address
- `PUT /api/addresses/:id` - Update address
- `DELETE /api/addresses/:id` - Delete address

### Health Check
- `GET /api/health` - Server health check

## Project Structure

```
server/
├── src/
│   ├── controllers/       # Request handlers
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   └── addressController.js
│   ├── models/           # Mongoose models
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   └── Address.js
│   ├── routes/           # API routes
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   └── addressRoutes.js
│   ├── middleware/       # Custom middleware
│   │   └── authMiddleware.js
│   ├── utils/           # Utility functions
│   │   ├── db.js
│   │   └── seedData.js
│   └── index.js         # Server entry point
├── .env                 # Environment variables
├── .env.example         # Environment variables template
├── package.json
└── README.md
```

## Authentication

The API uses JWT tokens stored in HTTP-only cookies for authentication. When a user logs in or registers, a token is set in the cookie and automatically sent with subsequent requests.

### Protected Routes
Routes that require authentication will return `401 Unauthorized` if no valid token is provided.

### Admin Routes
Routes that require admin access will return `403 Forbidden` if the user is not an admin.

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Testing the API

You can test the API using:
- **Postman** - Import the endpoints and test
- **Thunder Client** (VS Code extension)
- **cURL** commands
- **Frontend application**

Example cURL request:
```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Get all products
curl http://localhost:5000/api/products
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check if the connection string in `.env` is correct
- For Atlas, ensure your IP is whitelisted

### Port Already in Use
- Change the `PORT` in `.env` file
- Or kill the process using port 5000

### JWT Token Issues
- Ensure `JWT_SECRET` is set in `.env`
- Clear browser cookies if getting authentication errors

## Security Notes

⚠️ **Important for Production:**
- Change `JWT_SECRET` to a strong, random string
- Set `NODE_ENV=production`
- Enable HTTPS
- Use environment-specific MongoDB credentials
- Implement rate limiting
- Add input validation and sanitization
- Enable CORS only for trusted domains

## License

ISC