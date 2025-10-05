const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  total: {
    type: Number,
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  },
  shipping: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String
  }],
  shippingAddress: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, required: true },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  paymentInfo: {
    method: { 
      type: String, 
      enum: ['card', 'upi', 'wallet', 'googlepay', 'cod'],
      required: true 
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: { type: String },
    googlePayToken: { type: String },
    cardLast4: { type: String },
    upiId: { type: String }
  },
  deliveryTracking: {
    currentLocation: {
      lat: Number,
      lng: Number
    },
    deliveryPersonName: String,
    deliveryPersonPhone: String,
    estimatedDelivery: Date,
    actualDelivery: Date,
    trackingUpdates: [{
      location: {
        lat: Number,
        lng: Number
      },
      status: String,
      timestamp: { type: Date, default: Date.now },
      note: String
    }]
  },
  cancellationInfo: {
    canCancel: { type: Boolean, default: true },
    cancelDeadline: Date,
    cancelledAt: Date,
    cancelReason: String,
    refundStatus: {
      type: String,
      enum: ['not_applicable', 'pending', 'processing', 'completed'],
      default: 'not_applicable'
    },
    refundAmount: Number
  }
}, { timestamps: true });

// Add method to check if order can be cancelled (within 1 hour)
orderSchema.methods.canBeCancelled = function() {
  if (this.status === 'cancelled' || this.status === 'delivered') {
    return false;
  }
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  return this.createdAt > oneHourAgo;
};

// Update cancel deadline before saving
orderSchema.pre('save', function(next) {
  if (this.isNew) {
    this.cancellationInfo.cancelDeadline = new Date(this.createdAt.getTime() + 60 * 60 * 1000);
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      note: 'Order created'
    });
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);