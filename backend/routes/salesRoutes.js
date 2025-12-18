const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const { verifyToken, roleCheck } = require('../middleware/auth');

/**
 * @route   GET /api/sales/restaurant
 * @desc    Get restaurant sales analytics
 * @access  Protected - Restaurant role only
 * @query   period: 'today' | 'week' | 'month' | 'all' (default: 'today')
 */
router.get(
  '/restaurant',
  verifyToken,
  roleCheck('restaurant'),
  salesController.getRestaurantSales
);

module.exports = router;
