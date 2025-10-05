const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// All cart routes require authentication (handled by middleware in index.js)
router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.put('/update', cartController.updateCartItem);
router.delete('/remove/:productId', cartController.removeFromCart);
router.delete('/clear', cartController.clearCart);

module.exports = router;