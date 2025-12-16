import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    // Basic validation
    if (!email) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    // Call forgotPassword function
    const result = await forgotPassword(email);

    if (result.success) {
      setSuccess(true);
      setEmail('');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Forgot Password</h1>
        <p className="auth-subtitle">
          Enter your email address and we'll send you a link to reset your
          password
        </p>

        {error && <div className="auth-error">{error}</div>}

        {success && (
          <div className="auth-success">
            Password reset instructions have been sent to your email address.
            Please check your inbox and follow the link to reset your password.
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div className="auth-divider">
          <span>Remember your password?</span>
        </div>

        <Link to="/login" className="auth-secondary-button">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
