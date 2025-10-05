# API Quick Reference Card

## Base URL
```
http://localhost:5000/api
```

## Test Credentials
```
Admin: admin@example.com / admin123
User:  user@example.com / user123
```

---

## 🔐 Authentication Endpoints

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

### Logout
```http
POST /api/auth/logout
```

### Get Profile (Protected)
```http
GET /api/auth/profile
Cookie: token=<jwt_token>
```

---

## 📦 Product Endpoints

### Get All Products
```http
GET /api/products
```

### Get Single Product
```http
GET /api/products/:id
```

### Create Product (Admin Only)
```http
POST /api/products
Content-Type: application/json
Cookie: token=<admin_jwt_token>

{
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "image": "https://example.com/image.jpg",
  "category": "Electronics",
  "stock": 50,
  "rating": 4.5,
  "reviews": 100
}
```

### Update Product (Admin Only)
```http
PUT /api/products/:id
Content-Type: application/json
Cookie: token=<admin_jwt_token>

{
  "name": "Updated Name",
  "price": 89.99,
  "stock": 45
}
```

### Delete Product (Admin Only)
```http
DELETE /api/products/:id
Cookie: token=<admin_jwt_token>
```

---

## 🛒 Cart Endpoints (All Protected)

### Get Cart
```http
GET /api/cart
Cookie: token=<jwt_token>
```

### Add to Cart
```http
POST /api/cart/add
Content-Type: application/json
Cookie: token=<jwt_token>

{
  "productId": "product_id_here",
  "quantity": 1
}
```

### Update Cart Item
```http
PUT /api/cart/update
Content-Type: application/json
Cookie: token=<jwt_token>

{
  "productId": "product_id_here",
  "quantity": 3
}
```

### Remove from Cart
```http
DELETE /api/cart/remove/:productId
Cookie: token=<jwt_token>
```

### Clear Cart
```http
DELETE /api/cart/clear
Cookie: token=<jwt_token>
```

---

## 📋 Order Endpoints (All Protected)

### Get User Orders
```http
GET /api/orders
Cookie: token=<jwt_token>
```

### Create Order
```http
POST /api/orders
Content-Type: application/json
Cookie: token=<jwt_token>

{
  "items": [
    {
      "product": "product_id",
      "quantity": 2,
      "price": 99.99
    }
  ],
  "total": 199.98,
  "shippingAddress": {
    "label": "Home",
    "line1": "123 Main St",
    "line2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "USA"
  }
}
```

### Get All Orders (Admin Only)
```http
GET /api/orders/all
Cookie: token=<admin_jwt_token>
```

### Update Order Status (Admin Only)
```http
PUT /api/orders/:id/status
Content-Type: application/json
Cookie: token=<admin_jwt_token>

{
  "status": "shipped"
}
```
**Status Options:** pending, processing, shipped, delivered, cancelled

---

## 📍 Address Endpoints (All Protected)

### Get User Addresses
```http
GET /api/addresses
Cookie: token=<jwt_token>
```

### Create Address
```http
POST /api/addresses
Content-Type: application/json
Cookie: token=<jwt_token>

{
  "label": "Home",
  "line1": "123 Main St",
  "line2": "Apt 4B",
  "city": "New York",
  "state": "NY",
  "postalCode": "10001",
  "country": "USA",
  "isDefault": true
}
```

### Update Address
```http
PUT /api/addresses/:id
Content-Type: application/json
Cookie: token=<jwt_token>

{
  "label": "Work",
  "line1": "456 Office Blvd"
}
```

### Delete Address
```http
DELETE /api/addresses/:id
Cookie: token=<jwt_token>
```

---

## 🏥 Health Check

### Server Health
```http
GET /api/health
```

---

## 📊 Response Formats

### Success Response
```json
{
  "user": { ... },
  "product": { ... },
  "cart": { ... },
  "order": { ... },
  "address": { ... }
}
```

### Error Response
```json
{
  "message": "Error message here"
}
```

---

## 🔑 HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized (Not logged in)
- `403` - Forbidden (Not admin)
- `404` - Not Found
- `500` - Server Error

---

## 🍪 Authentication

Authentication uses HTTP-only cookies. After login/register:
- Token is automatically set in cookie
- Cookie is sent with each request
- No need to manually handle tokens in frontend

---

## 💡 Quick Tips

1. **Testing with cURL (Windows PowerShell):**
```powershell
# Get products
curl http://localhost:5000/api/products

# Register (use ^ for line continuation)
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test\",\"email\":\"test@test.com\",\"password\":\"test123\"}"
```

2. **Testing with JavaScript (Frontend):**
```javascript
// Fetch products
const response = await fetch('http://localhost:5000/api/products');
const data = await response.json();

// Login
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // Important for cookies
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'admin123'
  })
});
```

3. **Using Postman:**
   - Enable "Send cookies automatically"
   - After login, cookie is saved automatically
   - All subsequent requests include the cookie

---

## 🚀 Common Workflows

### User Registration & Shopping Flow
1. `POST /api/auth/register` - Register
2. `GET /api/products` - Browse products
3. `POST /api/cart/add` - Add to cart
4. `GET /api/cart` - View cart
5. `POST /api/orders` - Create order
6. `GET /api/orders` - View order history

### Admin Product Management Flow
1. `POST /api/auth/login` - Login as admin
2. `POST /api/products` - Create product
3. `PUT /api/products/:id` - Update product
4. `GET /api/orders/all` - View all orders
5. `PUT /api/orders/:id/status` - Update order status

---

## 📝 Notes

- All timestamps are in ISO 8601 format
- Prices are in decimal format (e.g., 99.99)
- Product IDs are MongoDB ObjectIds
- Passwords are hashed with bcrypt
- JWT tokens expire in 7 days

---

**Server:** http://localhost:5000
**Documentation:** See README.md for detailed info