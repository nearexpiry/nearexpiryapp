const jwt = require('jsonwebtoken');

/**
 * Generate a JWT token for a user
 * @param {string} userId - User's unique identifier
 * @param {string} role - User's role (client, restaurant, admin)
 * @returns {string} JWT token
 */
const generateToken = (userId, role) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  const payload = {
    userId,
    role,
  };

  const options = {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  };

  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

/**
 * Verify and decode a JWT token
 * @param {string} token - JWT token to verify
 * @returns {object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
const verifyToken = (token) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    } else {
      throw new Error('Token verification failed');
    }
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
