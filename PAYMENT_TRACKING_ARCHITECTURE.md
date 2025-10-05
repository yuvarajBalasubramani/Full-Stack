# 🏗️ Payment & Tracking Architecture

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Product    │  │     Cart     │  │   Checkout   │         │
│  │    Grid      │→ │   Component  │→ │   Enhanced   │         │
│  └──────────────┘  └──────────────┘  └──────┬───────┘         │
│                                              │                   │
│                                              ↓                   │
│  ┌──────────────────────────────────────────────────────┐      │
│  │           Payment Method Selection                    │      │
│  ├──────────────────────────────────────────────────────┤      │
│  │  [Google Pay] [COD] [Card] [UPI]                    │      │
│  └──────────────┬───────────────────────────────────────┘      │
│                 │                                                │
│        ┌────────┴────────┐                                      │
│        ↓                 ↓                                      │
│  ┌──────────┐      ┌──────────┐                               │
│  │ Google   │      │   COD    │                               │
│  │   Pay    │      │ Payment  │                               │
│  │ Service  │      │  Direct  │                               │
│  └────┬─────┘      └────┬─────┘                               │
│       │                 │                                       │
│       └────────┬────────┘                                       │
│                ↓                                                │
│         ┌─────────────┐                                        │
│         │   Order     │                                        │
│         │   Created   │                                        │
│         └──────┬──────┘                                        │
│                │                                                │
│                ↓                                                │
│  ┌──────────────────────────────────────────────────────┐     │
│  │           Order Tracking Component                    │     │
│  ├──────────────────────────────────────────────────────┤     │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │     │
│  │  │   Google   │  │   Order    │  │  Status    │    │     │
│  │  │    Maps    │  │  Details   │  │  Timeline  │    │     │
│  │  └────────────┘  └────────────┘  └────────────┘    │     │
│  └──────────────────────────────────────────────────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (Node.js/Express)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │              Order Controller                         │      │
│  ├──────────────────────────────────────────────────────┤      │
│  │  • createOrder()                                     │      │
│  │  • getOrders()                                       │      │
│  │  • cancelOrder()                                     │      │
│  │  • updateOrderStatus()                               │      │
│  │  • updateDeliveryTracking()                          │      │
│  └────────────────────┬─────────────────────────────────┘      │
│                       │                                          │
│                       ↓                                          │
│  ┌──────────────────────────────────────────────────────┐      │
│  │              Order Model (MongoDB)                    │      │
│  ├──────────────────────────────────────────────────────┤      │
│  │  • Order details                                     │      │
│  │  • Payment info (method, status, token)              │      │
│  │  • Shipping address (with coordinates)               │      │
│  │  • Delivery tracking (location, person)              │      │
│  │  • Cancellation info (deadline, refund)              │      │
│  │  • Status history (timeline)                         │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Google     │  │   Google     │  │   Payment    │         │
│  │   Maps API   │  │   Pay API    │  │   Gateway    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Payment Flow Diagrams

### Google Pay Payment Flow

```
User                    Frontend                Backend              Google Pay
 │                         │                       │                     │
 │  1. Select Google Pay   │                       │                     │
 ├────────────────────────>│                       │                     │
 │                         │                       │                     │
 │  2. Click Place Order   │                       │                     │
 ├────────────────────────>│                       │                     │
 │                         │                       │                     │
 │                         │  3. Load Google Pay   │                     │
 │                         ├───────────────────────────────────────────>│
 │                         │                       │                     │
 │                         │  4. Show Payment Sheet│                     │
 │                         │<───────────────────────────────────────────┤
 │                         │                       │                     │
 │  5. Authorize Payment   │                       │                     │
 ├────────────────────────>│                       │                     │
 │                         │                       │                     │
 │                         │  6. Get Payment Token │                     │
 │                         ├───────────────────────────────────────────>│
 │                         │                       │                     │
 │                         │  7. Return Token      │                     │
 │                         │<───────────────────────────────────────────┤
 │                         │                       │                     │
 │                         │  8. Create Order      │                     │
 │                         ├──────────────────────>│                     │
 │                         │     (with token)      │                     │
 │                         │                       │                     │
 │                         │  9. Order Created     │                     │
 │                         │<──────────────────────┤                     │
 │                         │   (status: confirmed) │                     │
 │                         │   (payment: completed)│                     │
 │                         │                       │                     │
 │  10. Show Success       │                       │                     │
 │<────────────────────────┤                       │                     │
 │                         │                       │                     │
```

### Cash on Delivery Flow

```
User                    Frontend                Backend              Delivery
 │                         │                       │                     │
 │  1. Select COD          │                       │                     │
 ├────────────────────────>│                       │                     │
 │                         │                       │                     │
 │  2. Click Place Order   │                       │                     │
 ├────────────────────────>│                       │                     │
 │                         │                       │                     │
 │                         │  3. Create Order      │                     │
 │                         ├──────────────────────>│                     │
 │                         │   (method: cod)       │                     │
 │                         │                       │                     │
 │                         │  4. Order Created     │                     │
 │                         │<──────────────────────┤                     │
 │                         │   (status: confirmed) │                     │
 │                         │   (payment: pending)  │                     │
 │                         │                       │                     │
 │  5. Show Success        │                       │                     │
 │<────────────────────────┤                       │                     │
 │  "Keep ₹XXX ready"      │                       │                     │
 │                         │                       │                     │
 │         ... Order Processing & Shipping ...     │                     │
 │                         │                       │                     │
 │                         │                       │  6. Deliver Order   │
 │                         │                       │<────────────────────┤
 │                         │                       │                     │
 │  7. Pay Cash            │                       │                     │
 ├─────────────────────────────────────────────────────────────────────>│
 │                         │                       │                     │
 │                         │                       │  8. Confirm Payment │
 │                         │                       │<────────────────────┤
 │                         │                       │                     │
 │                         │  9. Update Status     │                     │
 │                         │<──────────────────────┤                     │
 │                         │   (status: delivered) │                     │
 │                         │   (payment: completed)│                     │
 │                         │                       │                     │
```

---

## Order Tracking Flow

### Real-Time Tracking

```
User                    Frontend                Backend              Google Maps
 │                         │                       │                     │
 │  1. Click Track Order   │                       │                     │
 ├────────────────────────>│                       │                     │
 │                         │                       │                     │
 │                         │  2. Get Order Details │                     │
 │                         ├──────────────────────>│                     │
 │                         │                       │                     │
 │                         │  3. Return Order      │                     │
 │                         │<──────────────────────┤                     │
 │                         │   (with tracking data)│                     │
 │                         │                       │                     │
 │                         │  4. Load Maps API     │                     │
 │                         ├───────────────────────────────────────────>│
 │                         │                       │                     │
 │                         │  5. Initialize Map    │                     │
 │                         ├───────────────────────────────────────────>│
 │                         │                       │                     │
 │                         │  6. Add Markers       │                     │
 │                         ├───────────────────────────────────────────>│
 │                         │   (delivery location) │                     │
 │                         │   (destination)       │                     │
 │                         │                       │                     │
 │                         │  7. Draw Route        │                     │
 │                         ├───────────────────────────────────────────>│
 │                         │                       │                     │
 │                         │  8. Calculate Distance│                     │
 │                         ├───────────────────────────────────────────>│
 │                         │                       │                     │
 │  9. View Live Map       │                       │                     │
 │<────────────────────────┤                       │                     │
 │  (with route & markers) │                       │                     │
 │                         │                       │                     │
 │         ... Delivery Person Updates Location ...│                     │
 │                         │                       │                     │
 │                         │  10. Poll for Updates │                     │
 │                         ├──────────────────────>│                     │
 │                         │   (every 30 seconds)  │                     │
 │                         │                       │                     │
 │                         │  11. New Location     │                     │
 │                         │<──────────────────────┤                     │
 │                         │                       │                     │
 │                         │  12. Update Marker    │                     │
 │                         ├───────────────────────────────────────────>│
 │                         │   (animate movement)  │                     │
 │                         │                       │                     │
 │  13. See Updated Map    │                       │                     │
 │<────────────────────────┤                       │                     │
 │                         │                       │                     │
```

---

## Order Cancellation Flow

### Within 1 Hour

```
User                    Frontend                Backend              Payment Gateway
 │                         │                       │                     │
 │  1. Click Cancel Order  │                       │                     │
 ├────────────────────────>│                       │                     │
 │                         │                       │                     │
 │  2. Confirm Cancellation│                       │                     │
 ├────────────────────────>│                       │                     │
 │                         │                       │                     │
 │                         │  3. Cancel Request    │                     │
 │                         ├──────────────────────>│                     │
 │                         │   (orderId, reason)   │                     │
 │                         │                       │                     │
 │                         │  4. Check Time Window │                     │
 │                         │<──────────────────────┤                     │
 │                         │   (< 1 hour? ✅)      │                     │
 │                         │                       │                     │
 │                         │  5. Check Payment     │                     │
 │                         │<──────────────────────┤                     │
 │                         │   (paid online? ✅)   │                     │
 │                         │                       │                     │
 │                         │                       │  6. Initiate Refund │
 │                         │                       ├────────────────────>│
 │                         │                       │                     │
 │                         │                       │  7. Refund Pending  │
 │                         │                       │<────────────────────┤
 │                         │                       │                     │
 │                         │  8. Order Cancelled   │                     │
 │                         │<──────────────────────┤                     │
 │                         │   (status: cancelled) │                     │
 │                         │   (refund: pending)   │                     │
 │                         │                       │                     │
 │  9. Show Confirmation   │                       │                     │
 │<────────────────────────┤                       │                     │
 │  "Refund in 5-7 days"   │                       │                     │
 │                         │                       │                     │
 │         ... 5-7 Business Days ...               │                     │
 │                         │                       │                     │
 │                         │                       │  10. Refund Complete│
 │                         │                       │<────────────────────┤
 │                         │                       │                     │
 │                         │  11. Update Status    │                     │
 │                         │<──────────────────────┤                     │
 │                         │   (refund: completed) │                     │
 │                         │                       │                     │
```

### After 1 Hour (Rejected)

```
User                    Frontend                Backend
 │                         │                       │
 │  1. Click Cancel Order  │                       │
 ├────────────────────────>│                       │
 │                         │                       │
 │                         │  2. Cancel Request    │
 │                         ├──────────────────────>│
 │                         │                       │
 │                         │  3. Check Time Window │
 │                         │<──────────────────────┤
 │                         │   (> 1 hour? ❌)      │
 │                         │                       │
 │                         │  4. Reject Request    │
 │                         │<──────────────────────┤
 │                         │   (400 Error)         │
 │                         │                       │
 │  5. Show Error          │                       │
 │<────────────────────────┤                       │
 │  "Cancellation window   │                       │
 │   has expired"          │                       │
 │                         │                       │
```

---

## Database Schema

### Order Document Structure

```javascript
{
  _id: ObjectId("..."),
  user: ObjectId("..."),
  
  // Order Items
  items: [
    {
      product: ObjectId("..."),
      quantity: 2,
      price: 999.00
    }
  ],
  
  // Pricing
  subtotal: 1998.00,
  shipping: 50.00,
  tax: 368.64,
  total: 2416.64,
  
  // Status
  status: "confirmed",  // pending, confirmed, preparing, shipped, 
                        // out_for_delivery, delivered, cancelled, refunded
  
  statusHistory: [
    {
      status: "pending",
      timestamp: ISODate("2024-01-15T10:00:00Z"),
      note: "Order created"
    },
    {
      status: "confirmed",
      timestamp: ISODate("2024-01-15T10:01:00Z"),
      note: "Payment successful"
    }
  ],
  
  // Shipping Address
  shippingAddress: {
    fullName: "John Doe",
    email: "john@example.com",
    phone: "+919876543210",
    address: "123 Main Street, Apartment 4B",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    country: "India",
    coordinates: {
      lat: 19.0760,
      lng: 72.8777
    }
  },
  
  // Payment Information
  paymentInfo: {
    method: "googlepay",  // googlepay, cod, card, upi, wallet
    status: "completed",   // pending, completed, failed, refunded
    transactionId: "TXN123456789",
    googlePayToken: "encrypted_token_here",
    cardLast4: null,
    upiId: null
  },
  
  // Delivery Tracking
  deliveryTracking: {
    currentLocation: {
      lat: 19.0760,
      lng: 72.8777
    },
    deliveryPersonName: "Rajesh Kumar",
    deliveryPersonPhone: "+919876543210",
    estimatedDelivery: ISODate("2024-01-22T18:00:00Z"),
    actualDelivery: null,
    trackingUpdates: [
      {
        location: {
          lat: 19.0760,
          lng: 72.8777
        },
        status: "shipped",
        timestamp: ISODate("2024-01-16T10:00:00Z"),
        note: "Package picked up from warehouse"
      }
    ]
  },
  
  // Cancellation Information
  cancellationInfo: {
    canCancel: true,
    cancelDeadline: ISODate("2024-01-15T11:00:00Z"),  // 1 hour after creation
    cancelledAt: null,
    cancelReason: null,
    refundStatus: "not_applicable",  // not_applicable, pending, processing, completed
    refundAmount: null
  },
  
  // Timestamps
  createdAt: ISODate("2024-01-15T10:00:00Z"),
  updatedAt: ISODate("2024-01-15T10:01:00Z")
}
```

---

## Component Hierarchy

```
App
├── Navigation
│   └── Cart Badge (shows item count)
│
├── ProductGrid
│   └── ProductCard (multiple)
│       └── Add to Cart Button
│
├── Cart (Sidebar)
│   ├── Cart Items
│   └── Checkout Button
│
├── CheckoutEnhanced
│   ├── Order Summary Panel
│   │   ├── Cart Items List
│   │   └── Price Breakdown
│   │
│   └── Checkout Form Panel
│       ├── Step 1: Shipping Information
│       │   ├── Name, Email, Phone
│       │   └── Address Fields
│       │
│       └── Step 2: Payment Information
│           ├── Payment Method Selector
│           │   ├── Google Pay Button
│           │   ├── COD Button
│           │   ├── Card Button
│           │   └── UPI Button
│           │
│           ├── Payment Forms (conditional)
│           │   ├── Google Pay Info
│           │   ├── COD Info
│           │   ├── Card Form
│           │   └── UPI Form
│           │
│           └── Place Order Button
│
├── OrderHistory
│   └── Order List
│       └── Order Card (multiple)
│           ├── Order Details
│           ├── Track Order Button
│           └── Cancel Order Button
│
└── OrderTracking
    ├── Map Panel
    │   ├── Google Map
    │   ├── Delivery Marker (blue)
    │   ├── Destination Marker (red)
    │   ├── Route Line
    │   └── Delivery Person Info
    │
    └── Details Panel
        ├── Order Information
        ├── Cancellation Banner (if applicable)
        ├── Status Timeline
        ├── Order Items
        ├── Delivery Address
        └── Payment Information
```

---

## API Endpoints Structure

```
/api
├── /auth
│   ├── POST /register
│   ├── POST /login
│   └── POST /logout
│
├── /products
│   ├── GET /
│   ├── GET /:id
│   ├── POST / (admin)
│   └── PUT /:id (admin)
│
├── /orders
│   ├── GET /                    ← Get user's orders
│   ├── POST /                   ← Create new order
│   ├── PUT /:id/cancel          ← Cancel order (user)
│   ├── GET /all (admin)         ← Get all orders
│   ├── PUT /:id/status (admin)  ← Update order status
│   └── PUT /:id/tracking (admin)← Update delivery tracking
│
└── /cart
    ├── GET /
    ├── POST /items
    ├── PUT /items/:productId
    └── DELETE /items/:productId
```

---

## State Management Flow

```
AppContext (Global State)
├── products: []
├── cart: []
├── orders: []
├── currentUser: {}
└── dispatch()
    ├── ADD_TO_CART
    ├── REMOVE_FROM_CART
    ├── UPDATE_CART_QUANTITY
    ├── CLEAR_CART
    ├── ADD_ORDER
    ├── UPDATE_ORDER_STATUS
    ├── CANCEL_ORDER
    ├── LOGIN
    └── LOGOUT

LocalStorage Sync
├── elitestore_cart
├── elitestore_orders
├── elitestore_currentUser
└── Auto-save on state change
```

---

## Security Considerations

### Frontend Security
```
✅ API keys in environment variables
✅ No sensitive data in localStorage
✅ Payment tokens never stored
✅ HTTPS required for production
✅ Input validation on all forms
```

### Backend Security
```
✅ JWT authentication
✅ User authorization checks
✅ Payment token validation
✅ Cancellation window verification
✅ Admin-only endpoints protected
✅ Rate limiting on API calls
```

### Payment Security
```
✅ Google Pay tokenization
✅ No card details stored
✅ PCI DSS compliance
✅ Encrypted communication
✅ Secure payment gateway
```

---

## Performance Optimization

### Frontend
```
✅ Lazy load Google Maps
✅ Lazy load Google Pay SDK
✅ Debounce location updates
✅ Cache map instances
✅ Optimize re-renders
```

### Backend
```
✅ Index on order status
✅ Index on user ID
✅ Index on creation date
✅ Pagination for order lists
✅ Efficient queries
```

### Maps
```
✅ Load maps only when needed
✅ Reuse map instances
✅ Limit tracking updates
✅ Optimize marker rendering
✅ Cache geocoding results
```

---

This architecture provides a scalable, secure, and user-friendly e-commerce platform with modern payment and tracking features! 🚀