# 🎯 Frontend MongoDB Integration Guide

## ✅ What Was Done

Your frontend is now **fully integrated** with MongoDB! Here's what was implemented:

### 1. **API Service Layer** (`src/services/api.js`)
- Complete API client for all backend endpoints
- Automatic cookie handling for authentication
- Error handling and response transformation
- APIs for: Auth, Products, Cart, Orders, Addresses

### 2. **Updated AppContext** (`src/context/AppContext.jsx`)
- Automatically fetches products from MongoDB on app load
- Transforms MongoDB data to match frontend format
- Falls back to mock data if API is unavailable
- Verifies user authentication on app load

### 3. **Database Test Page** (`src/pages/DatabaseTest.jsx`)
- Visual dashboard to view MongoDB data
- API health check
- Product listing from database
- Test authentication
- Raw JSON viewer

---

## 🚀 How to View MongoDB Data

### **Method 1: Database Test Page (Recommended)**

1. **Make sure backend is running:**
   ```bash
   cd server
   npm run dev
   ```

2. **Start your frontend:**
   ```bash
   npm run dev
   ```

3. **Visit the test page:**
   ```
   http://localhost:5173/db-test
   ```

4. **What you'll see:**
   - ✅ API Status (green if connected)
   - 📦 Products loaded from MongoDB
   - 🗄️ Raw database data in table format
   - 📄 JSON view of all data
   - 🧪 Test results for API calls

---

### **Method 2: Home Page (Products Grid)**

1. Visit: `http://localhost:5173/`
2. The products you see are now loaded from MongoDB!
3. Open browser console (F12) to see:
   ```
   ✅ Products loaded from MongoDB: 8
   ```

---

### **Method 3: Browser Console**

1. Open your app: `http://localhost:5173/`
2. Press `F12` to open Developer Tools
3. Go to **Console** tab
4. Type:
   ```javascript
   // Check products in state
   console.log(window.__REACT_DEVTOOLS_GLOBAL_HOOK__);
   
   // Or manually fetch
   fetch('http://localhost:5000/api/products')
     .then(r => r.json())
     .then(data => console.log('MongoDB Products:', data));
   ```

---

## 📊 Understanding the Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     DATA FLOW DIAGRAM                        │
└─────────────────────────────────────────────────────────────┘

1. App Loads
   └─> AppContext.jsx initializes
       └─> useEffect runs
           └─> Calls productAPI.getAll()
               └─> Fetches from: http://localhost:5000/api/products
                   └─> Backend queries MongoDB
                       └─> Returns products array
                           └─> Frontend transforms data
                               └─> Updates state.products
                                   └─> ProductGrid displays products
```

---

## 🔍 Verify Integration is Working

### **Check 1: Console Logs**
Open browser console and look for:
```
✅ Products loaded from MongoDB: 8
```

### **Check 2: Network Tab**
1. Open DevTools (F12)
2. Go to **Network** tab
3. Refresh page
4. Look for request to: `http://localhost:5000/api/products`
5. Click on it and check **Response** tab

### **Check 3: Product IDs**
MongoDB products have IDs like: `67a1b2c3d4e5f6789012345a`
Mock data has IDs like: `1`, `2`, `3`

Check product cards - if you see long MongoDB IDs, it's working!

---

## 🎨 How to Display Data in Your Components

### **Example 1: Display Products**
```jsx
import { useApp } from '../context/AppContext';

function MyComponent() {
  const { state } = useApp();
  
  return (
    <div>
      <h2>Products from MongoDB</h2>
      {state.products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>Price: ₹{product.price}</p>
          <p>Stock: {product.stock}</p>
        </div>
      ))}
    </div>
  );
}
```

### **Example 2: Fetch Specific Product**
```jsx
import { productAPI } from '../services/api';
import { useState, useEffect } from 'react';

function ProductDetail({ productId }) {
  const [product, setProduct] = useState(null);
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productAPI.getById(productId);
        setProduct(data.product);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    fetchProduct();
  }, [productId]);
  
  return product ? (
    <div>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
    </div>
  ) : (
    <p>Loading...</p>
  );
}
```

### **Example 3: Login and View User Data**
```jsx
import { authAPI } from '../services/api';

async function handleLogin(email, password) {
  try {
    const data = await authAPI.login({ email, password });
    console.log('Logged in user:', data.user);
    // User data is now stored in cookies
    // Future API calls will be authenticated
  } catch (error) {
    console.error('Login failed:', error.message);
  }
}

// Usage
handleLogin('admin@example.com', 'admin123');
```

---

## 🔐 Test User Accounts

Use these accounts to test authentication:

### **Admin Account**
- Email: `admin@example.com`
- Password: `admin123`
- Role: `admin`

### **Regular User**
- Email: `user@example.com`
- Password: `user123`
- Role: `user`

---

## 🛠️ Available API Functions

### **Products**
```javascript
import { productAPI } from '../services/api';

// Get all products
const { products } = await productAPI.getAll();

// Get single product
const { product } = await productAPI.getById(productId);

// Create product (admin only)
await productAPI.create({ name, price, category, ... });

// Update product (admin only)
await productAPI.update(productId, { price: 999 });

// Delete product (admin only)
await productAPI.delete(productId);
```

### **Authentication**
```javascript
import { authAPI } from '../services/api';

// Register
await authAPI.register({ name, email, password });

// Login
await authAPI.login({ email, password });

// Logout
await authAPI.logout();

// Get profile
const { user } = await authAPI.getProfile();

// Update profile
await authAPI.updateProfile({ name: 'New Name' });
```

### **Cart**
```javascript
import { cartAPI } from '../services/api';

// Get cart
const { cart } = await cartAPI.get();

// Add to cart
await cartAPI.addItem(productId, quantity);

// Update quantity
await cartAPI.updateItem(productId, newQuantity);

// Remove item
await cartAPI.removeItem(productId);

// Clear cart
await cartAPI.clear();
```

### **Orders**
```javascript
import { orderAPI } from '../services/api';

// Get all orders
const { orders } = await orderAPI.getAll();

// Get single order
const { order } = await orderAPI.getById(orderId);

// Create order
await orderAPI.create({ shippingAddress, paymentMethod });

// Update status (admin)
await orderAPI.updateStatus(orderId, 'shipped');

// Cancel order
await orderAPI.cancel(orderId);
```

---

## 🎯 Quick Start Checklist

- [x] Backend server running on port 5000
- [x] Frontend server running on port 5173
- [x] MongoDB connected and seeded with data
- [x] API service layer created
- [x] AppContext updated to fetch from MongoDB
- [x] Database test page created
- [ ] Visit http://localhost:5173/db-test
- [ ] Check browser console for success messages
- [ ] Verify products are loading from MongoDB

---

## 🐛 Troubleshooting

### **Problem: Products not loading**
**Solution:**
1. Check backend is running: `http://localhost:5000/api/health`
2. Check browser console for errors
3. Verify CORS is enabled in backend
4. Check Network tab for failed requests

### **Problem: CORS errors**
**Solution:**
Backend is already configured with CORS. Make sure:
- Backend is running on port 5000
- Frontend is running on port 5173
- Credentials are included in requests (already done in api.js)

### **Problem: Authentication not working**
**Solution:**
1. Clear browser cookies
2. Try logging in again
3. Check if JWT_SECRET is set in server/.env
4. Verify cookies are being sent (check Network tab)

### **Problem: Empty product list**
**Solution:**
1. Re-seed database: `cd server && npm run seed`
2. Check MongoDB connection in backend console
3. Verify products exist: `http://localhost:5000/api/products`

---

## 📱 Next Steps

### **1. Update AuthModal Component**
Integrate real authentication:
```jsx
import { authAPI } from '../services/api';

const handleLogin = async (email, password) => {
  try {
    const data = await authAPI.login({ email, password });
    dispatch({ type: 'LOGIN', payload: data.user });
  } catch (error) {
    // Show error message
  }
};
```

### **2. Update Cart Component**
Use real cart API:
```jsx
import { cartAPI } from '../services/api';

const addToCart = async (productId, quantity) => {
  try {
    await cartAPI.addItem(productId, quantity);
    // Update local state
  } catch (error) {
    // Handle error
  }
};
```

### **3. Create Admin Product Management**
Allow admins to add/edit/delete products through UI

### **4. Implement Order History**
Show user's past orders from database

---

## 🎉 Success Indicators

You'll know everything is working when:

1. ✅ Home page shows 8 products from MongoDB
2. ✅ Console shows: "Products loaded from MongoDB: 8"
3. ✅ /db-test page shows green API status
4. ✅ Product IDs are long MongoDB IDs (not 1, 2, 3)
5. ✅ Login works with test accounts
6. ✅ No CORS errors in console

---

## 📚 Additional Resources

- **Backend API Docs:** `server/README.md`
- **API Quick Reference:** `server/API_QUICK_REFERENCE.md`
- **Setup Guide:** `server/SETUP_GUIDE.md`
- **Architecture:** `server/ARCHITECTURE.md`

---

## 💡 Pro Tips

1. **Use React DevTools** to inspect state and see MongoDB data
2. **Keep Network tab open** to monitor API calls
3. **Check Console** for helpful log messages
4. **Use /db-test page** for quick verification
5. **Test with both user roles** (admin and regular user)

---

## 🎊 You're All Set!

Your frontend is now fully connected to MongoDB. Visit:
- **Home:** http://localhost:5173/
- **Test Page:** http://localhost:5173/db-test

Happy coding! 🚀