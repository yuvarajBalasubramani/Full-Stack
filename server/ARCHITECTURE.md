# 🏗️ Backend Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│                    (React/Vue/Angular)                           │
│                   http://localhost:5173                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTP Requests
                         │ (with cookies)
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXPRESS SERVER                                │
│                  http://localhost:5000                           │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                    MIDDLEWARE                           │    │
│  │  • CORS (credentials: true)                            │    │
│  │  • express.json()                                      │    │
│  │  • cookie-parser                                       │    │
│  │  • authMiddleware (JWT verification)                   │    │
│  │  • adminMiddleware (role check)                        │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                      ROUTES                             │    │
│  │                                                         │    │
│  │  /api/auth          → authRoutes                       │    │
│  │  /api/products      → productRoutes                    │    │
│  │  /api/cart          → cartRoutes (protected)           │    │
│  │  /api/orders        → orderRoutes (protected)          │    │
│  │  /api/addresses     → addressRoutes (protected)        │    │
│  │  /api/health        → health check                     │    │
│  └────────────────────────────────────────────────────────┘    │
│                         │                                        │
│                         ▼                                        │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                   CONTROLLERS                           │    │
│  │                                                         │    │
│  │  • authController     - User auth logic                │    │
│  │  • productController  - Product CRUD                   │    │
│  │  • cartController     - Cart operations                │    │
│  │  • orderController    - Order management               │    │
│  │  • addressController  - Address management             │    │
│  └────────────────────────────────────────────────────────┘    │
│                         │                                        │
│                         ▼                                        │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                     MODELS                              │    │
│  │                  (Mongoose Schemas)                     │    │
│  │                                                         │    │
│  │  • User      - User accounts & auth                    │    │
│  │  • Product   - Product catalog                         │    │
│  │  • Cart      - Shopping carts                          │    │
│  │  • Order     - Order records                           │    │
│  │  • Address   - Shipping addresses                      │    │
│  └────────────────────────────────────────────────────────┘    │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Mongoose ODM
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MONGODB ATLAS                                 │
│              cluster0.xidzgf8.mongodb.net                        │
│                                                                  │
│  Database: Ecommerce                                            │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  Collections:                                         │      │
│  │  • products  (8 documents)                           │      │
│  │  • users     (2 documents)                           │      │
│  │  • carts     (created on demand)                     │      │
│  │  • orders    (created on demand)                     │      │
│  │  • addresses (created on demand)                     │      │
│  └──────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Request Flow

### 1. Public Request (e.g., Get Products)
```
Frontend → Express Server → productRoutes → productController
                                              ↓
                                         Product Model
                                              ↓
                                         MongoDB Atlas
                                              ↓
                                         Return Products
                                              ↓
Frontend ← JSON Response ← productController ←
```

### 2. Protected Request (e.g., Add to Cart)
```
Frontend → Express Server → authMiddleware (verify JWT)
                                   ↓
                              cartRoutes → cartController
                                              ↓
                                         Cart Model
                                              ↓
                                         MongoDB Atlas
                                              ↓
                                         Update Cart
                                              ↓
Frontend ← JSON Response ← cartController ←
```

### 3. Admin Request (e.g., Create Product)
```
Frontend → Express Server → adminMiddleware (verify JWT + role)
                                   ↓
                              productRoutes → productController
                                              ↓
                                         Product Model
                                              ↓
                                         MongoDB Atlas
                                              ↓
                                         Create Product
                                              ↓
Frontend ← JSON Response ← productController ←
```

---

## Authentication Flow

```
┌──────────────┐
│   Register   │
└──────┬───────┘
       │
       ▼
┌─────────────────────────────────────┐
│ 1. User submits registration form   │
│    (name, email, password)          │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ 2. authController.register          │
│    • Check if email exists          │
│    • Hash password (bcrypt)         │
│    • Create user in DB              │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ 3. Generate JWT token               │
│    • Sign with JWT_SECRET           │
│    • Expires in 7 days              │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ 4. Set HTTP-only cookie             │
│    • Cookie name: "token"           │
│    • httpOnly: true                 │
│    • sameSite: 'lax'                │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ 5. Return user data (no password)   │
└─────────────────────────────────────┘

┌──────────────┐
│    Login     │
└──────┬───────┘
       │
       ▼
┌─────────────────────────────────────┐
│ 1. User submits login form          │
│    (email, password)                │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ 2. authController.login             │
│    • Find user by email             │
│    • Compare password (bcrypt)      │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ 3. Generate JWT token               │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ 4. Set HTTP-only cookie             │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ 5. Return user data                 │
└─────────────────────────────────────┘

┌──────────────────┐
│ Protected Route  │
└──────┬───────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ 1. Request with cookie              │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ 2. authMiddleware                   │
│    • Extract token from cookie      │
│    • Verify JWT signature           │
│    • Decode userId                  │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ 3. Attach userId to request         │
│    req.userId = decoded.userId      │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ 4. Continue to route handler        │
└─────────────────────────────────────┘
```

---

## Data Models

### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, indexed),
  password: String (hashed),
  role: String (enum: ['user', 'admin']),
  avatar: String,
  orderCount: Number,
  totalSpent: Number,
  addresses: [{
    label: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    isDefault: Boolean
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Product Model
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  image: String,
  category: String,
  stock: Number,
  rating: Number,
  reviews: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Cart Model
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', unique),
  items: [{
    product: ObjectId (ref: 'Product'),
    quantity: Number
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User'),
  items: [{
    product: ObjectId (ref: 'Product'),
    quantity: Number,
    price: Number
  }],
  total: Number,
  status: String (enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
  shippingAddress: {
    label: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  paymentInfo: {
    method: String,
    transactionId: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Address Model
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User'),
  label: String,
  line1: String,
  line2: String,
  city: String,
  state: String,
  postalCode: String,
  country: String,
  isDefault: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Security Layers

```
┌─────────────────────────────────────────────────────────┐
│                    Security Layer 1                      │
│                         CORS                             │
│  • Only allows requests from CLIENT_URL                 │
│  • Credentials enabled for cookies                      │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                    Security Layer 2                      │
│                   HTTP-Only Cookies                      │
│  • Token stored in HTTP-only cookie                     │
│  • Not accessible via JavaScript                        │
│  • Prevents XSS attacks                                 │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                    Security Layer 3                      │
│                   JWT Verification                       │
│  • Token signature verified                             │
│  • Expiration checked                                   │
│  • User ID extracted                                    │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                    Security Layer 4                      │
│                  Role-Based Access                       │
│  • User role checked for admin routes                   │
│  • 403 Forbidden if not authorized                      │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                    Security Layer 5                      │
│                  Password Hashing                        │
│  • Passwords hashed with bcrypt                         │
│  • Salt rounds: 10                                      │
│  • Never stored in plain text                           │
└─────────────────────────────────────────────────────────┘
```

---

## File Structure

```
server/
│
├── src/
│   │
│   ├── controllers/              # Business Logic
│   │   ├── authController.js     # Authentication logic
│   │   ├── productController.js  # Product CRUD logic
│   │   ├── cartController.js     # Cart operations logic
│   │   ├── orderController.js    # Order management logic
│   │   └── addressController.js  # Address management logic
│   │
│   ├── models/                   # Data Models
│   │   ├── User.js               # User schema & methods
│   │   ├── Product.js            # Product schema
│   │   ├── Cart.js               # Cart schema
│   │   ├── Order.js              # Order schema
│   │   └── Address.js            # Address schema
│   │
│   ├── routes/                   # API Routes
│   │   ├── authRoutes.js         # Auth endpoints
│   │   ├── productRoutes.js      # Product endpoints
│   │   ├── cartRoutes.js         # Cart endpoints
│   │   ├── orderRoutes.js        # Order endpoints
│   │   └── addressRoutes.js      # Address endpoints
│   │
│   ├── middleware/               # Custom Middleware
│   │   └── authMiddleware.js     # JWT auth & admin check
│   │
│   ├── utils/                    # Utilities
│   │   ├── db.js                 # DB connection helper
│   │   ├── seedData.js           # Database seeding
│   │   └── testConnection.js     # Connection testing
│   │
│   └── index.js                  # Server entry point
│
├── .env                          # Environment variables
├── .env.example                  # Env template
├── .gitignore                    # Git ignore rules
├── package.json                  # Dependencies & scripts
├── README.md                     # API documentation
├── SETUP_GUIDE.md                # Setup instructions
├── API_QUICK_REFERENCE.md        # Quick reference
├── COMPLETION_CHECKLIST.md       # Completion status
└── ARCHITECTURE.md               # This file
```

---

## Technology Stack

```
┌─────────────────────────────────────────────────────────┐
│                    Backend Stack                         │
├─────────────────────────────────────────────────────────┤
│  Runtime:        Node.js                                │
│  Framework:      Express.js                             │
│  Database:       MongoDB Atlas (Cloud)                  │
│  ODM:            Mongoose                               │
│  Authentication: JWT (jsonwebtoken)                     │
│  Password Hash:  bcrypt                                 │
│  Environment:    dotenv                                 │
│  CORS:           cors                                   │
│  Cookies:        cookie-parser                          │
│  Dev Tool:       nodemon                                │
└─────────────────────────────────────────────────────────┘
```

---

## Environment Configuration

```
┌─────────────────────────────────────────────────────────┐
│                  Environment Variables                   │
├─────────────────────────────────────────────────────────┤
│  PORT=5000                                              │
│  NODE_ENV=development                                   │
│  MONGODB_URI=mongodb+srv://...                          │
│  JWT_SECRET=your-secret-key                             │
│  CLIENT_URL=http://localhost:5173                       │
└─────────────────────────────────────────────────────────┘
```

---

## API Endpoint Summary

```
Authentication (4 endpoints)
├── POST   /api/auth/register
├── POST   /api/auth/login
├── POST   /api/auth/logout
└── GET    /api/auth/profile

Products (5 endpoints)
├── GET    /api/products
├── GET    /api/products/:id
├── POST   /api/products (Admin)
├── PUT    /api/products/:id (Admin)
└── DELETE /api/products/:id (Admin)

Cart (5 endpoints)
├── GET    /api/cart
├── POST   /api/cart/add
├── PUT    /api/cart/update
├── DELETE /api/cart/remove/:productId
└── DELETE /api/cart/clear

Orders (4 endpoints)
├── GET    /api/orders
├── POST   /api/orders
├── GET    /api/orders/all (Admin)
└── PUT    /api/orders/:id/status (Admin)

Addresses (4 endpoints)
├── GET    /api/addresses
├── POST   /api/addresses
├── PUT    /api/addresses/:id
└── DELETE /api/addresses/:id

Health (1 endpoint)
└── GET    /api/health

Total: 27 API Endpoints
```

---

## Deployment Architecture (Future)

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend                            │
│                   (Vercel/Netlify)                       │
└────────────────────────┬────────────────────────────────┘
                         │
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   Backend Server                         │
│              (Heroku/Railway/Render)                     │
└────────────────────────┬────────────────────────────────┘
                         │
                         │ Secure Connection
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   MongoDB Atlas                          │
│                  (Cloud Database)                        │
└─────────────────────────────────────────────────────────┘
```

---

This architecture provides a solid foundation for your e-commerce application with proper separation of concerns, security, and scalability.