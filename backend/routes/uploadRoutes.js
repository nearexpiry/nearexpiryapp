const express = require('express');
const router = express.Router();
const { verifyToken, roleCheck } = require('../middleware/auth');
const { upload, handleMulterError } = require('../middleware/upload');
const { uploadImage, deleteImage } = require('../controllers/uploadController');

/**
 * POST /api/upload/logo
 * Upload restaurant logo
 * Protected route - Restaurant role only
 */
router.post(
  '/logo',
  verifyToken,
  roleCheck('restaurant'),
  upload.single('image'),
  handleMulterError,
  (req, res) => {
    // Set folder to 'logos' via query param
    req.query.folder = 'logos';
    uploadImage(req, res);
  }
);

/**
 * POST /api/upload/product-image
 * Upload product image
 * Protected route - Restaurant role only
 */
router.post(
  '/product-image',
  verifyToken,
  roleCheck('restaurant'),
  upload.single('image'),
  handleMulterError,
  (req, res) => {
    // Set folder to 'products' via query param
    req.query.folder = 'products';
    uploadImage(req, res);
  }
);

/**
 * DELETE /api/upload/image
 * Delete image from Cloudinary
 * Protected route - Restaurant role only
 */
router.delete(
  '/image',
  verifyToken,
  roleCheck('restaurant'),
  deleteImage
);

module.exports = router;
