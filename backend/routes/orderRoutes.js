const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, roleCheck } = require('../middleware/auth');

/**
 * @route   POST /api/orders
 * @desc    Create new order
 * @access  Protected - Client role only
 */
router.post(
  '/',
  verifyToken,
  roleCheck('client'),
  orderController.createOrder
);

module.exports = router;
