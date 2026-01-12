# Email Service Setup Guide

This guide explains how to set up free email services for your Near Expiry application to enable password reset and order notification features.

## Features Implemented

- Password reset emails with secure tokens
- Order confirmation emails when customers place orders
- Order status update notifications (preparing, ready, completed, cancelled)
- Professional HTML email templates with branding

---

## Free Email Service Options

### Option 1: Gmail (Recommended for Development)

Gmail offers **free SMTP** access for personal use. Perfect for testing and low-volume production.

**Limits:**
- 500 emails per day for free Gmail accounts
- 2,000 emails per day for Google Workspace accounts

**Setup Steps:**

1. **Enable 2-Factor Authentication**
   - Go to your Google Account: https://myaccount.google.com/
   - Navigate to Security
   - Enable 2-Step Verification

2. **Generate App Password**
   - After enabling 2FA, go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "Near Expiry App"
   - Copy the 16-character password

3. **Update `.env` file**
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=your-16-char-app-password
   ```

**Security Notes:**
- Never commit your `.env` file to git
- Use App Passwords, not your regular Gmail password
- App Passwords bypass 2FA specifically for this application

---

### Option 2: SendGrid (Recommended for Production)

SendGrid offers **100 emails/day for FREE** (forever), with excellent deliverability and email analytics.

**Limits:**
- Free tier: 100 emails/day
- Paid plans start at $19.95/month for 50,000 emails

**Setup Steps:**

1. **Sign up for SendGrid**
   - Visit: https://signup.sendgrid.com/
   - Create a free account
   - Verify your email address

2. **Create an API Key**
   - Go to Settings > API Keys
   - Click "Create API Key"
   - Choose "Restricted Access"
   - Enable "Mail Send" permission
   - Copy the API key (you'll only see it once)

3. **Verify Sender Identity**
   - Go to Settings > Sender Authentication
   - Verify a Single Sender (simpler) OR
   - Authenticate your Domain (better for production)

4. **Update `.env` file**
   ```env
   EMAIL_HOST=smtp.sendgrid.net
   EMAIL_PORT=587
   EMAIL_USER=apikey
   EMAIL_PASS=your-sendgrid-api-key
   ```

**Advantages:**
- Better deliverability than Gmail
- Email analytics and tracking
- Dedicated IP available on paid plans
- Webhook support for email events

---

### Option 3: Mailgun (Good Alternative)

Mailgun offers **5,000 emails/month for the first 3 months** on their trial plan.

**Limits:**
- Trial: 5,000 emails/month for 3 months
- Pay-as-you-go: $0.80 per 1,000 emails after trial

**Setup Steps:**

1. **Sign up for Mailgun**
   - Visit: https://signup.mailgun.com/
   - Create a free account

2. **Get SMTP Credentials**
   - Go to Sending > Domain settings
   - Click on your sandbox domain
   - Note the SMTP credentials

3. **Update `.env` file**
   ```env
   EMAIL_HOST=smtp.mailgun.org
   EMAIL_PORT=587
   EMAIL_USER=postmaster@sandboxXXXXXXXXX.mailgun.org
   EMAIL_PASS=your-mailgun-password
   ```

---

### Option 4: Brevo (formerly Sendinblue)

Brevo offers **300 emails/day for FREE** with excellent features.

**Limits:**
- Free tier: 300 emails/day
- Paid plans start at $25/month

**Setup Steps:**

1. **Sign up for Brevo**
   - Visit: https://www.brevo.com/
   - Create a free account

2. **Get SMTP Credentials**
   - Go to SMTP & API
   - Copy your SMTP server and port
   - Generate an SMTP key

3. **Update `.env` file**
   ```env
   EMAIL_HOST=smtp-relay.brevo.com
   EMAIL_PORT=587
   EMAIL_USER=your-brevo-login-email
   EMAIL_PASS=your-smtp-key
   ```

---

## Configuration

### Current `.env` Setup

Your backend `.env` file is located at: `/backend/.env`

Required email configuration variables:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com          # SMTP host
EMAIL_PORT=587                     # SMTP port (587 for TLS, 465 for SSL)
EMAIL_USER=your_email@gmail.com    # Your email or username
EMAIL_PASS=your_app_password       # App password or API key

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000
```

### Testing Your Configuration

1. Start your backend server:
   ```bash
   cd backend
   npm start
   ```

2. Test password reset functionality:
   - Try the "Forgot Password" feature in your app
   - Check the console for email logs
   - Verify the email arrives in your inbox

3. Test order notifications:
   - Create a test order as a customer
   - Check for order confirmation email
   - Update order status as a restaurant
   - Check for status update emails

---

## Email Templates Included

### 1. Password Reset Email
- Sent when user requests password reset
- Contains secure reset link (expires in 1 hour)
- Professional HTML template with branding
- Plain text fallback

### 2. Order Confirmation Email
- Sent when customer places an order
- Includes order details, items, and total
- Restaurant information
- Delivery/pickup details

### 3. Order Status Update Email
- Sent when restaurant updates order status
- Color-coded status badges:
  - **Preparing** (Orange): Restaurant is preparing your order
  - **Ready** (Blue): Order is ready for pickup/delivery
  - **Completed** (Green): Order has been completed
  - **Cancelled** (Red): Order was cancelled
- Includes order ID and restaurant name

### 4. Welcome Email (Optional)
- Can be enabled in registration flow
- Welcomes new users to the platform

---

## Best Practices

### For Development
- Use Gmail with App Passwords
- Test all email templates before going to production
- Check spam folders if emails don't arrive

### For Production
- Use dedicated email services (SendGrid, Mailgun, Brevo)
- Set up domain authentication (SPF, DKIM, DMARC)
- Monitor email deliverability and bounce rates
- Consider using a custom domain email
- Set up email analytics
- Test email rendering across different email clients

### Security
- Never commit `.env` files to version control
- Use environment variables for sensitive data
- Rotate API keys and passwords regularly
- Enable rate limiting to prevent abuse
- Monitor for suspicious email activity

### Deliverability Tips
- Use a verified sender email address
- Include plain text versions of emails
- Don't use spam trigger words in subject lines
- Include unsubscribe links for marketing emails
- Maintain a good sender reputation

---

## Troubleshooting

### Emails Not Sending

1. **Check Console Logs**
   - Look for error messages in your backend console
   - Verify SMTP credentials are correct

2. **Verify Environment Variables**
   ```bash
   cd backend
   node -e "console.log(process.env.EMAIL_HOST, process.env.EMAIL_USER)"
   ```

3. **Test SMTP Connection**
   - Try sending a test email through your email service's dashboard
   - Verify firewall isn't blocking port 587

### Emails Going to Spam

1. **For Gmail Users**
   - Add sender to contacts
   - Mark as "Not Spam"

2. **For Production**
   - Set up SPF records
   - Configure DKIM authentication
   - Add DMARC policy
   - Use verified domain

### Gmail "Less Secure Apps" Error

- This error occurs when not using App Passwords
- Solution: Enable 2FA and generate App Password (see Gmail setup above)

### Rate Limit Exceeded

- Gmail: 500 emails/day limit
- Solution: Upgrade to SendGrid, Mailgun, or Brevo for higher limits

---

## Testing Checklist

- [ ] Password reset email sends successfully
- [ ] Order confirmation email sends when order is created
- [ ] Status update email sends when order status changes to "preparing"
- [ ] Status update email sends when order status changes to "ready"
- [ ] Status update email sends when order status changes to "completed"
- [ ] Status update email sends when order status changes to "cancelled"
- [ ] Emails render correctly in Gmail
- [ ] Emails render correctly in Outlook
- [ ] Plain text versions display properly
- [ ] Email links work correctly
- [ ] No errors in console logs

---

## API Reference

### Email Service Functions

Located in: `/backend/utils/emailService.js`

```javascript
// Send password reset email
await sendPasswordResetEmail(email, resetToken);

// Send welcome email (optional)
await sendWelcomeEmail(email, userName);

// Send order confirmation
await sendOrderConfirmationEmail(email, {
  orderId: 'uuid',
  restaurantName: 'Restaurant Name',
  totalAmount: 45.50,
  items: [...],
  orderType: 'pickup' | 'delivery',
  deliveryAddress: 'optional address'
});

// Send order status update
await sendOrderStatusUpdateEmail(email, {
  orderId: 'uuid',
  restaurantName: 'Restaurant Name',
  newStatus: 'preparing' | 'ready' | 'completed' | 'cancelled',
  oldStatus: 'pending'
});
```

---

## Quick Start Summary

**For immediate testing with Gmail:**

1. Enable 2FA on your Gmail account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Update `/backend/.env`:
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-char-app-password
   ```
4. Restart your backend server
5. Test the forgot password feature

**For production deployment:**

1. Sign up for SendGrid: https://signup.sendgrid.com/
2. Create API key and verify sender
3. Update `.env` with SendGrid credentials
4. Set up domain authentication for better deliverability
5. Monitor email analytics in SendGrid dashboard

---

## Support

If you encounter issues:
- Check the backend console logs for error messages
- Verify all environment variables are set correctly
- Test your SMTP credentials with the email service's dashboard
- Review the troubleshooting section above

## Additional Resources

- [Nodemailer Documentation](https://nodemailer.com/)
- [SendGrid SMTP API](https://docs.sendgrid.com/for-developers/sending-email/integrating-with-the-smtp-api)
- [Gmail SMTP Settings](https://support.google.com/mail/answer/7126229)
- [Email Best Practices](https://sendgrid.com/blog/email-best-practices/)
