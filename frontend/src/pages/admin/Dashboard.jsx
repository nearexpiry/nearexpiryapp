import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { axiosInstance } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/admin/stats');
      setStats(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Failed to load statistics:', err);
      setError('Failed to load statistics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={loadStats} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p className="page-description">Overview of system statistics and metrics</p>
      </div>

      <div className="stats-grid">
        {/* User Statistics */}
        <div className="stat-card">
          <div className="stat-header">
            <h3>Total Users</h3>
            <span className="stat-icon">👥</span>
          </div>
          <div className="stat-value">{stats?.users?.total || 0}</div>
          <div className="stat-breakdown">
            <div className="stat-item">
              <span className="stat-label">Clients:</span>
              <span className="stat-number">{stats?.users?.byRole?.client?.total || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Restaurants:</span>
              <span className="stat-number">{stats?.users?.byRole?.restaurant?.total || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Admins:</span>
              <span className="stat-number">{stats?.users?.byRole?.admin?.total || 0}</span>
            </div>
          </div>
        </div>

        {/* Active Users */}
        <div className="stat-card">
          <div className="stat-header">
            <h3>Active Users</h3>
            <span className="stat-icon">✅</span>
          </div>
          <div className="stat-value">
            {(stats?.users?.byRole?.client?.active || 0) +
              (stats?.users?.byRole?.restaurant?.active || 0) +
              (stats?.users?.byRole?.admin?.active || 0)}
          </div>
          <div className="stat-breakdown">
            <div className="stat-item">
              <span className="stat-label">Active Clients:</span>
              <span className="stat-number">{stats?.users?.byRole?.client?.active || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Active Restaurants:</span>
              <span className="stat-number">{stats?.users?.byRole?.restaurant?.active || 0}</span>
            </div>
          </div>
        </div>

        {/* Restaurants */}
        <div className="stat-card">
          <div className="stat-header">
            <h3>Restaurants</h3>
            <span className="stat-icon">🏪</span>
          </div>
          <div className="stat-value">{stats?.restaurants?.total || 0}</div>
          <div className="stat-breakdown">
            <div className="stat-item">
              <span className="stat-label">Open:</span>
              <span className="stat-number success">{stats?.restaurants?.open || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Closed:</span>
              <span className="stat-number danger">{stats?.restaurants?.closed || 0}</span>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="stat-card">
          <div className="stat-header">
            <h3>Total Orders</h3>
            <span className="stat-icon">📦</span>
          </div>
          <div className="stat-value">{stats?.orders?.total || 0}</div>
          <div className="stat-breakdown">
            <div className="stat-item">
              <span className="stat-label">Pending:</span>
              <span className="stat-number">{stats?.orders?.byStatus?.pending || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Preparing:</span>
              <span className="stat-number">{stats?.orders?.byStatus?.preparing || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Completed:</span>
              <span className="stat-number success">{stats?.orders?.byStatus?.completed || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Cancelled:</span>
              <span className="stat-number danger">{stats?.orders?.byStatus?.cancelled || 0}</span>
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="stat-card highlight">
          <div className="stat-header">
            <h3>Total Revenue</h3>
            <span className="stat-icon">💰</span>
          </div>
          <div className="stat-value">${(stats?.revenue?.total || 0).toFixed(2)}</div>
          <div className="stat-meta">From all completed orders</div>
        </div>

        {/* Commission */}
        <div className="stat-card highlight">
          <div className="stat-header">
            <h3>Commission Collected</h3>
            <span className="stat-icon">💵</span>
          </div>
          <div className="stat-value">${(stats?.revenue?.commission || 0).toFixed(2)}</div>
          <div className="stat-meta">Platform earnings</div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="recent-activity">
        <h2>System Overview</h2>
        <div className="activity-cards">
          <div className="activity-card">
            <h4>User Activity</h4>
            <p>
              {stats?.users?.total || 0} total users registered on the platform
            </p>
            <p className="activity-detail">
              {((stats?.users?.byRole?.client?.active || 0) +
                (stats?.users?.byRole?.restaurant?.active || 0)) /
                (stats?.users?.total || 1) * 100}% active rate
            </p>
          </div>

          <div className="activity-card">
            <h4>Restaurant Status</h4>
            <p>
              {stats?.restaurants?.open || 0} out of {stats?.restaurants?.total || 0} restaurants currently open
            </p>
            <p className="activity-detail">
              {((stats?.restaurants?.open || 0) / (stats?.restaurants?.total || 1) * 100).toFixed(0)}% availability rate
            </p>
          </div>

          <div className="activity-card">
            <h4>Order Completion</h4>
            <p>
              {stats?.orders?.byStatus?.completed || 0} orders successfully completed
            </p>
            <p className="activity-detail">
              {((stats?.orders?.byStatus?.completed || 0) / (stats?.orders?.total || 1) * 100).toFixed(0)}% completion rate
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
