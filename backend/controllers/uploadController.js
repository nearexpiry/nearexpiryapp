const { cloudinary } = require('../config/cloudinary');
const { Readable } = require('stream');

/**
 * Upload image to Cloudinary
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const uploadImage = async (req, res) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No file uploaded'
      });
    }

    // Get folder from query parameter or default to 'general'
    const folder = req.query.folder || 'general';

    // Validate folder name (only allow specific folders)
    const allowedFolders = ['logos', 'products', 'general'];
    const uploadFolder = allowedFolders.includes(folder) ? folder : 'general';

    // Upload to Cloudinary using stream
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `nearexpiry/${uploadFolder}`,
          resource_type: 'image',
          transformation: [
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      // Convert buffer to stream and pipe to Cloudinary
      const bufferStream = Readable.from(req.file.buffer);
      bufferStream.pipe(uploadStream);
    });

    const result = await uploadPromise;

    // Return the secure URL
    res.status(200).json({
      status: 'success',
      message: 'Image uploaded successfully',
      data: {
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format
      }
    });

  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to upload image',
      error: error.message
    });
  }
};

/**
 * Delete image from Cloudinary
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteImage = async (req, res) => {
  try {
    const { public_id } = req.body;

    if (!public_id) {
      return res.status(400).json({
        status: 'error',
        message: 'public_id is required'
      });
    }

    const result = await cloudinary.uploader.destroy(public_id);

    res.status(200).json({
      status: 'success',
      message: 'Image deleted successfully',
      data: result
    });

  } catch (error) {
    console.error('Cloudinary delete error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete image',
      error: error.message
    });
  }
};

module.exports = {
  uploadImage,
  deleteImage
};
