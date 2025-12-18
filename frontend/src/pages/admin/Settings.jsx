import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Settings.css';

const Settings = () => {
  const { axiosInstance } = useAuth();
  const [commissionPercentage, setCommissionPercentage] = useState('');
  const [originalCommission, setOriginalCommission] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    loadCommission();
  }, []);

  const loadCommission = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/admin/commission');
      const commission = response.data.data.commissionPercentage;
      setCommissionPercentage(commission.toString());
      setOriginalCommission(commission.toString());
      setError(null);
    } catch (err) {
      console.error('Failed to load commission:', err);
      setError('Failed to load commission settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    // Allow empty string or valid numbers
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setCommissionPercentage(value);
      setSuccessMessage(null);
      setError(null);
    }
  };

  const validateCommission = () => {
    const commission = parseFloat(commissionPercentage);

    if (commissionPercentage === '' || isNaN(commission)) {
      setError('Please enter a valid commission percentage');
      return false;
    }

    if (commission < 0 || commission > 100) {
      setError('Commission percentage must be between 0 and 100');
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateCommission()) {
      return;
    }

    // Show confirmation dialog
    setShowConfirmDialog(true);
  };

  const confirmUpdate = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      await axiosInstance.put('/admin/commission', {
        commissionPercentage: parseFloat(commissionPercentage),
      });

      setOriginalCommission(commissionPercentage);
      setSuccessMessage('Commission percentage updated successfully!');
      setShowConfirmDialog(false);
    } catch (err) {
      console.error('Failed to update commission:', err);
      setError(
        err.response?.data?.message || 'Failed to update commission. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  const cancelUpdate = () => {
    setShowConfirmDialog(false);
  };

  const resetForm = () => {
    setCommissionPercentage(originalCommission);
    setError(null);
    setSuccessMessage(null);
  };

  const hasChanges = commissionPercentage !== originalCommission;

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Settings</h1>
        <p className="page-description">Configure platform settings and parameters</p>
      </div>

      <div className="settings-container">
        <div className="settings-card">
          <div className="settings-header">
            <h2>Commission Settings</h2>
            <p className="settings-description">
              Set the platform commission percentage applied to all orders. This commission is
              calculated on the total order amount.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="settings-form">
            <div className="form-group">
              <label htmlFor="commission">
                Commission Percentage (%)
                <span className="required">*</span>
              </label>
              <div className="input-with-suffix">
                <input
                  id="commission"
                  type="text"
                  value={commissionPercentage}
                  onChange={handleInputChange}
                  placeholder="Enter commission percentage (0-100)"
                  className="form-input"
                  disabled={saving}
                />
                <span className="input-suffix">%</span>
              </div>
              <small className="form-help">
                Enter a value between 0 and 100. For example, 10 means 10% commission.
              </small>
            </div>

            {error && (
              <div className="alert alert-error">
                <span className="alert-icon">⚠️</span>
                {error}
              </div>
            )}

            {successMessage && (
              <div className="alert alert-success">
                <span className="alert-icon">✓</span>
                {successMessage}
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                onClick={resetForm}
                disabled={!hasChanges || saving}
                className="btn btn-secondary"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={!hasChanges || saving}
                className="btn btn-primary"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>

          <div className="settings-info">
            <h3>How Commission Works</h3>
            <ul>
              <li>Commission is automatically calculated on each order</li>
              <li>The commission amount is stored separately from the restaurant revenue</li>
              <li>
                Example: With 10% commission, a $50 order generates $5 commission and $45
                restaurant revenue
              </li>
              <li>Changing the commission only affects future orders, not existing ones</li>
            </ul>
          </div>

          <div className="current-value-display">
            <div className="current-value-card">
              <span className="current-value-label">Current Commission:</span>
              <span className="current-value-number">{originalCommission}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Commission Change</h3>
            <p>
              Are you sure you want to update the commission percentage from{' '}
              <strong>{originalCommission}%</strong> to{' '}
              <strong>{commissionPercentage}%</strong>?
            </p>
            <p className="warning-text">
              This change will affect all future orders. Existing orders will retain their
              original commission rates.
            </p>
            <div className="modal-actions">
              <button
                onClick={cancelUpdate}
                disabled={saving}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={confirmUpdate}
                disabled={saving}
                className="btn btn-primary"
              >
                {saving ? 'Updating...' : 'Confirm Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
