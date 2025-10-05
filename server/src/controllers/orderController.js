const Order = require('../models/Order');
const User = require('../models/User');
const Cart = require('../models/Cart');
const Address = require('../models/Address');

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId }).populate('items.product');
    res.json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { total, subtotal, shipping, tax, items, shippingAddress, paymentInfo } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order items are required' });
    }

    // Set initial status based on payment method
    let initialStatus = 'pending';
    let paymentStatus = 'pending';
    
    if (paymentInfo.method === 'cod') {
      initialStatus = 'confirmed';
      paymentStatus = 'pending'; // Will be completed on delivery
    } else if (paymentInfo.method === 'googlepay' && paymentInfo.googlePayToken) {
      initialStatus = 'confirmed';
      paymentStatus = 'completed';
    }

    const order = await Order.create({
      user: req.userId,
      items,
      total,
      subtotal,
      shipping,
      tax,
      status: initialStatus,
      shippingAddress,
      paymentInfo: {
        ...paymentInfo,
        status: paymentStatus
      },
      deliveryTracking: {
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      }
    });

    await User.findByIdAndUpdate(req.userId, {
      $inc: { orderCount: 1, totalSpent: total }
    });

    await Cart.findOneAndUpdate({ user: req.userId }, { items: [] });

    res.status(201).json({ order });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, note, location } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update status
    order.status = status;
    
    // Add to status history
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note: note || `Order status updated to ${status}`
    });

    // Add tracking update if location provided
    if (location && location.lat && location.lng) {
      order.deliveryTracking.currentLocation = location;
      order.deliveryTracking.trackingUpdates.push({
        location,
        status,
        timestamp: new Date(),
        note: note || `Order ${status}`
      });
    }

    // If delivered, set actual delivery date
    if (status === 'delivered') {
      order.deliveryTracking.actualDelivery = new Date();
      if (order.paymentInfo.method === 'cod') {
        order.paymentInfo.status = 'completed';
      }
    }

    await order.save();

    res.json({ order });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    // Check if order can be cancelled
    if (!order.canBeCancelled()) {
      return res.status(400).json({ 
        message: 'Order cannot be cancelled. Cancellation window (1 hour) has expired or order is already delivered/cancelled.' 
      });
    }

    // Update order status
    order.status = 'cancelled';
    order.cancellationInfo.cancelledAt = new Date();
    order.cancellationInfo.cancelReason = reason || 'Cancelled by user';
    order.cancellationInfo.canCancel = false;

    // If payment was completed, initiate refund
    if (order.paymentInfo.status === 'completed' && order.paymentInfo.method !== 'cod') {
      order.cancellationInfo.refundStatus = 'pending';
      order.cancellationInfo.refundAmount = order.total;
      order.paymentInfo.status = 'refunded';
    }

    // Add to status history
    order.statusHistory.push({
      status: 'cancelled',
      timestamp: new Date(),
      note: reason || 'Cancelled by user'
    });

    await order.save();

    res.json({ 
      message: 'Order cancelled successfully',
      order,
      refundInfo: order.cancellationInfo.refundStatus !== 'not_applicable' ? {
        status: order.cancellationInfo.refundStatus,
        amount: order.cancellationInfo.refundAmount
      } : null
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateDeliveryTracking = async (req, res) => {
  try {
    const { location, deliveryPersonName, deliveryPersonPhone, note } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update delivery tracking
    if (location) {
      order.deliveryTracking.currentLocation = location;
      order.deliveryTracking.trackingUpdates.push({
        location,
        status: order.status,
        timestamp: new Date(),
        note: note || 'Location updated'
      });
    }

    if (deliveryPersonName) {
      order.deliveryTracking.deliveryPersonName = deliveryPersonName;
    }

    if (deliveryPersonPhone) {
      order.deliveryTracking.deliveryPersonPhone = deliveryPersonPhone;
    }

    await order.save();

    res.json({ order });
  } catch (error) {
    console.error('Update delivery tracking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user').populate('items.product');
    res.json({ orders });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};