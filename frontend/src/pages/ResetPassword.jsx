import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Get token from URL query parameters
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError('Invalid reset link. Please request a new password reset.');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    // Validation
    if (!token) {
      setError('Invalid reset token');
      setLoading(false);
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    // Call resetPassword function
    const result = await resetPassword(token, newPassword);

    if (result.success) {
      setSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Reset Password</h1>
        <p className="auth-subtitle">Enter your new password</p>

        {error && <div className="auth-error">{error}</div>}

        {success && (
          <div className="auth-success">
            Your password has been reset successfully! Redirecting to login page...
          </div>
        )}

        {!success && token && (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min. 8 characters)"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        {!token && (
          <div className="auth-divider">
            <span>Need a new reset link?</span>
          </div>
        )}

        <Link
          to={!token ? '/forgot-password' : '/login'}
          className="auth-secondary-button"
        >
          {!token ? 'Request Password Reset' : 'Back to Login'}
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;
