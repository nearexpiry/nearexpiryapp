const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const clientController = require('../controllers/clientController');

/**
 * @route   GET /api/client/products
 * @desc    Get all products with filters, search, sorting, and pagination
 * @access  Public
 * @query   search, category, minPrice, maxPrice, sortBy, page, limit
 */
router.get('/products', productController.getAllProducts);

/**
 * @route   GET /api/client/restaurants
 * @desc    Get all restaurants with coordinates
 * @access  Public
 */
router.get('/restaurants', clientController.getAllRestaurants);

module.exports = router;
