# 🧪 Complete Testing Guide - Payment & Order Tracking

## 📋 Pre-Testing Checklist

Before you start testing, make sure:

- ✅ Google Maps API key is added to `.env` file
- ✅ Both servers are running (backend on port 5000, frontend on port 5174)
- ✅ MongoDB is connected
- ✅ You have a user account (or can create one)

---

## 🎯 Test Scenarios

### Test 1: Google Pay Payment ✅

**Steps:**
1. Login to your account
2. Add products to cart
3. Click "Proceed to Checkout"
4. Fill in shipping address
5. Click "Continue to Payment"
6. Select "Google Pay" payment method
7. Click "Pay with Google Pay"
8. Complete payment in Google Pay popup

**Expected Result:**
- ✅ Google Pay button appears (if browser supports it)
- ✅ Payment popup opens
- ✅ Order is created with status "confirmed"
- ✅ Payment status is "completed"
- ✅ Success screen shows order details
- ✅ Cancellation deadline is shown (1 hour from now)

**If Google Pay doesn't appear:**
- Browser doesn't support Google Pay
- No payment methods saved in Google account
- **Solution:** Use Chrome/Edge/Safari or test COD instead

---

### Test 2: Cash on Delivery (COD) ✅

**Steps:**
1. Login to your account
2. Add products to cart
3. Click "Proceed to Checkout"
4. Fill in shipping address
5. Click "Continue to Payment"
6. Select "Cash on Delivery"
7. See "Keep ₹XXX ready for payment on delivery" message
8. Click "Place Order"

**Expected Result:**
- ✅ Order is created with status "confirmed"
- ✅ Payment status is "pending"
- ✅ Payment method is "cod"
- ✅ Success screen shows "Pay on Delivery" message
- ✅ Order appears in Order History

---

### Test 3: Order Tracking with Google Maps 🗺️

**Steps:**
1. After placing an order, click "Track Order" button
2. Or click Package icon (📦) in navigation
3. Click "Track Order" on any order

**Expected Result:**
- ✅ Google Maps loads with two markers:
  - 🔵 Blue marker = Delivery person location
  - 🔴 Red marker = Your delivery address
- ✅ Route line drawn between markers
- ✅ Distance shown in kilometers
- ✅ Delivery person info card (name & phone)
- ✅ "Call Delivery Person" button works
- ✅ Order timeline shows all status updates
- ✅ Current status is highlighted

**If map doesn't load:**
- Check Google Maps API key in `.env`
- Make sure Maps JavaScript API is enabled
- Restart frontend server

---

### Test 4: Order Cancellation (Within 1 Hour) ⏰

**Steps:**
1. Place a new order (any payment method)
2. Immediately go to Order Tracking page
3. See yellow banner "You can cancel this order"
4. Click "Cancel Order" button
5. Enter cancellation reason
6. Confirm cancellation

**Expected Result:**
- ✅ Cancellation banner appears (if within 1 hour)
- ✅ Countdown timer shows time remaining
- ✅ Order status changes to "cancelled"
- ✅ For online payments: Refund status shows "pending"
- ✅ For COD: No refund (payment not made yet)
- ✅ Cancellation appears in status timeline

---

### Test 5: Order Cancellation (After 1 Hour) ❌

**Steps:**
1. Try to cancel an order placed more than 1 hour ago
2. Or manually test by changing order creation time in database

**Expected Result:**
- ✅ Cancellation banner does NOT appear
- ✅ "Cancel Order" button is disabled or hidden
- ✅ If attempted via API: Error message "Cancellation window expired"

---

### Test 6: Order Status Flow 📦

**Steps:**
1. Place an order
2. As admin, update order status through admin panel or API
3. Test each status transition:
   - pending → confirmed
   - confirmed → preparing
   - preparing → shipped
   - shipped → out_for_delivery
   - out_for_delivery → delivered

**Expected Result:**
- ✅ Each status change is recorded in status history
- ✅ Timeline updates in real-time
- ✅ Status badges show correct colors
- ✅ For COD orders: Payment status changes to "completed" when delivered

---

### Test 7: Multiple Payment Methods 💳

**Test each payment method:**

1. **Google Pay**
   - Should show Google Pay button
   - Opens payment popup
   - Creates order with method "googlepay"

2. **Cash on Delivery**
   - Shows "Keep ₹XXX ready" message
   - Creates order with method "cod"
   - Payment status "pending"

3. **Credit/Debit Card**
   - Shows card input fields
   - Validates card number
   - Creates order with method "card"

4. **UPI Payment**
   - Shows UPI ID input
   - Validates UPI format
   - Creates order with method "upi"

---

### Test 8: Order History 📜

**Steps:**
1. Click Package icon (📦) in navigation
2. View all your orders
3. Check order details
4. Click "Track Order" on any order

**Expected Result:**
- ✅ All orders are listed
- ✅ Order status badges show correct colors
- ✅ Payment method icons are correct
- ✅ Total amount is accurate
- ✅ "Track Order" button works
- ✅ Order details are complete

---

### Test 9: Admin Delivery Tracking Update 🚚

**Steps (Admin Only):**
1. Login as admin
2. Go to Admin Panel → Orders
3. Select an order
4. Update delivery tracking:
   - Delivery person name
   - Delivery person phone
   - Current location (lat, lng)
5. Save changes

**Expected Result:**
- ✅ Delivery info updates in database
- ✅ User sees updated info on tracking page
- ✅ Map marker moves to new location
- ✅ Route recalculates
- ✅ Tracking update appears in timeline

**API Endpoint:**
```
PUT /api/orders/:orderId/tracking
Authorization: Bearer <admin_token>

Body:
{
  "deliveryPersonName": "John Doe",
  "deliveryPersonPhone": "+91 98765 43210",
  "location": {
    "lat": 28.6139,
    "lng": 77.2090
  },
  "note": "Out for delivery"
}
```

---

### Test 10: Responsive Design 📱

**Steps:**
1. Open app on mobile device or use browser dev tools
2. Test all features on different screen sizes:
   - Mobile (320px - 480px)
   - Tablet (768px - 1024px)
   - Desktop (1024px+)

**Expected Result:**
- ✅ Checkout form is mobile-friendly
- ✅ Map adjusts to screen size
- ✅ Payment buttons are touch-friendly
- ✅ Navigation works on mobile
- ✅ Order tracking is readable on small screens

---

## 🐛 Common Issues & Solutions

### Issue 1: Google Pay Not Showing
**Cause:** Browser doesn't support Google Pay
**Solution:** Use Chrome, Edge, or Safari. Or test with COD.

### Issue 2: Map Not Loading
**Cause:** Invalid or missing API key
**Solution:** 
1. Check `.env` file has correct API key
2. Verify API key is enabled for Maps JavaScript API
3. Restart frontend server

### Issue 3: Order Not Creating
**Cause:** Backend server not running or MongoDB not connected
**Solution:**
1. Check backend server is running on port 5000
2. Check MongoDB connection in backend logs
3. Verify user is logged in

### Issue 4: Cancellation Not Working
**Cause:** Order is older than 1 hour or already delivered
**Solution:** This is expected behavior. Only orders within 1 hour can be cancelled.

### Issue 5: Payment Status Not Updating
**Cause:** Payment gateway integration not complete
**Solution:** For testing, payment status is set automatically. For production, integrate actual payment gateway.

---

## 📊 Test Data

### Sample Shipping Address
```
Full Name: John Doe
Email: john@example.com
Phone: +91 98765 43210
Address: 123 Main Street, Apartment 4B
City: Mumbai
State: Maharashtra
Pincode: 400001
Country: India
```

### Sample Delivery Location (for admin testing)
```
Location: Gateway of India, Mumbai
Coordinates: 
  Latitude: 18.9220
  Longitude: 72.8347
```

### Sample Cancellation Reasons
- "Changed my mind"
- "Found a better deal"
- "Ordered by mistake"
- "Need to modify order"

---

## ✅ Testing Checklist

Use this checklist to track your testing progress:

- [ ] Google Pay payment works
- [ ] Cash on Delivery works
- [ ] Card payment works
- [ ] UPI payment works
- [ ] Order tracking map loads
- [ ] Delivery route is shown
- [ ] Order cancellation works (within 1 hour)
- [ ] Order cancellation blocked (after 1 hour)
- [ ] Refund initiated for cancelled orders
- [ ] Order status updates work
- [ ] Status timeline is accurate
- [ ] Order history displays correctly
- [ ] Admin can update delivery tracking
- [ ] Responsive design works on mobile
- [ ] All payment methods create orders correctly

---

## 🎉 Success Criteria

Your implementation is working correctly if:

✅ All 4 payment methods work
✅ Orders are created in database
✅ Google Maps tracking loads and shows route
✅ Orders can be cancelled within 1 hour
✅ Refunds are initiated automatically
✅ Order status flow works correctly
✅ Admin can update delivery tracking
✅ Everything is mobile-responsive

---

## 📞 Need Help?

If you encounter issues:

1. Check browser console for errors
2. Check backend server logs
3. Verify API keys are correct
4. Review documentation files:
   - `PAYMENT_AND_TRACKING_GUIDE.md`
   - `PAYMENT_TRACKING_ARCHITECTURE.md`
   - `FEATURES_QUICK_REFERENCE.md`

---

**Happy Testing! 🚀**