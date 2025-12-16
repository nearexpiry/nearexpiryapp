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

module.exports = {
  sendPasswordResetEmail,
  sendWelcomeEmail,
};
