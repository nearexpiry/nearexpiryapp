const nodemailer = require('nodemailer');

/**
 * Create email transporter
 */
const createTransporter = () => {
  // Check if email configuration is set
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Email configuration is incomplete. Email functionality will not work.');
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send password reset email
 * @param {string} email - Recipient email address
 * @param {string} resetToken - Password reset token
 * @returns {Promise<object>} Email send result
 */
const sendPasswordResetEmail = async (email, resetToken) => {
  const transporter = createTransporter();

  if (!transporter) {
    throw new Error('Email service is not configured properly');
  }

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: `"Near Expiry" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset Request - Near Expiry',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background-color: #f9f9f9;
            border-radius: 8px;
            padding: 30px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #4CAF50;
            margin: 0;
          }
          .content {
            background-color: white;
            padding: 25px;
            border-radius: 5px;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .button:hover {
            background-color: #45a049;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          .warning {
            color: #d32f2f;
            font-weight: bold;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Near Expiry</h1>
          </div>
          <div class="content">
            <h2>Password Reset Request</h2>
            <p>Hello,</p>
            <p>You have requested to reset your password for your Near Expiry account. Click the button below to proceed with resetting your password:</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p><a href="${resetUrl}">${resetUrl}</a></p>
            <p class="warning">This link will expire in 1 hour for security reasons.</p>
            <p>If you did not request a password reset, please ignore this email and your password will remain unchanged.</p>
            <p>Best regards,<br>The Near Expiry Team</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 Near Expiry. All rights reserved.</p>
            <p>This is an automated email, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Password Reset Request - Near Expiry

      Hello,

      You have requested to reset your password for your Near Expiry account.

      Click the link below to reset your password:
      ${resetUrl}

      This link will expire in 1 hour for security reasons.

      If you did not request a password reset, please ignore this email and your password will remain unchanged.

      Best regards,
      The Near Expiry Team
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

/**
 * Send email verification OTP
 * @param {string} email - Recipient email address
 * @param {string} otpCode - 6-digit OTP code
 * @returns {Promise<object>} Email send result
 */
const sendVerificationOTPEmail = async (email, otpCode) => {
  const transporter = createTransporter();

  if (!transporter) {
    throw new Error('Email service is not configured properly');
  }

  const mailOptions = {
    from: `"Near Expiry" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify Your Email - Near Expiry',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background-color: #f9f9f9;
            border-radius: 8px;
            padding: 30px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #4CAF50;
            margin: 0;
          }
          .content {
            background-color: white;
            padding: 25px;
            border-radius: 5px;
          }
          .otp-code {
            display: block;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #4CAF50;
            text-align: center;
            padding: 20px;
            margin: 20px 0;
            background-color: #f5f5f5;
            border-radius: 5px;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          .warning {
            color: #d32f2f;
            font-weight: bold;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Near Expiry</h1>
          </div>
          <div class="content">
            <h2>Verify Your Email Address</h2>
            <p>Hello,</p>
            <p>Thank you for registering with Near Expiry! To complete your registration, please enter the following verification code:</p>
            <span class="otp-code">${otpCode}</span>
            <p class="warning">This code will expire in 10 minutes for security reasons.</p>
            <p>If you did not create an account with Near Expiry, please ignore this email.</p>
            <p>Best regards,<br>The Near Expiry Team</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 Near Expiry. All rights reserved.</p>
            <p>This is an automated email, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Verify Your Email - Near Expiry

      Hello,

      Thank you for registering with Near Expiry! To complete your registration, please enter the following verification code:

      ${otpCode}

      This code will expire in 10 minutes for security reasons.

      If you did not create an account with Near Expiry, please ignore this email.

      Best regards,
      The Near Expiry Team
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Verification OTP email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending verification OTP email:', error);
    throw new Error('Failed to send verification email');
  }
};

/**
 * Send welcome email (optional - can be used after registration)
 * @param {string} email - Recipient email address
 * @param {string} name - User's name
 * @returns {Promise<object>} Email send result
 */
const sendWelcomeEmail = async (email, name) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.warn('Email service not configured, skipping welcome email');
    return null;
  }

  const mailOptions = {
    from: `"Near Expiry" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to Near Expiry!',
    html: `
      <h1>Welcome to Near Expiry!</h1>
      <p>Hello ${name || 'there'},</p>
      <p>Thank you for joining Near Expiry. We're excited to have you on board!</p>
      <p>Start exploring and discover great deals on products near their expiry date.</p>
      <p>Best regards,<br>The Near Expiry Team</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    // Don't throw error for welcome emails, it's not critical
    return null;
  }
};

/**
 * Send order confirmation email to customer
 * @param {string} email - Customer email address
 * @param {object} orderDetails - Order details object
 * @returns {Promise<object>} Email send result
 */
const sendOrderConfirmationEmail = async (email, orderDetails) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.warn('Email service not configured, skipping order confirmation email');
    return null;
  }

  const { orderId, restaurantName, totalAmount, items, orderType, deliveryAddress } = orderDetails;

  const itemsList = items
    .map(item => `<li>${item.productName} x ${item.quantity} - $${(item.priceAtOrder * item.quantity).toFixed(2)}</li>`)
    .join('');

  const mailOptions = {
    from: `"Near Expiry" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Order Confirmation #${orderId.slice(0, 8)} - Near Expiry`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background-color: #f9f9f9;
            border-radius: 8px;
            padding: 30px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #4CAF50;
            margin: 0;
          }
          .content {
            background-color: white;
            padding: 25px;
            border-radius: 5px;
          }
          .order-details {
            margin: 20px 0;
            padding: 15px;
            background-color: #f5f5f5;
            border-radius: 5px;
          }
          .order-details h3 {
            margin-top: 0;
            color: #4CAF50;
          }
          .items-list {
            margin: 10px 0;
            padding-left: 20px;
          }
          .items-list li {
            margin: 8px 0;
          }
          .total {
            font-size: 18px;
            font-weight: bold;
            color: #4CAF50;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 2px solid #4CAF50;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Near Expiry</h1>
          </div>
          <div class="content">
            <h2>Thank You for Your Order!</h2>
            <p>Hello,</p>
            <p>Your order has been successfully placed and is being prepared.</p>

            <div class="order-details">
              <h3>Order Details</h3>
              <p><strong>Order ID:</strong> #${orderId.slice(0, 8)}</p>
              <p><strong>Restaurant:</strong> ${restaurantName}</p>
              <p><strong>Order Type:</strong> ${orderType.charAt(0).toUpperCase() + orderType.slice(1)}</p>
              ${orderType === 'delivery' ? `<p><strong>Delivery Address:</strong> ${deliveryAddress}</p>` : ''}

              <h4>Items:</h4>
              <ul class="items-list">
                ${itemsList}
              </ul>

              <div class="total">Total: $${totalAmount.toFixed(2)}</div>
            </div>

            <p>You will receive updates as your order progresses.</p>
            <p>Best regards,<br>The Near Expiry Team</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 Near Expiry. All rights reserved.</p>
            <p>This is an automated email, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Order Confirmation - Near Expiry

      Thank you for your order!

      Order ID: #${orderId.slice(0, 8)}
      Restaurant: ${restaurantName}
      Order Type: ${orderType.charAt(0).toUpperCase() + orderType.slice(1)}
      ${orderType === 'delivery' ? `Delivery Address: ${deliveryAddress}` : ''}

      Items:
      ${items.map(item => `- ${item.productName} x ${item.quantity} - $${(item.priceAtOrder * item.quantity).toFixed(2)}`).join('\n')}

      Total: $${totalAmount.toFixed(2)}

      You will receive updates as your order progresses.

      Best regards,
      The Near Expiry Team
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return null;
  }
};

/**
 * Send order status update email to customer
 * @param {string} email - Customer email address
 * @param {object} statusDetails - Status update details
 * @returns {Promise<object>} Email send result
 */
const sendOrderStatusUpdateEmail = async (email, statusDetails) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.warn('Email service not configured, skipping order status update email');
    return null;
  }

  const { orderId, restaurantName, newStatus, oldStatus } = statusDetails;

  const statusMessages = {
    preparing: {
      subject: 'Your order is being prepared',
      message: 'Good news! The restaurant has started preparing your order.',
      color: '#FF9800',
    },
    ready: {
      subject: 'Your order is ready',
      message: 'Your order is ready for pickup/delivery!',
      color: '#2196F3',
    },
    completed: {
      subject: 'Order completed',
      message: 'Your order has been completed. Thank you for choosing Near Expiry!',
      color: '#4CAF50',
    },
    cancelled: {
      subject: 'Order cancelled',
      message: 'Unfortunately, your order has been cancelled. Please contact the restaurant for more information.',
      color: '#f44336',
    },
  };

  const statusInfo = statusMessages[newStatus] || {
    subject: 'Order status updated',
    message: `Your order status has been updated to: ${newStatus}`,
    color: '#4CAF50',
  };

  const mailOptions = {
    from: `"Near Expiry" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `${statusInfo.subject} - Order #${orderId.slice(0, 8)}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Status Update</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background-color: #f9f9f9;
            border-radius: 8px;
            padding: 30px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #4CAF50;
            margin: 0;
          }
          .content {
            background-color: white;
            padding: 25px;
            border-radius: 5px;
          }
          .status-badge {
            display: inline-block;
            padding: 10px 20px;
            background-color: ${statusInfo.color};
            color: white;
            border-radius: 20px;
            font-weight: bold;
            text-transform: uppercase;
            margin: 15px 0;
          }
          .order-info {
            margin: 20px 0;
            padding: 15px;
            background-color: #f5f5f5;
            border-radius: 5px;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Near Expiry</h1>
          </div>
          <div class="content">
            <h2>Order Status Update</h2>
            <p>Hello,</p>
            <p>${statusInfo.message}</p>

            <div style="text-align: center;">
              <span class="status-badge">${newStatus}</span>
            </div>

            <div class="order-info">
              <p><strong>Order ID:</strong> #${orderId.slice(0, 8)}</p>
              <p><strong>Restaurant:</strong> ${restaurantName}</p>
              <p><strong>Status:</strong> ${oldStatus} → ${newStatus}</p>
            </div>

            ${newStatus === 'ready' ? '<p><strong>Action Required:</strong> Please proceed to pick up your order or wait for delivery.</p>' : ''}

            <p>Thank you for using Near Expiry!</p>
            <p>Best regards,<br>The Near Expiry Team</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 Near Expiry. All rights reserved.</p>
            <p>This is an automated email, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Order Status Update - Near Expiry

      ${statusInfo.message}

      Order ID: #${orderId.slice(0, 8)}
      Restaurant: ${restaurantName}
      Status: ${oldStatus} → ${newStatus}

      ${newStatus === 'ready' ? 'Action Required: Please proceed to pick up your order or wait for delivery.' : ''}

      Thank you for using Near Expiry!

      Best regards,
      The Near Expiry Team
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Order status update email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending order status update email:', error);
    return null;
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendVerificationOTPEmail,
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
};
