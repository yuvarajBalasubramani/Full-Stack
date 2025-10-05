# 🚀 Payment & Order Tracking Integration Guide

## Overview

This guide covers the integration of **Google Pay**, **Cash on Delivery (COD)**, and **Google Maps Order Tracking** features in your e-commerce application.

---

## 📋 Table of Contents

1. [Features Implemented](#features-implemented)
2. [Setup Instructions](#setup-instructions)
3. [Google Pay Integration](#google-pay-integration)
4. [Cash on Delivery](#cash-on-delivery)
5. [Google Maps Tracking](#google-maps-tracking)
6. [Order Cancellation](#order-cancellation)
7. [API Endpoints](#api-endpoints)
8. [Testing Guide](#testing-guide)
9. [Troubleshooting](#troubleshooting)

---

## ✨ Features Implemented

### Payment Methods
- ✅ **Google Pay** - Fast, secure online payment
- ✅ **Cash on Delivery (COD)** - Pay when you receive
- ✅ **Credit/Debit Card** - Traditional card payment
- ✅ **UPI Payment** - PhonePe, Paytm, etc.

### Order Tracking
- ✅ **Google Maps Integration** - Real-time delivery tracking
- ✅ **Live Location Updates** - See delivery person's location
- ✅ **Route Visualization** - View delivery route on map
- ✅ **Distance Calculation** - Know how far your order is

### Order Management
- ✅ **Detailed Order Statuses** - 8 different status levels
- ✅ **1-Hour Cancellation Window** - Cancel within 1 hour
- ✅ **Automatic Refunds** - For cancelled paid orders
- ✅ **Status History** - Complete order timeline

---

## 🔧 Setup Instructions

### Step 1: Get API Keys

#### Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable these APIs:
   - Maps JavaScript API
   - Geocoding API
   - Directions API
   - Places API
4. Create credentials → API Key
5. Copy your API key

#### Google Pay Merchant ID
1. Go to [Google Pay Business Console](https://pay.google.com/business/console)
2. Register your business
3. Get your Merchant ID
4. Copy your Merchant ID

### Step 2: Configure Environment Variables

Edit `.env` file in project root:

```env
# Frontend Environment Variables
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
VITE_GOOGLE_PAY_MERCHANT_ID=your_google_pay_merchant_id_here
VITE_GOOGLE_PAY_MERCHANT_NAME=EliteStore
VITE_GOOGLE_PAY_ENVIRONMENT=TEST
```

**Important:** 
- Replace `your_google_maps_api_key_here` with your actual Google Maps API key
- Replace `your_google_pay_merchant_id_here` with your actual Google Pay Merchant ID
- Use `TEST` environment for development, `PRODUCTION` for live

### Step 3: Install Dependencies

No additional dependencies needed! All integrations use vanilla JavaScript and existing packages.

### Step 4: Update Your App

Replace the old Checkout component with the new enhanced version:

**In your main App.jsx or wherever Checkout is used:**

```jsx
// Old import
// import Checkout from './components/Checkout.jsx';

// New import
import Checkout from './components/CheckoutEnhanced.jsx';
```

---

## 💳 Google Pay Integration

### How It Works

1. User selects Google Pay as payment method
2. Clicks "Place Order" button
3. Google Pay sheet opens
4. User completes payment
5. Payment token is received
6. Order is created with payment confirmation

### Implementation Details

**Service File:** `src/services/googlePay.js`

Key functions:
- `loadGooglePayScript()` - Loads Google Pay SDK
- `isGooglePayAvailable()` - Checks if Google Pay is available
- `processGooglePayPayment(amount)` - Processes payment

### Testing Google Pay

**Test Mode:**
```env
VITE_GOOGLE_PAY_ENVIRONMENT=TEST
```

In TEST mode, you can use test cards:
- Card Number: 4111 1111 1111 1111
- Expiry: Any future date
- CVV: Any 3 digits

**Production Mode:**
```env
VITE_GOOGLE_PAY_ENVIRONMENT=PRODUCTION
```

### Google Pay Button

The component automatically shows Google Pay button if available. If not available, it gracefully falls back to other payment methods.

---

## 💵 Cash on Delivery

### How It Works

1. User selects "Cash on Delivery" as payment method
2. Order is placed with payment status "pending"
3. User pays in cash when order is delivered
4. Delivery person updates payment status to "completed"

### Features

- ✅ No upfront payment required
- ✅ Pay exact amount on delivery
- ✅ Can cancel within 1 hour
- ✅ No refund processing needed for cancellation

### COD Order Flow

```
Order Placed (COD) 
  ↓
Status: Confirmed
Payment: Pending
  ↓
Order Shipped
  ↓
Out for Delivery
  ↓
Delivered + Cash Collected
  ↓
Payment Status: Completed
```

### Implementation

**Component:** `src/components/CheckoutEnhanced.jsx`

COD orders are automatically:
- Set to "confirmed" status immediately
- Payment status set to "pending"
- Can be cancelled within 1 hour
- Payment completed on delivery

---

## 🗺️ Google Maps Tracking

### How It Works

1. Order is placed with shipping address
2. Address is geocoded to coordinates
3. Delivery person's location is tracked
4. Map shows both locations and route
5. Real-time updates as delivery progresses

### Features

- ✅ **Live Map View** - See delivery on map
- ✅ **Route Display** - Blue line showing route
- ✅ **Distance Calculation** - Know exact distance
- ✅ **Delivery Person Info** - Name and phone
- ✅ **Call Delivery Person** - Direct call button

### Implementation Details

**Service File:** `src/services/googleMaps.js`

Key functions:
- `loadGoogleMapsScript()` - Loads Google Maps SDK
- `initializeMap(elementId, options)` - Creates map
- `addCustomMarker(map, position, icon, title)` - Adds markers
- `drawRoute(map, origin, destination)` - Draws route
- `calculateDistance(point1, point2)` - Calculates distance
- `geocodeAddress(address)` - Converts address to coordinates

**Component:** `src/components/OrderTracking.jsx`

### Map Markers

- 🔵 **Blue Marker** - Delivery person's current location
- 🔴 **Red Marker** - Delivery destination (your address)
- 📍 **Blue Line** - Delivery route

### Accessing Order Tracking

From Order History, click "Track Order" button to open tracking view.

---

## ⏰ Order Cancellation

### 1-Hour Cancellation Window

Users can cancel orders within **1 hour** of placing them.

### Cancellation Rules

| Order Status | Can Cancel? | Refund? |
|-------------|-------------|---------|
| Pending | ✅ Yes | N/A |
| Confirmed | ✅ Yes (within 1hr) | ✅ Yes (if paid) |
| Preparing | ✅ Yes (within 1hr) | ✅ Yes (if paid) |
| Shipped | ❌ No | ❌ No |
| Out for Delivery | ❌ No | ❌ No |
| Delivered | ❌ No | ❌ No |
| Cancelled | ❌ Already cancelled | - |

### Refund Process

**For Online Payments (Google Pay, Card, UPI):**
1. Order cancelled by user
2. Refund status set to "pending"
3. Refund amount = Total order amount
4. Payment status changed to "refunded"
5. Refund processed within 5-7 business days

**For Cash on Delivery:**
1. Order cancelled by user
2. No refund needed (payment not made)
3. Order status changed to "cancelled"

### Implementation

**Backend:** `server/src/controllers/orderController.js`

```javascript
exports.cancelOrder = async (req, res) => {
  // Check if order can be cancelled
  if (!order.canBeCancelled()) {
    return res.status(400).json({ 
      message: 'Cancellation window expired' 
    });
  }
  
  // Process cancellation and refund
  // ...
};
```

**Model Method:** `server/src/models/Order.js`

```javascript
orderSchema.methods.canBeCancelled = function() {
  if (this.status === 'cancelled' || this.status === 'delivered') {
    return false;
  }
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  return this.createdAt > oneHourAgo;
};
```

---

## 🔌 API Endpoints

### Order Endpoints

#### Create Order
```http
POST /api/orders
Authorization: Bearer <token>

{
  "items": [...],
  "total": 1299.00,
  "subtotal": 1099.00,
  "shipping": 50.00,
  "tax": 150.00,
  "shippingAddress": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "address": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "country": "India"
  },
  "paymentInfo": {
    "method": "googlepay",
    "googlePayToken": "token_here"
  }
}
```

#### Get User Orders
```http
GET /api/orders
Authorization: Bearer <token>
```

#### Cancel Order
```http
PUT /api/orders/:orderId/cancel
Authorization: Bearer <token>

{
  "reason": "Changed my mind"
}
```

#### Update Order Status (Admin)
```http
PUT /api/orders/:orderId/status
Authorization: Bearer <admin_token>

{
  "status": "shipped",
  "note": "Order shipped via FedEx",
  "location": {
    "lat": 28.6139,
    "lng": 77.2090
  }
}
```

#### Update Delivery Tracking (Admin)
```http
PUT /api/orders/:orderId/tracking
Authorization: Bearer <admin_token>

{
  "location": {
    "lat": 28.6139,
    "lng": 77.2090
  },
  "deliveryPersonName": "Rajesh Kumar",
  "deliveryPersonPhone": "+919876543210",
  "note": "On the way"
}
```

---

## 🧪 Testing Guide

### Test Scenario 1: Google Pay Payment

1. Add items to cart
2. Go to checkout
3. Fill shipping information
4. Select "Google Pay" as payment method
5. Click "Place Order"
6. Complete Google Pay payment
7. Verify order is created with status "confirmed"
8. Check payment status is "completed"

### Test Scenario 2: Cash on Delivery

1. Add items to cart
2. Go to checkout
3. Fill shipping information
4. Select "Cash on Delivery"
5. Click "Place Order"
6. Verify order is created with status "confirmed"
7. Check payment status is "pending"
8. Note: "Keep ₹XXX ready for payment" message

### Test Scenario 3: Order Tracking

1. Place an order
2. Go to Order History
3. Click "Track Order" on any order
4. Verify map loads with markers
5. Check delivery person info (if available)
6. Verify route is drawn between locations
7. Check distance calculation

### Test Scenario 4: Order Cancellation

1. Place an order
2. Immediately go to Order History
3. Click "Track Order"
4. Verify "Cancellation Available" banner shows
5. Check time remaining (should be close to 1 hour)
6. Click "Cancel Order"
7. Verify order status changes to "cancelled"
8. If paid online, check refund status is "pending"

### Test Scenario 5: Cancellation Window Expired

1. Place an order
2. Wait for 1 hour (or modify order creation time in DB)
3. Try to cancel order
4. Verify error message: "Cancellation window expired"

---

## 🐛 Troubleshooting

### Google Maps Not Loading

**Problem:** Map shows "Loading..." forever

**Solutions:**
1. Check API key is correct in `.env`
2. Verify Google Maps API is enabled in Google Cloud Console
3. Check browser console for errors
4. Ensure you have billing enabled on Google Cloud (required for Maps API)

**Check API Key:**
```bash
# In browser console
console.log(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
```

### Google Pay Not Available

**Problem:** Google Pay option doesn't show

**Solutions:**
1. Check if browser supports Google Pay (Chrome, Edge, Safari)
2. Verify Merchant ID is correct
3. Check Google Pay API is enabled
4. Try in TEST environment first

**Debug:**
```javascript
// In browser console
isGooglePayAvailable().then(available => {
  console.log('Google Pay available:', available);
});
```

### Order Cancellation Not Working

**Problem:** "Cancel Order" button doesn't work

**Solutions:**
1. Check if 1 hour has passed since order creation
2. Verify order status is not "delivered" or "cancelled"
3. Check backend logs for errors
4. Ensure user is authenticated

**Check Cancellation Status:**
```javascript
// In browser console
const order = { 
  createdAt: new Date(), 
  status: 'confirmed' 
};
const canCancel = new Date() - new Date(order.createdAt) < 3600000;
console.log('Can cancel:', canCancel);
```

### Payment Status Not Updating

**Problem:** COD payment stays "pending" after delivery

**Solution:**
Admin needs to update order status to "delivered" which automatically updates payment status for COD orders.

**API Call:**
```bash
curl -X PUT http://localhost:5000/api/orders/ORDER_ID/status \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "delivered"}'
```

---

## 📊 Order Status Flow

### Complete Status Flow

```
┌─────────────┐
│   PENDING   │ ← Order created, payment processing
└──────┬──────┘
       │
       ↓
┌─────────────┐
│  CONFIRMED  │ ← Payment successful / COD order
└──────┬──────┘
       │
       ↓
┌─────────────┐
│  PREPARING  │ ← Order being prepared
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   SHIPPED   │ ← Order shipped
└──────┬──────┘
       │
       ↓
┌─────────────────┐
│ OUT_FOR_DELIVERY│ ← Out for delivery
└────────┬────────┘
         │
         ↓
┌─────────────┐
│  DELIVERED  │ ← Order delivered
└─────────────┘

         OR
         
┌─────────────┐
│  CANCELLED  │ ← Order cancelled (within 1 hour)
└─────────────┘
         │
         ↓
┌─────────────┐
│   REFUNDED  │ ← Refund processed (if paid)
└─────────────┘
```

---

## 🎯 Best Practices

### For Development

1. **Always use TEST environment** for Google Pay during development
2. **Test cancellation window** by modifying order creation time
3. **Use mock coordinates** for testing maps (don't need real delivery person)
4. **Check browser console** for errors and debug logs

### For Production

1. **Switch to PRODUCTION environment** for Google Pay
2. **Secure API keys** - Never commit to Git
3. **Enable billing** on Google Cloud for Maps API
4. **Set up proper error handling** for payment failures
5. **Monitor refund status** and process refunds promptly
6. **Update delivery tracking** regularly for better UX

### Security

1. **Validate payment tokens** on backend
2. **Check user authorization** before cancelling orders
3. **Verify cancellation window** on backend (don't trust frontend)
4. **Sanitize location data** before storing
5. **Use HTTPS** in production for payment security

---

## 📱 Mobile Responsiveness

All components are fully responsive:

- ✅ Checkout form adapts to mobile screens
- ✅ Map view works on mobile devices
- ✅ Touch-friendly buttons and controls
- ✅ Optimized for small screens

---

## 🚀 Next Steps

### Recommended Enhancements

1. **SMS Notifications** - Send order updates via SMS
2. **Email Notifications** - Send order confirmation emails
3. **Push Notifications** - Real-time delivery updates
4. **Multiple Addresses** - Save and select from multiple addresses
5. **Order Rating** - Let users rate their delivery experience
6. **Delivery Instructions** - Add special delivery instructions
7. **Scheduled Delivery** - Choose delivery time slot
8. **Gift Wrapping** - Add gift wrapping option

### Integration Ideas

1. **Razorpay** - Add Razorpay as payment gateway
2. **Stripe** - International payment support
3. **Twilio** - SMS notifications
4. **SendGrid** - Email notifications
5. **Firebase** - Push notifications
6. **WhatsApp Business API** - Order updates on WhatsApp

---

## 📞 Support

If you encounter any issues:

1. Check this documentation first
2. Review browser console for errors
3. Check backend logs
4. Verify API keys are correct
5. Test in different browsers

---

## ✅ Checklist

Before going live, ensure:

- [ ] Google Maps API key is configured
- [ ] Google Pay Merchant ID is configured
- [ ] Environment is set to PRODUCTION
- [ ] Billing is enabled on Google Cloud
- [ ] All payment methods are tested
- [ ] Order cancellation is working
- [ ] Refund process is tested
- [ ] Maps tracking is working
- [ ] Mobile responsiveness is verified
- [ ] Error handling is implemented
- [ ] Security measures are in place

---

## 🎉 Congratulations!

You now have a fully functional e-commerce platform with:
- ✅ Multiple payment methods
- ✅ Real-time order tracking
- ✅ Flexible cancellation policy
- ✅ Professional user experience

Happy selling! 🛒✨