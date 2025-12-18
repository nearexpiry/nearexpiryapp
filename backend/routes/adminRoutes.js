const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, roleCheck } = require('../middleware/auth');

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with pagination and filters
 * @access  Protected - Admin role only
 */
router.get(
  '/users',
  verifyToken,
  roleCheck('admin'),
  adminController.getAllUsers
);

/**
 * @route   PATCH /api/admin/users/:id/toggle-status
 * @desc    Toggle user active status (activate/deactivate)
 * @access  Protected - Admin role only
 */
router.patch(
  '/users/:id/toggle-status',
  verifyToken,
  roleCheck('admin'),
  adminController.toggleUserStatus
);

/**
 * @route   GET /api/admin/stats
 * @desc    Get system statistics
 * @access  Protected - Admin role only
 */
router.get(
  '/stats',
  verifyToken,
  roleCheck('admin'),
  adminController.getSystemStats
);

/**
 * @route   GET /api/admin/commission
 * @desc    Get current commission percentage
 * @access  Protected - Admin role only
 */
router.get(
  '/commission',
  verifyToken,
  roleCheck('admin'),
  adminController.getCommission
);

/**
 * @route   PUT /api/admin/commission
 * @desc    Update commission percentage
 * @access  Protected - Admin role only
 */
router.put(
  '/commission',
  verifyToken,
  roleCheck('admin'),
  adminController.updateCommission
);

module.exports = router;
