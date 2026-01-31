const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { query, getClient } = require('../db/db');
const { generateToken } = require('../utils/jwt');
const { sendPasswordResetEmail, sendVerificationOTPEmail, sendWelcomeEmail } = require('../utils/emailService');

/**
 * Generate a 6-digit OTP code
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Validate email format
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * Requirements:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
const isValidPassword = (password) => {
  if (!password || password.length < 8) {
    return false;
  }

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  return hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
};

/**
 * Get password validation error message
 */
const getPasswordValidationError = (password) => {
  if (!password) {
    return 'Password is required';
  }

  const errors = [];

  if (password.length < 8) {
    errors.push('at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('one number');
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('one special character (!@#$%^&*()_+-=[]{};\':"|,.<>/?)');
  }

  if (errors.length === 0) {
    return null;
  }

  return `Password must contain ${errors.join(', ')}`;
};

/**
 * Register a new user
 * POST /api/auth/register
 */
const register = async (req, res) => {
  const client = await getClient();

  try {
    const { email, password, role } = req.body;

    // Validation
    if (!email || !password || !role) {
      return res.status(400).json({
        status: 'error',
        message: 'Email, password, and role are required',
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid email format',
      });
    }

    // Validate password strength
    if (!isValidPassword(password)) {
      return res.status(400).json({
        status: 'error',
        message: getPasswordValidationError(password),
      });
    }

    // Validate role - only client and restaurant can register via API
    if (!['client', 'restaurant'].includes(role)) {
      return res.status(400).json({
        status: 'error',
        message: 'Role must be either "client" or "restaurant"',
      });
    }

    // Check if user already exists
    const existingUser = await client.query('SELECT id, email_verified FROM users WHERE email = $1', [
      email.toLowerCase(),
    ]);

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        status: 'error',
        message: 'User with this email already exists',
      });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Generate OTP code
    const otpCode = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Begin transaction
    await client.query('BEGIN');

    // Insert user into database with email_verified = false
    const result = await client.query(
      'INSERT INTO users (email, password_hash, role, email_verified) VALUES ($1, $2, $3, false) RETURNING id, email, role, created_at',
      [email.toLowerCase(), passwordHash, role]
    );

    const user = result.rows[0];

    // Insert OTP token
    await client.query(
      'INSERT INTO email_verification_tokens (user_id, otp_code, expires_at) VALUES ($1, $2, $3)',
      [user.id, otpCode, otpExpiresAt]
    );

    // Commit transaction
    await client.query('COMMIT');

    // Send verification email
    await sendVerificationOTPEmail(user.email, otpCode);

    res.status(201).json({
      status: 'success',
      message: 'Registration successful. Please check your email for the verification code.',
      data: {
        email: user.email,
        requiresVerification: true,
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Registration failed. Please try again.',
    });
  } finally {
    client.release();
  }
};

/**
 * Verify email with OTP code
 * POST /api/auth/verify-email
 */
const verifyEmail = async (req, res) => {
  const client = await getClient();

  try {
    const { email, otpCode } = req.body;

    // Validation
    if (!email || !otpCode) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and OTP code are required',
      });
    }

    // Find user by email
    const userResult = await client.query(
      'SELECT id, email, role, email_verified FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid email or OTP code',
      });
    }

    const user = userResult.rows[0];

    // Check if already verified
    if (user.email_verified) {
      return res.status(400).json({
        status: 'error',
        message: 'Email is already verified',
      });
    }

    // Find valid OTP token
    const tokenResult = await client.query(
      'SELECT id, otp_code, expires_at FROM email_verification_tokens WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
      [user.id]
    );

    if (tokenResult.rows.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No verification code found. Please request a new one.',
      });
    }

    const tokenData = tokenResult.rows[0];

    // Check if OTP has expired
    if (new Date() > new Date(tokenData.expires_at)) {
      return res.status(400).json({
        status: 'error',
        message: 'Verification code has expired. Please request a new one.',
      });
    }

    // Check if OTP matches
    if (tokenData.otp_code !== otpCode) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid verification code',
      });
    }

    // Begin transaction
    await client.query('BEGIN');

    // Update user's email_verified status
    await client.query('UPDATE users SET email_verified = true WHERE id = $1', [user.id]);

    // Delete used OTP token
    await client.query('DELETE FROM email_verification_tokens WHERE user_id = $1', [user.id]);

    // Commit transaction
    await client.query('COMMIT');

    // Send welcome email (non-blocking)
    sendWelcomeEmail(user.email).catch((err) => {
      console.error('Failed to send welcome email:', err);
    });

    // Don't return token - user should login after verification
    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully. You can now log in.',
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Email verification error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Email verification failed. Please try again.',
    });
  } finally {
    client.release();
  }
};

/**
 * Resend verification OTP
 * POST /api/auth/resend-verification
 */
const resendVerificationOTP = async (req, res) => {
  const client = await getClient();

  try {
    const { email } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({
        status: 'error',
        message: 'Email is required',
      });
    }

    // Find user by email
    const userResult = await client.query(
      'SELECT id, email, email_verified FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (userResult.rows.length === 0) {
      // Return generic success message for security
      return res.status(200).json({
        status: 'success',
        message: 'If an account with that email exists, a new verification code has been sent.',
      });
    }

    const user = userResult.rows[0];

    // Check if already verified
    if (user.email_verified) {
      return res.status(400).json({
        status: 'error',
        message: 'Email is already verified',
      });
    }

    // Generate new OTP code
    const otpCode = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Begin transaction
    await client.query('BEGIN');

    // Delete any existing OTP tokens for this user
    await client.query('DELETE FROM email_verification_tokens WHERE user_id = $1', [user.id]);

    // Insert new OTP token
    await client.query(
      'INSERT INTO email_verification_tokens (user_id, otp_code, expires_at) VALUES ($1, $2, $3)',
      [user.id, otpCode, otpExpiresAt]
    );

    // Commit transaction
    await client.query('COMMIT');

    // Send verification email
    await sendVerificationOTPEmail(user.email, otpCode);

    res.status(200).json({
      status: 'success',
      message: 'A new verification code has been sent to your email.',
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Resend verification OTP error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to resend verification code. Please try again.',
    });
  } finally {
    client.release();
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and password are required',
      });
    }

    // Find user by email
    const result = await query(
      'SELECT id, email, password_hash, role, is_active, email_verified FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password',
      });
    }

    const user = result.rows[0];

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({
        status: 'error',
        message: 'Your account has been deactivated. Please contact support.',
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password',
      });
    }

    // Check if email is verified
    if (!user.email_verified) {
      return res.status(403).json({
        status: 'error',
        message: 'Please verify your email before logging in',
        data: {
          requiresVerification: true,
          email: user.email,
        },
      });
    }

    // Generate JWT token
    const token = generateToken(user.id, user.role);

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Login failed. Please try again.',
    });
  }
};

/**
 * Forgot password - send reset token
 * POST /api/auth/forgot-password
 */
const forgotPassword = async (req, res) => {
  const client = await getClient();

  try {
    const { email } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({
        status: 'error',
        message: 'Email is required',
      });
    }

    // Find user by email
    const userResult = await client.query(
      'SELECT id, email FROM users WHERE email = $1 AND is_active = true',
      [email.toLowerCase()]
    );

    // Always return success message for security (don't reveal if email exists)
    if (userResult.rows.length === 0) {
      return res.status(200).json({
        status: 'success',
        message: 'If an account with that email exists, a password reset link has been sent.',
      });
    }

    const user = userResult.rows[0];

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set expiration time (1 hour from now)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Begin transaction
    await client.query('BEGIN');

    // Delete any existing reset tokens for this user
    await client.query('DELETE FROM password_reset_tokens WHERE user_id = $1', [
      user.id,
    ]);

    // Insert new reset token
    await client.query(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, hashedToken, expiresAt]
    );

    // Commit transaction
    await client.query('COMMIT');

    // Send email with reset token
    await sendPasswordResetEmail(user.email, resetToken);

    res.status(200).json({
      status: 'success',
      message: 'If an account with that email exists, a password reset link has been sent.',
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Forgot password error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to process password reset request. Please try again.',
    });
  } finally {
    client.release();
  }
};

/**
 * Reset password with token
 * POST /api/auth/reset-password
 */
const resetPassword = async (req, res) => {
  const client = await getClient();

  try {
    const { token, newPassword } = req.body;

    // Validation
    if (!token || !newPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Token and new password are required',
      });
    }

    // Validate password strength
    if (!isValidPassword(newPassword)) {
      return res.status(400).json({
        status: 'error',
        message: getPasswordValidationError(newPassword),
      });
    }

    // Hash the token to compare with database
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find valid reset token
    const tokenResult = await client.query(
      'SELECT user_id, expires_at FROM password_reset_tokens WHERE token = $1',
      [hashedToken]
    );

    if (tokenResult.rows.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired reset token',
      });
    }

    const resetTokenData = tokenResult.rows[0];

    // Check if token has expired
    if (new Date() > new Date(resetTokenData.expires_at)) {
      return res.status(400).json({
        status: 'error',
        message: 'Reset token has expired. Please request a new one.',
      });
    }

    // Hash new password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    // Begin transaction
    await client.query('BEGIN');

    // Update user's password
    await client.query('UPDATE users SET password_hash = $1 WHERE id = $2', [
      passwordHash,
      resetTokenData.user_id,
    ]);

    // Delete used reset token
    await client.query('DELETE FROM password_reset_tokens WHERE token = $1', [
      hashedToken,
    ]);

    // Commit transaction
    await client.query('COMMIT');

    res.status(200).json({
      status: 'success',
      message: 'Password has been reset successfully. You can now login with your new password.',
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Reset password error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to reset password. Please try again.',
    });
  } finally {
    client.release();
  }
};

/**
 * Get current user details
 * GET /api/auth/me
 */
const getCurrentUser = async (req, res) => {
  try {
    // User info is attached to req.user by the verifyToken middleware
    const userId = req.user.userId;

    // Get user details from database
    const result = await query(
      'SELECT id, email, role, is_active, created_at, updated_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    const user = result.rows[0];

    // If user is a restaurant, also get restaurant details
    let restaurantDetails = null;
    if (user.role === 'restaurant') {
      const restaurantResult = await query(
        'SELECT id, name, description, address, latitude, longitude, phone, logo_url, is_open FROM restaurants WHERE user_id = $1',
        [userId]
      );

      if (restaurantResult.rows.length > 0) {
        restaurantDetails = restaurantResult.rows[0];
      }
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          isActive: user.is_active,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
        },
        restaurant: restaurantDetails,
      },
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get user details',
    });
  }
};

module.exports = {
  register,
  verifyEmail,
  resendVerificationOTP,
  login,
  forgotPassword,
  resetPassword,
  getCurrentUser,
};
