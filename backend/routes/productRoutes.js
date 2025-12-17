const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken, roleCheck } = require('../middleware/auth');

/**
 * @route   POST /api/products
 * @desc    Create new product
 * @access  Protected - Restaurant role only
 */
router.post(
  '/',
  verifyToken,
  roleCheck('restaurant'),
  productController.createProduct
);

/**
 * @route   PUT /api/products/:id
 * @desc    Update existing product
 * @access  Protected - Restaurant role only, owner check
 */
router.put(
  '/:id',
  verifyToken,
  roleCheck('restaurant'),
  productController.updateProduct
);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product (soft delete)
 * @access  Protected - Restaurant role only, owner check
 */
router.delete(
  '/:id',
  verifyToken,
  roleCheck('restaurant'),
  productController.deleteProduct
);

/**
 * @route   GET /api/products/my-products
 * @desc    Get all products for authenticated restaurant
 * @access  Protected - Restaurant role only
 */
router.get(
  '/my-products',
  verifyToken,
  roleCheck('restaurant'),
  productController.getMyProducts
);

/**
 * @route   GET /api/products/:id
 * @desc    Get product by ID (public endpoint)
 * @access  Public
 */
router.get('/:id', productController.getProductById);

module.exports = router;
