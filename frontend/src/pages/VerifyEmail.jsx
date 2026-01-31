import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyEmail, resendVerificationOTP } = useAuth();

  // Get email from: 1) navigation state, 2) URL query param, 3) user input
  const initialEmail = location.state?.email || searchParams.get('email') || '';

  const [email, setEmail] = useState(initialEmail);
  const [showEmailInput, setShowEmailInput] = useState(!initialEmail);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [codeSent, setCodeSent] = useState(!!initialEmail); // Code already sent if email came from registration

  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus first OTP input on mount if email is set
    if (email && codeSent && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [email, codeSent]);

  useEffect(() => {
    // Resend cooldown timer
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleOtpChange = (index, value) => {
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
      const lastIndex = Math.min(pastedData.length - 1, 5);
      inputRefs.current[lastIndex].focus();
    }
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setResendLoading(true);

    const result = await resendVerificationOTP(email);

    if (result.success) {
      setSuccess('Verification code sent! Check your email.');
      setCodeSent(true);
      setShowEmailInput(false);
      setResendCooldown(60);
      // Focus first OTP input
      setTimeout(() => {
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }, 100);
    } else {
      setError(result.error);
    }

    setResendLoading(false);
  };

  const handleVerify = async (e) => {
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
      setSuccess('Email verified successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login', { state: { message: 'Email verified! Please log in.' } });
      }, 1500);
    } else {
      setError(result.error);
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
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
      setResendCooldown(60);
      setOtp(['', '', '', '', '', '']);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    } else {
      setError(result.error);
    }

    setResendLoading(false);
  };

  const handleChangeEmail = () => {
    setShowEmailInput(true);
    setCodeSent(false);
    setOtp(['', '', '', '', '', '']);
    setError('');
    setSuccess('');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Verify Your Email</h1>

        {!codeSent || showEmailInput ? (
          <>
            <p className="auth-subtitle">
              Enter your email address to receive a verification code
            </p>

            {error && <div className="auth-error">{error}</div>}
            {success && <div className="auth-success">{success}</div>}

            <form onSubmit={handleSendCode} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={resendLoading}
                />
              </div>

              <button
                type="submit"
                className="auth-button"
                disabled={resendLoading || !email}
              >
                {resendLoading ? 'Sending...' : 'Send Verification Code'}
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="auth-subtitle">
              We've sent a 6-digit verification code to<br />
              <strong>{email}</strong>
            </p>

            {error && <div className="auth-error">{error}</div>}
            {success && <div className="auth-success">{success}</div>}

            <form onSubmit={handleVerify} className="auth-form">
              <div className="otp-container">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
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

            <div className="auth-links" style={{ marginTop: '15px' }}>
              <button
                onClick={handleChangeEmail}
                className="auth-link"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Use a different email
              </button>
            </div>
          </>
        )}

        <div className="auth-divider">
          <span>Already verified?</span>
        </div>

        <Link to="/login" className="auth-secondary-button">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmail;
