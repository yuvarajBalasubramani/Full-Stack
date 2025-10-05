const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');

// All address routes require authentication (handled by middleware in index.js)
router.get('/', addressController.getAddresses);
router.post('/', addressController.createAddress);
router.put('/:id', addressController.updateAddress);
router.delete('/:id', addressController.deleteAddress);

module.exports = router;