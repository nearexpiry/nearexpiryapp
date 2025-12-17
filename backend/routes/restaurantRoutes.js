const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const { verifyToken, roleCheck } = require('../middleware/auth');

/**
 * @route   POST /api/restaurants/profile
 * @desc    Create or update restaurant profile
 * @access  Protected - Restaurant role only
 */
router.post(
  '/profile',
  verifyToken,
  roleCheck('restaurant'),
  restaurantController.createOrUpdateProfile
);

/**
 * @route   GET /api/restaurants/my-profile
 * @desc    Get authenticated restaurant's profile
 * @access  Protected - Restaurant role only
 */
router.get(
  '/my-profile',
  verifyToken,
  roleCheck('restaurant'),
  restaurantController.getMyRestaurant
);

/**
 * @route   PATCH /api/restaurants/toggle-open
 * @desc    Toggle restaurant open/closed status
 * @access  Protected - Restaurant role only
 */
router.patch(
  '/toggle-open',
  verifyToken,
  roleCheck('restaurant'),
  restaurantController.toggleOpenStatus
);

/**
 * @route   GET /api/restaurants/:id
 * @desc    Get restaurant by ID (public endpoint)
 * @access  Public
 */
router.get('/:id', restaurantController.getRestaurantById);

module.exports = router;
