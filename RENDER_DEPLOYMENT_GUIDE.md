# 🚀 Render Deployment Guide - EliteStore Full Stack App

## 📋 Overview

This guide will help you deploy your EliteStore application to Render. Your app has:
- **Frontend**: React + Vite (Static Site)
- **Backend**: Node.js + Express + MongoDB (Web Service)

---

## 🎯 Deployment Strategy

You have **TWO OPTIONS**:

### **Option 1: Two Separate Services (RECOMMENDED)**
Deploy frontend and backend as separate services using `render.yaml`

### **Option 2: Single Service**
Deploy backend only and serve frontend from Express

---

## ✅ OPTION 1: Two Separate Services (RECOMMENDED)

### **Step 1: Prepare Your Repository**

1. **Commit all changes to GitHub:**
```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

2. **Verify `render.yaml` exists** in your root directory (already created)

---

### **Step 2: Deploy Backend Service**

1. **Go to Render Dashboard**: https://dashboard.render.com/
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure Backend Service:**

   - **Name**: `elitestore-backend`
   - **Region**: Oregon (US West)
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. **Add Environment Variables:**
   Click "Advanced" → "Add Environment Variable"

   ```
   NODE_ENV = production
   MONGODB_URI = your_mongodb_atlas_connection_string
   JWT_SECRET = your_secret_key_here_min_32_chars
   CLIENT_URL = (leave empty for now, will add after frontend deployment)
   PORT = 10000
   ```

   **Important**: 
   - Get `MONGODB_URI` from MongoDB Atlas
   - Generate a strong `JWT_SECRET` (at least 32 characters)

6. **Click "Create Web Service"**
7. **Wait for deployment** (takes 2-5 minutes)
8. **Copy the backend URL** (e.g., `https://elitestore-backend.onrender.com`)

---

### **Step 3: Deploy Frontend Service**

1. **Click "New +" → "Static Site"**
2. **Connect your GitHub repository**
3. **Configure Frontend Service:**

   - **Name**: `elitestore-frontend`
   - **Region**: Oregon (US West)
   - **Branch**: `main`
   - **Root Directory**: (leave empty)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. **Add Environment Variable:**
   Click "Advanced" → "Add Environment Variable"

   ```
   VITE_API_URL = https://elitestore-backend.onrender.com/api
   ```

   **Replace with your actual backend URL from Step 2**

5. **Click "Create Static Site"**
6. **Wait for deployment** (takes 2-5 minutes)
7. **Copy the frontend URL** (e.g., `https://elitestore-frontend.onrender.com`)

---

### **Step 4: Update Backend CORS**

1. **Go back to Backend Service**
2. **Click "Environment"**
3. **Update `CLIENT_URL` variable:**
   ```
   CLIENT_URL = https://elitestore-frontend.onrender.com
   ```
4. **Click "Save Changes"**
5. **Backend will automatically redeploy**

---

### **Step 5: Test Your Deployment**

1. **Open your frontend URL** in browser
2. **Check Connection Status** (top-right corner)
   - Should show "Connected" or no warning
3. **Test Registration:**
   - Click "Sign In" → "Create Account"
   - Fill in details and register
4. **Test Login:**
   - Login with your credentials
5. **Test Features:**
   - Browse products
   - Add to cart
   - Place order
   - View order history

---

## 🔧 OPTION 2: Single Service (Backend Serves Frontend)

If you prefer a single service, follow these steps:

### **Step 1: Modify Backend to Serve Frontend**

Add this to `server/src/index.js` (after all routes):

```javascript
const path = require('path');

// Serve static files from React build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
  });
}
```

### **Step 2: Update Root package.json**

Add a build script that builds both frontend and backend:

```json
{
  "scripts": {
    "build": "npm install && npm run build && cd server && npm install",
    "start": "cd server && npm start"
  }
}
```

### **Step 3: Deploy to Render**

1. **Click "New +" → "Web Service"**
2. **Configure:**
   - **Build Command**: `npm install && npm run build && cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Root Directory**: (leave empty)

3. **Add Environment Variables:**
   ```
   NODE_ENV = production
   MONGODB_URI = your_mongodb_atlas_connection_string
   JWT_SECRET = your_secret_key_here
   ```

4. **Deploy and test**

---

## 🐛 Troubleshooting

### **"bash: line 1: index.js: command not found"**
**Problem**: Render is trying to run `index.js` directly instead of with Node.js

**Solution**: 
- Check your Start Command is: `npm start` or `node src/index.js`
- NOT just: `index.js`

---

### **"Cannot connect to server" in frontend**
**Problem**: Frontend can't reach backend

**Solutions**:
1. Check `VITE_API_URL` environment variable is set correctly
2. Verify backend is running (check backend logs)
3. Ensure `CLIENT_URL` is set in backend environment variables
4. Check CORS configuration in `server/src/index.js`

---

### **"CORS Error" in browser console**
**Problem**: Backend is blocking frontend requests

**Solution**:
1. Add your frontend URL to `CLIENT_URL` environment variable
2. Verify CORS configuration in `server/src/index.js` includes your frontend URL
3. Redeploy backend after changes

---

### **"MongoDB connection error"**
**Problem**: Backend can't connect to MongoDB Atlas

**Solutions**:
1. Verify `MONGODB_URI` is correct
2. Check MongoDB Atlas Network Access:
   - Go to MongoDB Atlas → Network Access
   - Add IP: `0.0.0.0/0` (allow from anywhere)
3. Verify database user credentials

---

### **"Build failed" during deployment**
**Problem**: Dependencies or build process failing

**Solutions**:
1. Check build logs for specific errors
2. Verify all dependencies are in `package.json`
3. Test build locally: `npm install && npm run build`
4. Check Node.js version compatibility

---

### **Frontend shows but API calls fail**
**Problem**: Frontend deployed but can't communicate with backend

**Solutions**:
1. Open browser DevTools → Network tab
2. Check if API calls are going to correct URL
3. Verify `VITE_API_URL` environment variable
4. Check backend logs for errors
5. Test backend health endpoint: `https://your-backend-url.onrender.com/api/health`

---

## 📝 Important Notes

### **Free Tier Limitations:**
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month free (enough for 1 service running 24/7)

### **Environment Variables:**
- Frontend env vars must start with `VITE_`
- Backend env vars are accessed via `process.env`
- Changes to env vars trigger automatic redeployment

### **Build Times:**
- Frontend: 2-5 minutes
- Backend: 1-3 minutes
- Subsequent deploys are faster (cached dependencies)

### **Custom Domains:**
- Free tier includes `.onrender.com` subdomain
- Custom domains available on paid plans

---

## ✅ Deployment Checklist

Before deploying, ensure:

- [ ] All code committed and pushed to GitHub
- [ ] MongoDB Atlas database created and accessible
- [ ] MongoDB Network Access allows connections from anywhere (0.0.0.0/0)
- [ ] Strong JWT_SECRET generated (32+ characters)
- [ ] `render.yaml` file exists in root directory
- [ ] API URL uses environment variable (`VITE_API_URL`)
- [ ] CORS configuration includes production URLs
- [ ] All environment variables documented

After deploying:

- [ ] Backend health check responds: `/api/health`
- [ ] Frontend loads without errors
- [ ] Registration works
- [ ] Login works
- [ ] Products load from database
- [ ] Cart functionality works
- [ ] Orders can be placed
- [ ] Order history displays

---

## 🔗 Useful Links

- **Render Dashboard**: https://dashboard.render.com/
- **Render Docs**: https://render.com/docs
- **MongoDB Atlas**: https://cloud.mongodb.com/
- **Your GitHub Repo**: https://github.com/yuvarajBalasubramani/Full-Stack

---

## 🆘 Need Help?

If you encounter issues:

1. **Check Render Logs**:
   - Go to your service → "Logs" tab
   - Look for error messages

2. **Check Browser Console**:
   - Open DevTools (F12)
   - Look for errors in Console and Network tabs

3. **Test Backend Directly**:
   ```bash
   curl https://your-backend-url.onrender.com/api/health
   ```

4. **Verify Environment Variables**:
   - Go to service → "Environment" tab
   - Ensure all required variables are set

---

## 🎉 Success!

Once deployed, your app will be live at:
- **Frontend**: `https://elitestore-frontend.onrender.com`
- **Backend**: `https://elitestore-backend.onrender.com`

Share your live URL and enjoy your deployed full-stack application! 🚀