-- Migration: Add email verification support
-- Description: Adds email_verified column to users table and creates email_verification_tokens table

-- Add email_verified column to users table (default to true for existing users)
ALTER TABLE users
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT true;

-- Create email verification tokens table
CREATE TABLE IF NOT EXISTS email_verification_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    otp_code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for email verification tokens
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_user_id ON email_verification_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_expires_at ON email_verification_tokens(expires_at);

-- Update existing users to have email_verified = true (they registered before this feature)
UPDATE users SET email_verified = true WHERE email_verified IS NULL;

-- Now set the default to false for new users
ALTER TABLE users ALTER COLUMN email_verified SET DEFAULT false;
