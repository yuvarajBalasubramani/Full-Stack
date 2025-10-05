# 🚀 Single Service Deployment (Backend Serves Frontend)

## 📋 Overview

This guide shows how to deploy your entire app as a **single Render service** where the backend serves the frontend static files.

**Pros:**
- ✅ Simpler deployment (one service)
- ✅ No CORS issues
- ✅ Single URL for everything
- ✅ Cheaper (uses only 1 free service)

**Cons:**
- ❌ Backend must rebuild when frontend changes
- ❌ Slower builds (builds both frontend and backend)

---

## 🔧 Step 1: Modify Backend to Serve Frontend

Edit `server/src/index.js` and add this code **AFTER all your routes** (after line 48):

```javascript
const path = require('path');

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files
  app.use(express.static(path.join(__dirname, '../../dist')));
  
  // Handle React routing - return index.html for all non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
  });
}
```

**Full example:**

```javascript
// ... existing code ...

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ADD THIS SECTION
const path = require('path');

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
  });
}
// END OF NEW SECTION

const PORT = process.env.PORT || 5000;

// ... rest of the code ...
```

---

## 📝 Step 2: Update Root package.json

Edit `package.json` in the **root directory** and update the scripts:

```json
{
  "name": "elitestore-react",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "install-all": "npm install && cd server && npm install",
    "build-all": "npm install && npm run build && cd server && npm install"
  },
  "dependencies": {
    "lucide-react": "^0.344.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^7.8.1"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.1",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.18",
    "eslint": "^9.9.1",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.11",
    "globals": "^15.9.0",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "vite": "^5.4.19"
  }
}
```

---

## 🌐 Step 3: Update API URL for Production

Edit `src/services/api.js` and update the API_BASE_URL:

```javascript
// API Service for Backend Communication
// In production, API is served from same origin
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');
```

This makes the frontend use:
- **Production**: `/api` (same server)
- **Development**: `http://localhost:5000/api` (separate server)

---

## 🚀 Step 4: Deploy to Render

### **4.1: Commit Changes**

```bash
git add .
git commit -m "Configure for single-service deployment"
git push origin main
```

### **4.2: Create Web Service**

1. **Go to Render Dashboard**: https://dashboard.render.com/
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**

### **4.3: Configure Service**

**Basic Settings:**
- **Name**: `elitestore-fullstack`
- **Region**: Oregon (US West)
- **Branch**: `main`
- **Root Directory**: (leave empty)
- **Runtime**: Node
- **Build Command**: 
  ```
  npm install && npm run build && cd server && npm install
  ```
- **Start Command**: 
  ```
  cd server && npm start
  ```
- **Plan**: Free

### **4.4: Add Environment Variables**

Click "Advanced" → "Add Environment Variable":

```
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key_min_32_characters
PORT=10000
```

**Important:**
- Get `MONGODB_URI` from MongoDB Atlas
- Generate strong `JWT_SECRET` (32+ characters)
- `PORT` is automatically set by Render, but we specify 10000 as default

### **4.5: Deploy**

1. **Click "Create Web Service"**
2. **Wait for build** (5-10 minutes first time)
3. **Check logs** for success messages

---

## ✅ Step 5: Verify Deployment

### **5.1: Check Build Logs**

You should see:
```
==> Building...
✓ 1509 modules transformed.
✓ built in 4.15s

==> Starting server...
Connected to MongoDB
Server running on port 10000
```

### **5.2: Test Your App**

1. **Open your Render URL**: `https://elitestore-fullstack.onrender.com`
2. **Check homepage loads**
3. **Test registration**:
   - Click "Sign In" → "Create Account"
   - Fill in details
   - Should successfully register
4. **Test login**
5. **Test all features**

### **5.3: Test API Directly**

```bash
# Health check
curl https://elitestore-fullstack.onrender.com/api/health

# Should return: {"status":"ok"}
```

---

## 🐛 Troubleshooting

### **"Cannot GET /api/health"**
**Problem**: API routes not working

**Solution**: Ensure static file serving is added AFTER all API routes in `server/src/index.js`

---

### **"404 on page refresh"**
**Problem**: React Router not handling routes

**Solution**: Ensure the catch-all route (`app.get('*', ...)`) is added and comes LAST

---

### **"Build failed"**
**Problem**: Dependencies or build errors

**Solutions**:
1. Test locally: `npm run build-all`
2. Check build logs for specific errors
3. Verify all dependencies in package.json
4. Ensure Node.js version compatibility

---

### **"Frontend loads but API calls fail"**
**Problem**: API URL misconfigured

**Solutions**:
1. Check browser DevTools → Network tab
2. Verify API calls go to `/api/...` (not `http://localhost:5000/api/...`)
3. Check `src/services/api.js` has correct API_BASE_URL logic
4. Ensure `NODE_ENV=production` is set in Render

---

### **"MongoDB connection error"**
**Problem**: Can't connect to database

**Solutions**:
1. Verify `MONGODB_URI` in Render environment variables
2. Check MongoDB Atlas Network Access allows `0.0.0.0/0`
3. Verify database user credentials
4. Check Render logs for specific error

---

## 📊 Comparison: Single vs. Two Services

| Feature | Single Service | Two Services |
|---------|---------------|--------------|
| **Cost** | 1 free service | 2 free services |
| **Setup** | Simpler | More complex |
| **CORS** | No issues | Need configuration |
| **Build Time** | Longer (builds both) | Faster (separate) |
| **Deployment** | Rebuild both for any change | Independent deploys |
| **URLs** | One URL | Two URLs |
| **Scaling** | Scale together | Scale independently |

---

## 🎯 Recommendation

**Use Single Service if:**
- ✅ You want simplicity
- ✅ You're on free tier
- ✅ Your app is small-medium size
- ✅ You don't need independent scaling

**Use Two Services if:**
- ✅ You need independent scaling
- ✅ You want faster deployments
- ✅ You have separate teams for frontend/backend
- ✅ You need CDN for frontend

---

## 📝 Complete File Changes Summary

### **Files Modified:**

1. **`server/src/index.js`**
   - Added static file serving
   - Added catch-all route for React Router

2. **`package.json`** (root)
   - Added `build-all` script

3. **`src/services/api.js`**
   - Updated API_BASE_URL logic for production

### **Files Created:**

1. **`RENDER_SINGLE_SERVICE.md`** (this file)

---

## ✅ Success Checklist

After deployment:

- [ ] Service builds successfully
- [ ] Server starts without errors
- [ ] MongoDB connects
- [ ] Homepage loads at root URL
- [ ] API health check works: `/api/health`
- [ ] Registration works
- [ ] Login works
- [ ] Products load
- [ ] Cart works
- [ ] Orders work
- [ ] Page refresh doesn't break (React Router works)

---

## 🎉 You're Done!

Your full-stack app is now deployed as a single service on Render! 🚀

**Your app URL**: `https://elitestore-fullstack.onrender.com`

---

**Need help?** Check the main deployment guide: `RENDER_DEPLOYMENT_GUIDE.md`