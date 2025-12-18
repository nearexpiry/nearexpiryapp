import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Restaurants.css';

const Restaurants = () => {
  const { axiosInstance } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      // Get all users with role restaurant
      const response = await axiosInstance.get('/admin/users', {
        params: { role: 'restaurant', limit: 100 },
      });

      // Filter only users who have restaurant data
      const restaurantUsers = response.data.data.users.filter(
        (user) => user.restaurant !== null
      );
      setRestaurants(restaurantUsers);
      setError(null);
    } catch (err) {
      console.error('Failed to load restaurants:', err);
      setError('Failed to load restaurants. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadRestaurantDetails = async (restaurant) => {
    try {
      // Load product count and sales data
      const productsResponse = await axiosInstance.get('/products', {
        params: { restaurant_id: restaurant.restaurant.id },
      });

      // Get sales data if available
      let salesData = { totalSales: 0, orderCount: 0 };
      try {
        const salesResponse = await axiosInstance.get('/sales/stats');
        salesData = {
          totalSales: salesResponse.data.data.totalRevenue || 0,
          orderCount: salesResponse.data.data.totalOrders || 0,
        };
      } catch (salesErr) {
        console.log('Sales data not available:', salesErr);
      }

      setSelectedRestaurant({
        ...restaurant,
        productsCount: productsResponse.data.data?.products?.length || 0,
        ...salesData,
      });
      setShowDetailsModal(true);
    } catch (err) {
      console.error('Failed to load restaurant details:', err);
      alert('Failed to load restaurant details. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading restaurants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Restaurants</h1>
        <p className="page-description">View and manage all restaurants on the platform</p>
      </div>

      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={loadRestaurants} className="btn btn-sm">
            Retry
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card">
          <h3>Total Restaurants</h3>
          <div className="summary-value">{restaurants.length}</div>
        </div>
        <div className="summary-card">
          <h3>Open Now</h3>
          <div className="summary-value success">
            {restaurants.filter((r) => r.restaurant.isOpen).length}
          </div>
        </div>
        <div className="summary-card">
          <h3>Active Accounts</h3>
          <div className="summary-value">
            {restaurants.filter((r) => r.isActive).length}
          </div>
        </div>
      </div>

      {/* Restaurants Table */}
      <div className="table-container">
        <table className="restaurants-table">
          <thead>
            <tr>
              <th>Restaurant Name</th>
              <th>Owner Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Status</th>
              <th>Account Status</th>
              <th>Registered</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  No restaurants found
                </td>
              </tr>
            ) : (
              restaurants.map((restaurant) => (
                <tr key={restaurant.id}>
                  <td className="restaurant-name-cell">
                    <div className="restaurant-name-wrapper">
                      {restaurant.restaurant.logoUrl && (
                        <img
                          src={restaurant.restaurant.logoUrl}
                          alt={restaurant.restaurant.name}
                          className="restaurant-logo-small"
                        />
                      )}
                      <span className="restaurant-name">{restaurant.restaurant.name}</span>
                    </div>
                  </td>
                  <td>{restaurant.email}</td>
                  <td>{restaurant.restaurant.phone}</td>
                  <td className="address-cell">{restaurant.restaurant.address}</td>
                  <td>
                    <span className={`status-badge ${restaurant.restaurant.isOpen ? 'open' : 'closed'}`}>
                      {restaurant.restaurant.isOpen ? '🟢 Open' : '🔴 Closed'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${restaurant.isActive ? 'active' : 'inactive'}`}>
                      {restaurant.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{formatDate(restaurant.createdAt)}</td>
                  <td>
                    <button
                      onClick={() => loadRestaurantDetails(restaurant)}
                      className="btn btn-sm btn-primary"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Restaurant Details Modal */}
      {showDetailsModal && selectedRestaurant && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Restaurant Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="modal-close"
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="restaurant-details-grid">
                <div className="details-section">
                  <h3>Basic Information</h3>
                  <div className="details-row">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{selectedRestaurant.restaurant.name}</span>
                  </div>
                  <div className="details-row">
                    <span className="detail-label">Owner Email:</span>
                    <span className="detail-value">{selectedRestaurant.email}</span>
                  </div>
                  <div className="details-row">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">{selectedRestaurant.restaurant.phone}</span>
                  </div>
                  <div className="details-row">
                    <span className="detail-label">Address:</span>
                    <span className="detail-value">{selectedRestaurant.restaurant.address}</span>
                  </div>
                  {selectedRestaurant.restaurant.description && (
                    <div className="details-row">
                      <span className="detail-label">Description:</span>
                      <span className="detail-value">{selectedRestaurant.restaurant.description}</span>
                    </div>
                  )}
                </div>

                <div className="details-section">
                  <h3>Status</h3>
                  <div className="details-row">
                    <span className="detail-label">Restaurant Status:</span>
                    <span className={`status-badge ${selectedRestaurant.restaurant.isOpen ? 'open' : 'closed'}`}>
                      {selectedRestaurant.restaurant.isOpen ? '🟢 Open' : '🔴 Closed'}
                    </span>
                  </div>
                  <div className="details-row">
                    <span className="detail-label">Account Status:</span>
                    <span className={`status-badge ${selectedRestaurant.isActive ? 'active' : 'inactive'}`}>
                      {selectedRestaurant.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="details-row">
                    <span className="detail-label">Registered:</span>
                    <span className="detail-value">{formatDate(selectedRestaurant.createdAt)}</span>
                  </div>
                </div>

                <div className="details-section">
                  <h3>Business Metrics</h3>
                  <div className="details-row">
                    <span className="detail-label">Products Listed:</span>
                    <span className="detail-value">{selectedRestaurant.productsCount || 0}</span>
                  </div>
                  <div className="details-row">
                    <span className="detail-label">Total Orders:</span>
                    <span className="detail-value">{selectedRestaurant.orderCount || 0}</span>
                  </div>
                  <div className="details-row">
                    <span className="detail-label">Total Sales:</span>
                    <span className="detail-value">
                      ${(selectedRestaurant.totalSales || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {selectedRestaurant.restaurant.logoUrl && (
                <div className="logo-preview">
                  <h3>Logo</h3>
                  <img
                    src={selectedRestaurant.restaurant.logoUrl}
                    alt={selectedRestaurant.restaurant.name}
                    className="restaurant-logo-large"
                  />
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="btn btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Restaurants;
