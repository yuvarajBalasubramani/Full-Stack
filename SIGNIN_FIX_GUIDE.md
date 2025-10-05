# Sign In/Sign Up Fix Guide

## Problem
Users were getting "signin failed fetch" message when trying to register or login, preventing data from being stored in MongoDB Atlas.

## Root Causes Fixed

### 1. CORS Configuration Issue
**Problem**: Frontend was running on port 5174, but backend only allowed port 5173.
**Solution**: Updated backend to accept both ports.

### 2. Missing Role Field
**Problem**: Registration wasn't sending the role field to backend.
**Solution**: Updated auth controller to accept and store role field.

### 3. Poor Error Messages
**Problem**: Generic "fetch failed" errors didn't help debug issues.
**Solution**: Added detailed error messages and logging.

## Changes Made

### Backend Changes

#### 1. `server/src/index.js` - CORS Configuration
```javascript
// Now accepts multiple origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.CLIENT_URL
];
```

#### 2. `server/src/controllers/authController.js` - Registration
- Added role field support
- Added validation for required fields
- Added detailed console logging
- Improved error messages
- Returns both `_id` and `id` fields for compatibility

#### 3. `server/src/controllers/authController.js` - Login
- Added input validation
- Added console logging for debugging
- Improved error messages
- Returns default values for orderCount and totalSpent

### Frontend Changes

#### 1. `src/services/api.js` - Better Error Handling
- Added specific error messages for network failures
- Helps users understand if backend is down

#### 2. `src/components/ConnectionStatus.jsx` - NEW
- Visual indicator when backend is disconnected
- Auto-checks connection every 30 seconds
- Provides instructions to start backend
- Retry button for manual checks

#### 3. `src/App.jsx` - Added Connection Status
- Shows connection status component at top of page

## How to Test

### Step 1: Ensure Backend is Running
```bash
cd server
npm start
```

You should see:
```
Connected to MongoDB
Server running on port 5000
```

### Step 2: Ensure Frontend is Running
```bash
npm run dev
```

Frontend should be on http://localhost:5174 (or 5173)

### Step 3: Test Registration

1. Open browser to http://localhost:5174
2. Check top-right corner - should NOT see red "Backend Disconnected" warning
3. Click "Sign In" button in navigation
4. Click "Create Account" tab
5. Fill in the form:
   - Full Name: Test User
   - Email: test@example.com
   - Password: password123
   - Confirm Password: password123
   - Select role: User or Admin
6. Click "Create Account"

**Expected Result:**
- Green success message: "Registration successful! Welcome to EliteStore!"
- Modal closes after 1.5 seconds
- User is logged in
- Navigation shows user avatar/name

**Backend Console Should Show:**
```
Registration attempt: { name: 'Test User', email: 'test@example.com', role: 'user' }
User created successfully: [MongoDB ObjectId]
```

### Step 4: Verify in MongoDB Atlas

1. Go to MongoDB Atlas dashboard
2. Navigate to your cluster
3. Click "Browse Collections"
4. Select database: `Ecommerce`
5. Select collection: `users`
6. You should see your new user with:
   - name
   - email
   - password (hashed)
   - role
   - orderCount: 0
   - totalSpent: 0
   - createdAt
   - updatedAt

### Step 5: Test Login

1. Logout (if logged in)
2. Click "Sign In" button
3. Enter credentials:
   - Email: test@example.com
   - Password: password123
4. Click "Sign In to EliteStore"

**Expected Result:**
- Green success message: "Login successful! Welcome back, Test User"
- Modal closes
- User is logged in

**Backend Console Should Show:**
```
Login attempt: { email: 'test@example.com' }
Login successful: [MongoDB ObjectId]
```

## Troubleshooting

### Issue: "Backend Disconnected" Warning Appears

**Solution:**
1. Check if backend is running: `cd server && npm start`
2. Check MongoDB connection string in `server/.env`
3. Verify MongoDB Atlas allows your IP address

### Issue: "Email already in use"

**Solution:**
- This email is already registered
- Use a different email or login with existing credentials
- Or delete the user from MongoDB Atlas

### Issue: "Cannot connect to server"

**Possible Causes:**
1. Backend not running on port 5000
2. Firewall blocking port 5000
3. Another process using port 5000

**Check:**
```powershell
# Check if port 5000 is in use
Get-NetTCPConnection -LocalPort 5000
```

### Issue: "Invalid credentials" on Login

**Solution:**
- Check email spelling
- Check password (case-sensitive)
- Ensure user was successfully registered

### Issue: Registration succeeds but user not in MongoDB

**Check:**
1. Backend console for errors
2. MongoDB connection string is correct
3. MongoDB Atlas network access allows your IP
4. Database name is "Ecommerce" (case-sensitive)

## API Endpoints

### Register
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

### Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Check Connection
```
GET http://localhost:5000/api/health
```

## Environment Variables

### Backend (.env in server folder)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://yuvaraj:yuvaraj2501@cluster0.xidzgf8.mongodb.net/Ecommerce
JWT_SECRET=your-super-secret-jwt-key-please-change-this-in-production
CLIENT_URL=http://localhost:5173
```

## Security Notes

1. **JWT Secret**: Change `JWT_SECRET` in production to a strong random string
2. **Password Hashing**: Passwords are automatically hashed using bcrypt before storing
3. **HTTP-Only Cookies**: JWT tokens are stored in HTTP-only cookies for security
4. **CORS**: Only specified origins can access the API

## Next Steps

After successful registration/login, users can:
1. Browse products
2. Add items to cart
3. Place orders
4. View order history
5. Manage addresses

All data will be stored in MongoDB Atlas!