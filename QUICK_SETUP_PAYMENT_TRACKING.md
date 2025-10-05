# 🚀 Quick Setup: Payment & Tracking Features

## ⚡ 5-Minute Setup Guide

Follow these steps to get Google Pay, COD, and Order Tracking working in your app.

---

## Step 1: Get Your API Keys (5 minutes)

### Google Maps API Key

1. Go to: https://console.cloud.google.com/
2. Create a new project (or select existing)
3. Click "Enable APIs and Services"
4. Enable these APIs:
   - **Maps JavaScript API**
   - **Geocoding API**
   - **Directions API**
5. Go to "Credentials" → "Create Credentials" → "API Key"
6. Copy your API key
7. (Optional) Restrict key to your domain for security

### Google Pay Merchant ID

**For Testing (Recommended for now):**
- Use: `BCR2DN4T2QIVCXJ3` (Google's test merchant ID)
- No registration needed for testing

**For Production (Later):**
1. Go to: https://pay.google.com/business/console
2. Register your business
3. Complete verification
4. Get your Merchant ID

---

## Step 2: Configure Environment Variables (1 minute)

Create/Edit `.env` file in project root:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Google Maps API Key (REQUIRED)
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY_HERE

# Google Pay Configuration (Use test ID for now)
VITE_GOOGLE_PAY_MERCHANT_ID=BCR2DN4T2QIVCXJ3
VITE_GOOGLE_PAY_MERCHANT_NAME=EliteStore
VITE_GOOGLE_PAY_ENVIRONMENT=TEST
```

**Replace:**
- `YOUR_GOOGLE_MAPS_API_KEY_HERE` with your actual Google Maps API key

---

## Step 3: Update Your App Component (2 minutes)

### Option A: Replace Checkout Component

**Find this line in your app:**
```jsx
import Checkout from './components/Checkout.jsx';
```

**Replace with:**
```jsx
import Checkout from './components/CheckoutEnhanced.jsx';
```

### Option B: Add Order Tracking

**In your OrderHistory component or wherever you want tracking:**

```jsx
import OrderTracking from './components/OrderTracking.jsx';

// In your component
const [trackingOpen, setTrackingOpen] = useState(false);
const [selectedOrder, setSelectedOrder] = useState(null);

// Add button to open tracking
<button onClick={() => {
  setSelectedOrder(order);
  setTrackingOpen(true);
}}>
  Track Order
</button>

// Add tracking component
<OrderTracking 
  isOpen={trackingOpen}
  onClose={() => setTrackingOpen(false)}
  order={selectedOrder}
/>
```

---

## Step 4: Restart Your Servers (1 minute)

### Backend Server
```bash
cd server
npm run dev
```

### Frontend Server
```bash
npm run dev
```

---

## Step 5: Test Everything (5 minutes)

### Test 1: Google Pay
1. Add items to cart
2. Go to checkout
3. Select "Google Pay"
4. Click "Place Order"
5. ✅ Should see Google Pay payment sheet

### Test 2: Cash on Delivery
1. Add items to cart
2. Go to checkout
3. Select "Cash on Delivery"
4. Click "Place Order"
5. ✅ Should see success with "Keep ₹XXX ready" message

### Test 3: Order Tracking
1. Place an order
2. Go to Order History
3. Click "Track Order"
4. ✅ Should see map with delivery route

### Test 4: Order Cancellation
1. Place an order
2. Click "Track Order"
3. ✅ Should see "Cancellation Available" banner
4. Click "Cancel Order"
5. ✅ Order should be cancelled

---

## 🎯 What You Get

### Payment Methods
- ✅ Google Pay (online payment)
- ✅ Cash on Delivery
- ✅ Credit/Debit Card
- ✅ UPI Payment

### Order Tracking
- ✅ Live map with delivery location
- ✅ Route visualization
- ✅ Distance calculation
- ✅ Delivery person info

### Order Management
- ✅ 8 detailed order statuses
- ✅ 1-hour cancellation window
- ✅ Automatic refunds
- ✅ Complete order timeline

---

## 🐛 Troubleshooting

### Google Maps Not Loading?

**Check 1: API Key**
```bash
# In browser console (F12)
console.log(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
```
Should show your API key, not `undefined`

**Check 2: APIs Enabled**
Go to Google Cloud Console → APIs & Services → Enabled APIs
Should see:
- Maps JavaScript API ✅
- Geocoding API ✅
- Directions API ✅

**Check 3: Billing**
Google Maps requires billing to be enabled (even for free tier)

### Google Pay Not Showing?

**Check 1: Browser**
Google Pay works on:
- ✅ Chrome
- ✅ Edge
- ✅ Safari
- ❌ Firefox (limited support)

**Check 2: Environment**
```bash
# In browser console
console.log(import.meta.env.VITE_GOOGLE_PAY_ENVIRONMENT);
```
Should show `TEST` for development

**Check 3: Script Loaded**
```bash
# In browser console
console.log(window.google?.payments);
```
Should show object, not `undefined`

### Order Cancellation Not Working?

**Check 1: Time Window**
Cancellation only works within 1 hour of order placement

**Check 2: Order Status**
Can't cancel if status is:
- ❌ Delivered
- ❌ Cancelled
- ❌ Shipped (after 1 hour)

---

## 📁 Files Created

### Frontend Files
```
src/
├── components/
│   ├── CheckoutEnhanced.jsx      ← New checkout with Google Pay & COD
│   └── OrderTracking.jsx         ← Order tracking with Google Maps
├── services/
│   ├── googlePay.js              ← Google Pay integration
│   └── googleMaps.js             ← Google Maps integration
```

### Backend Files
```
server/src/
├── models/
│   └── Order.js                  ← Updated with new fields
├── controllers/
│   └── orderController.js        ← Updated with new methods
└── routes/
    └── orderRoutes.js            ← Updated with new endpoints
```

### Configuration Files
```
.env                              ← Environment variables
```

### Documentation Files
```
PAYMENT_AND_TRACKING_GUIDE.md     ← Complete guide
QUICK_SETUP_PAYMENT_TRACKING.md   ← This file
```

---

## 🔄 Database Migration

The Order model has been updated. If you have existing orders, they'll still work, but won't have new fields.

**To update existing orders (optional):**

```javascript
// Run this in MongoDB shell or Compass
db.orders.updateMany(
  {},
  {
    $set: {
      "cancellationInfo.canCancel": true,
      "cancellationInfo.cancelDeadline": new Date(Date.now() + 3600000),
      "deliveryTracking.estimatedDelivery": new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  }
);
```

---

## 🎨 UI Preview

### Checkout Page
```
┌─────────────────────────────────────────┐
│  📋 Order Summary    │  🚚 Shipping Info │
│  ─────────────────   │  ─────────────── │
│  Product 1  ₹999     │  Name: [____]    │
│  Product 2  ₹499     │  Email: [____]   │
│                      │  Phone: [____]   │
│  Subtotal:  ₹1498    │  Address: [____] │
│  Shipping:  ₹50      │                  │
│  Tax:       ₹270     │  💳 Payment      │
│  Total:     ₹1818    │  ─────────────── │
│                      │  [Google Pay]    │
│                      │  [Cash on Del.]  │
│                      │  [Card]          │
│                      │  [UPI]           │
│                      │                  │
│                      │  [Place Order]   │
└─────────────────────────────────────────┘
```

### Order Tracking
```
┌─────────────────────────────────────────┐
│  🗺️ Live Map         │  📦 Order Details│
│  ─────────────────   │  ─────────────── │
│                      │  Order #12345    │
│    🔵 Delivery       │                  │
│     │                │  ⏰ Cancel in:   │
│     │ 2.5 km         │  45 minutes      │
│     │                │                  │
│     ↓                │  Timeline:       │
│    🔴 Your Address   │  ✅ Confirmed    │
│                      │  ✅ Preparing    │
│  👤 Rajesh Kumar     │  🚚 Shipped      │
│  📞 +91-9876543210   │  ⏳ Delivering   │
│  [Call]              │                  │
└─────────────────────────────────────────┘
```

---

## 📊 Order Status Flow

```
Order Placed
    ↓
[Pending] ← Payment processing
    ↓
[Confirmed] ← Payment successful / COD
    ↓
[Preparing] ← Order being prepared
    ↓
[Shipped] ← Order shipped
    ↓
[Out for Delivery] ← On the way
    ↓
[Delivered] ← Order delivered ✅

OR

[Cancelled] ← Within 1 hour
    ↓
[Refunded] ← If paid online
```

---

## 🎯 Testing Checklist

- [ ] Google Maps API key configured
- [ ] Google Pay merchant ID configured
- [ ] Environment variables loaded
- [ ] Backend server running
- [ ] Frontend server running
- [ ] Can place order with Google Pay
- [ ] Can place order with COD
- [ ] Can track order on map
- [ ] Can cancel order within 1 hour
- [ ] Map shows delivery route
- [ ] Distance calculation works
- [ ] Order status updates correctly
- [ ] Payment status updates correctly

---

## 🚀 Next Steps

### For Development
1. Test all payment methods
2. Test order cancellation
3. Test order tracking
4. Check mobile responsiveness

### For Production
1. Get production Google Pay Merchant ID
2. Change environment to PRODUCTION
3. Restrict API keys to your domain
4. Enable HTTPS
5. Set up proper error logging
6. Configure email notifications
7. Set up SMS notifications

---

## 📞 Need Help?

### Common Issues

**Issue:** "Google Maps API key is invalid"
**Solution:** Check if billing is enabled in Google Cloud Console

**Issue:** "Google Pay not available"
**Solution:** Use Chrome browser and check merchant ID

**Issue:** "Can't cancel order"
**Solution:** Check if 1 hour has passed since order creation

**Issue:** "Map not loading"
**Solution:** Check browser console for errors, verify API key

### Documentation

- Full Guide: `PAYMENT_AND_TRACKING_GUIDE.md`
- API Reference: `server/API_QUICK_REFERENCE.md`
- Cart Guide: `CART_FIXED_README.md`

---

## ✅ Success!

If you've completed all steps, you now have:

✅ Google Pay integration
✅ Cash on Delivery option
✅ Google Maps order tracking
✅ 1-hour cancellation window
✅ Automatic refund processing
✅ Professional checkout experience

**Happy coding! 🎉**