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

/**
 * @route   GET /api/orders/restaurant/my-orders
 * @desc    Get all orders for authenticated restaurant
 * @access  Protected - Restaurant role only
 */
router.get(
  '/restaurant/my-orders',
  verifyToken,
  roleCheck('restaurant'),
  orderController.getRestaurantOrders
);

/**
 * @route   GET /api/orders/client/my-orders
 * @desc    Get all orders for authenticated client
 * @access  Protected - Client role only
 */
router.get(
  '/client/my-orders',
  verifyToken,
  roleCheck('client'),
  orderController.getClientOrders
);

/**
 * @route   PATCH /api/orders/:id/status
 * @desc    Update order status
 * @access  Protected - Restaurant role only
 */
router.patch(
  '/:id/status',
  verifyToken,
  roleCheck('restaurant'),
  orderController.updateOrderStatus
);

module.exports = router;
