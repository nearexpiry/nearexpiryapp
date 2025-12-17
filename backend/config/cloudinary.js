const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Verify configuration (optional, useful for debugging)
const verifyConfig = () => {
  const config = cloudinary.config();
  if (!config.cloud_name || !config.api_key || !config.api_secret) {
    console.warn('Warning: Cloudinary credentials are not properly configured. Check your .env file.');
    return false;
  }
  console.log('Cloudinary configured successfully');
  return true;
};

module.exports = { cloudinary, verifyConfig };
