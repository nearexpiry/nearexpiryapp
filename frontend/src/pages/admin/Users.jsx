import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Users.css';

const Users = () => {
  const { axiosInstance } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    role: '',
    is_active: '',
    search: '',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    limit: 10,
  });
  const [confirmDialog, setConfirmDialog] = useState({
    show: false,
    userId: null,
    userEmail: null,
    currentStatus: false,
  });

  useEffect(() => {
    loadUsers();
  }, [filters, pagination.currentPage]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: pagination.limit,
        ...(filters.role && { role: filters.role }),
        ...(filters.is_active !== '' && { is_active: filters.is_active }),
        ...(filters.search && { search: filters.search }),
      };

      const response = await axiosInstance.get('/admin/users', { params });
      setUsers(response.data.data.users);
      setPagination(response.data.data.pagination);
      setError(null);
    } catch (err) {
      console.error('Failed to load users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  const showConfirmDialog = (user) => {
    setConfirmDialog({
      show: true,
      userId: user.id,
      userEmail: user.email,
      currentStatus: user.isActive,
    });
  };

  const hideConfirmDialog = () => {
    setConfirmDialog({
      show: false,
      userId: null,
      userEmail: null,
      currentStatus: false,
    });
  };

  const toggleUserStatus = async () => {
    try {
      const { userId } = confirmDialog;
      await axiosInstance.patch(`/admin/users/${userId}/toggle-status`);

      // Reload users to get updated data
      await loadUsers();
      hideConfirmDialog();
    } catch (err) {
      console.error('Failed to toggle user status:', err);
      alert(err.response?.data?.message || 'Failed to toggle user status. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading && users.length === 0) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>User Management</h1>
        <p className="page-description">Manage user accounts and permissions</p>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="search">Search by Email</label>
          <input
            id="search"
            type="text"
            placeholder="Enter email..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            value={filters.role}
            onChange={(e) => handleFilterChange('role', e.target.value)}
            className="filter-select"
          >
            <option value="">All Roles</option>
            <option value="client">Client</option>
            <option value="restaurant">Restaurant</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={filters.is_active}
            onChange={(e) => handleFilterChange('is_active', e.target.value)}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        <div className="filter-group">
          <button onClick={loadUsers} className="btn btn-secondary">
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={loadUsers} className="btn btn-sm">
            Retry
          </button>
        </div>
      )}

      {/* Users Table */}
      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Restaurant</th>
              <th>Registered</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="email-cell">{user.email}</td>
                  <td>
                    <span className={`role-badge role-${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="restaurant-cell">
                    {user.restaurant ? (
                      <div className="restaurant-info">
                        <div className="restaurant-name">{user.restaurant.name}</div>
                        <div className="restaurant-meta">
                          {user.restaurant.isOpen ? '🟢 Open' : '🔴 Closed'}
                        </div>
                      </div>
                    ) : (
                      <span className="no-data-inline">-</span>
                    )}
                  </td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>
                    <button
                      onClick={() => showConfirmDialog(user)}
                      className={`btn btn-sm ${user.isActive ? 'btn-danger' : 'btn-success'}`}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="btn btn-secondary btn-sm"
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalUsers} total users)
          </span>
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="btn btn-secondary btn-sm"
          >
            Next
          </button>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog.show && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Action</h3>
            <p>
              Are you sure you want to{' '}
              <strong>{confirmDialog.currentStatus ? 'deactivate' : 'activate'}</strong>{' '}
              the account for <strong>{confirmDialog.userEmail}</strong>?
            </p>
            {confirmDialog.currentStatus && (
              <p className="warning-text">
                This user will not be able to log in after deactivation.
              </p>
            )}
            <div className="modal-actions">
              <button onClick={hideConfirmDialog} className="btn btn-secondary">
                Cancel
              </button>
              <button
                onClick={toggleUserStatus}
                className={`btn ${confirmDialog.currentStatus ? 'btn-danger' : 'btn-success'}`}
              >
                {confirmDialog.currentStatus ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
