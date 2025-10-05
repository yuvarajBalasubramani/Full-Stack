# ⚡ QUICK FIX: Render Deployment Error

## ❌ Your Error
```
bash: line 1: index.js: command not found
```

## ✅ IMMEDIATE FIX (2 Minutes)

### **Go to Render Dashboard**

1. Open: https://dashboard.render.com/
2. Click on your service
3. Click **"Settings"** tab
4. Scroll to **"Build & Deploy"** section

### **Update These Fields:**

**Root Directory:**
```
server
```

**Build Command:**
```
npm install
```

**Start Command:**
```
npm start
```

### **Save and Deploy**

1. Click **"Save Changes"**
2. Render will automatically redeploy
3. Wait 2-3 minutes
4. Check logs for: `Server running on port 10000`

---

## ✅ Alternative: Use render.yaml (Better)

If the above doesn't work, use the `render.yaml` configuration:

1. **Delete current service** in Render
2. **Create new Blueprint**:
   - Dashboard → "New +" → "Blueprint"
   - Connect GitHub repo
   - Render detects `render.yaml` automatically
3. **Add environment variables**:
   ```
   MONGODB_URI = your_mongodb_connection_string
   JWT_SECRET = your_secret_key_32_chars
   NODE_ENV = production
   ```
4. **Deploy**

---

## 📚 Full Guides Available

- **`RENDER_ERROR_FIX.md`** - Detailed error explanation
- **`RENDER_DEPLOYMENT_GUIDE.md`** - Complete deployment guide
- **`RENDER_SINGLE_SERVICE.md`** - Deploy as single service

---

## 🆘 Still Stuck?

Check your Render logs for the actual error and refer to the detailed guides above.

**Most common issues:**
1. Wrong Start Command → Use `npm start` not `index.js`
2. Wrong Root Directory → Set to `server`
3. Missing environment variables → Add `MONGODB_URI`, `JWT_SECRET`
4. MongoDB Network Access → Allow `0.0.0.0/0` in Atlas

---

## ✅ Expected Success

After fixing, logs should show:
```
==> Running 'npm start'
> server@1.0.0 start
> node src/index.js

Connected to MongoDB
Server running on port 10000
```

**Then test**: `https://your-service.onrender.com/api/health`

Should return: `{"status":"ok"}`

---

**Good luck! 🚀**