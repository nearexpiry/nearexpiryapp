import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './RestaurantProfile.css';

const RestaurantProfile = () => {
  const { axiosInstance } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
  });

  const [restaurantData, setRestaurantData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Load existing restaurant profile
  useEffect(() => {
    loadRestaurantProfile();
  }, []);

  const loadRestaurantProfile = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/restaurants/my-profile');
      const restaurant = response.data.data.restaurant;

      setRestaurantData(restaurant);
      setFormData({
        name: restaurant.name || '',
        description: restaurant.description || '',
        address: restaurant.address || '',
        phone: restaurant.phone || '',
      });
    } catch (error) {
      // If 404, it means no profile exists yet, which is fine
      if (error.response?.status !== 404) {
        console.error('Failed to load restaurant profile:', error);
        setMessage({
          type: 'error',
          text: error.response?.data?.message || 'Failed to load profile',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.address || !formData.phone) {
      setMessage({
        type: 'error',
        text: 'Please fill in all required fields',
      });
      return;
    }

    try {
      setSaving(true);
      setGeocoding(true);
      setMessage({ type: 'info', text: 'Geocoding address...' });

      const response = await axiosInstance.post('/restaurants/profile', formData);
      const restaurant = response.data.data.restaurant;

      setRestaurantData(restaurant);
      setMessage({
        type: 'success',
        text: response.data.message,
      });

      // Clear geocoding state
      setGeocoding(false);
    } catch (error) {
      console.error('Failed to save restaurant profile:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to save profile',
      });
      setGeocoding(false);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleOpen = async () => {
    try {
      const response = await axiosInstance.patch('/restaurants/toggle-open');
      const restaurant = response.data.data.restaurant;

      setRestaurantData(restaurant);
      setMessage({
        type: 'success',
        text: response.data.message,
      });
    } catch (error) {
      console.error('Failed to toggle status:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to toggle status',
      });
    }
  };

  if (loading) {
    return (
      <div className="restaurant-profile-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="restaurant-profile-container">
      <div className="restaurant-profile-header">
        <h1>Restaurant Profile</h1>
        {restaurantData && (
          <div className="status-toggle">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={restaurantData.isOpen}
                onChange={handleToggleOpen}
              />
              <span className="toggle-slider"></span>
            </label>
            <span className={`status-text ${restaurantData.isOpen ? 'open' : 'closed'}`}>
              {restaurantData.isOpen ? 'Open' : 'Closed'}
            </span>
          </div>
        )}
      </div>

      {message.text && (
        <div className={`message message-${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="restaurant-profile-form">
        <div className="form-group">
          <label htmlFor="name">
            Restaurant Name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter restaurant name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter restaurant description"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">
            Address <span className="required">*</span>
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Enter complete address"
            rows="3"
            required
          />
          <small className="form-hint">
            This address will be geocoded to get coordinates for map display
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="phone">
            Phone Number <span className="required">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Enter phone number"
            required
          />
        </div>

        {restaurantData && restaurantData.latitude && restaurantData.longitude && (
          <div className="coordinates-display">
            <h3>Location Coordinates</h3>
            <div className="coordinates">
              <div className="coordinate-item">
                <strong>Latitude:</strong> {restaurantData.latitude}
              </div>
              <div className="coordinate-item">
                <strong>Longitude:</strong> {restaurantData.longitude}
              </div>
            </div>
          </div>
        )}

        {restaurantData && restaurantData.logoUrl && (
          <div className="logo-display">
            <h3>Current Logo</h3>
            <img src={restaurantData.logoUrl} alt="Restaurant logo" />
          </div>
        )}

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving || geocoding}
          >
            {geocoding ? (
              <>
                <span className="btn-spinner"></span>
                Geocoding...
              </>
            ) : saving ? (
              <>
                <span className="btn-spinner"></span>
                Saving...
              </>
            ) : (
              'Save Profile'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RestaurantProfile;
