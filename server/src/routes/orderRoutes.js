const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { adminMiddleware } = require('../middleware/authMiddleware');

// User routes (authentication handled by middleware in index.js)
router.get('/', orderController.getOrders);
router.post('/', orderController.createOrder);
router.put('/:id/cancel', orderController.cancelOrder);

// Admin routes
router.get('/all', adminMiddleware, orderController.getAllOrders);
router.put('/:id/status', adminMiddleware, orderController.updateOrderStatus);
router.put('/:id/tracking', adminMiddleware, orderController.updateDeliveryTracking);

module.exports = router;