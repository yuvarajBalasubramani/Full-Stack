# 🔧 Fix: "bash: line 1: index.js: command not found"

## ❌ Your Current Error

```
==> Running 'index.js'
bash: line 1: index.js: command not found
```

## 🎯 Root Cause

Render is trying to execute `index.js` as a shell command instead of running it with Node.js. This happens when the **Start Command** is incorrectly configured.

---

## ✅ SOLUTION: Update Render Configuration

### **Option A: Fix in Render Dashboard (QUICKEST)**

1. **Go to your Render service**
2. **Click "Settings" tab**
3. **Scroll to "Build & Deploy"**
4. **Update these fields:**

   **Build Command:**
   ```
   cd server && npm install
   ```

   **Start Command:**
   ```
   cd server && npm start
   ```

   **Root Directory:**
   ```
   (leave empty or set to: server)
   ```

5. **Click "Save Changes"**
6. **Render will automatically redeploy**

---

### **Option B: Use render.yaml (RECOMMENDED)**

The `render.yaml` file has already been created in your project root. To use it:

1. **Delete your current Render service**
   - Go to service → Settings → Delete Service

2. **Create new service using Blueprint**
   - Dashboard → "New +" → "Blueprint"
   - Connect your GitHub repo
   - Render will detect `render.yaml` and create services automatically

3. **Add Environment Variables** (for backend service):
   ```
   NODE_ENV = production
   MONGODB_URI = your_mongodb_atlas_uri
   JWT_SECRET = your_secret_key_min_32_chars
   CLIENT_URL = (add after frontend deploys)
   ```

4. **Deploy both services**

---

## 🔍 Why This Happens

Your project structure:
```
project/
├── package.json          (Frontend)
├── src/                  (Frontend code)
├── server/
│   ├── package.json      (Backend)
│   └── src/
│       └── index.js      (Backend entry point)
```

Render was trying to run from the root directory, but your backend is in the `server` folder.

---

## ✅ Verification

After fixing, you should see in Render logs:

```
==> Running 'cd server && npm start'
> server@1.0.0 start
> node src/index.js

Connected to MongoDB
Server running on port 10000
```

---

## 🚀 Next Steps

1. **Fix the Start Command** (Option A or B above)
2. **Wait for deployment** (2-3 minutes)
3. **Check logs** for "Server running on port..."
4. **Test health endpoint**: `https://your-service.onrender.com/api/health`
5. **Deploy frontend** (see RENDER_DEPLOYMENT_GUIDE.md)

---

## 🆘 Still Having Issues?

### **Check Build Command:**
Should be: `cd server && npm install`
NOT: `npm install; npm run build`

### **Check Start Command:**
Should be: `cd server && npm start`
NOT: `index.js` or `node index.js`

### **Check Root Directory:**
Should be: (empty) or `server`
NOT: `/` or `./`

### **Check package.json:**
Your `server/package.json` should have:
```json
{
  "scripts": {
    "start": "node src/index.js"
  }
}
```

---

## 📋 Complete Configuration Reference

### **For Backend Service:**
- **Name**: `elitestore-backend`
- **Environment**: `Node`
- **Region**: `Oregon`
- **Branch**: `main`
- **Root Directory**: `server` (or leave empty and use `cd server` in commands)
- **Build Command**: `npm install` (if Root Directory is `server`) OR `cd server && npm install` (if Root Directory is empty)
- **Start Command**: `npm start` (if Root Directory is `server`) OR `cd server && npm start` (if Root Directory is empty)

### **Environment Variables:**
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_very_long_secret_key_at_least_32_characters
CLIENT_URL=https://your-frontend-url.onrender.com
PORT=10000
```

---

## ✅ Expected Result

After fixing, your backend will deploy successfully and you'll be able to:
- Access health endpoint: `https://your-backend.onrender.com/api/health`
- Register users via API
- Login users via API
- Connect frontend to backend

---

**Need the full deployment guide?** See `RENDER_DEPLOYMENT_GUIDE.md`