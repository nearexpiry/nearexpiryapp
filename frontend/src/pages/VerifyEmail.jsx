import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const VerifyEmail = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const inputRefs = useRef([]);
  const { verifyEmail, resendVerificationOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from navigation state
  const email = location.state?.email;
  const role = location.state?.role;

  useEffect(() => {
    // Redirect if no email provided
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    // Resend cooldown timer
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp];
      pastedData.split('').forEach((char, i) => {
        if (i < 6) newOtp[i] = char;
      });
      setOtp(newOtp);
      // Focus last filled input or the next empty one
      const lastIndex = Math.min(pastedData.length - 1, 5);
      inputRefs.current[lastIndex].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      setLoading(false);
      return;
    }

    const result = await verifyEmail(email, otpCode);

    if (result.success) {
      setSuccess('Email verified successfully! Redirecting...');
      setTimeout(() => {
        // Redirect based on user role
        if (role === 'restaurant') {
          navigate('/restaurant/profile');
        } else {
          navigate('/');
        }
      }, 1500);
    } else {
      setError(result.error);
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0].focus();
    }

    setLoading(false);
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setError('');
    setSuccess('');
    setResendLoading(true);

    const result = await resendVerificationOTP(email);

    if (result.success) {
      setSuccess('A new verification code has been sent to your email.');
      setResendCooldown(60); // 60 second cooldown
      // Clear current OTP
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0].focus();
    } else {
      setError(result.error);
    }

    setResendLoading(false);
  };

  if (!email) {
    return null;
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Verify Your Email</h1>
        <p className="auth-subtitle">
          We've sent a 6-digit verification code to<br />
          <strong>{email}</strong>
        </p>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="otp-container">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="otp-input"
                disabled={loading}
              />
            ))}
          </div>

          <p className="otp-expiry-note">Code expires in 10 minutes</p>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <div className="auth-divider">
          <span>Didn't receive the code?</span>
        </div>

        <button
          onClick={handleResend}
          className="auth-secondary-button"
          disabled={resendLoading || resendCooldown > 0}
        >
          {resendLoading
            ? 'Sending...'
            : resendCooldown > 0
            ? `Resend Code (${resendCooldown}s)`
            : 'Resend Code'}
        </button>

        <div className="auth-links" style={{ marginTop: '20px' }}>
          <Link to="/register" className="auth-link">
            Use a different email
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
