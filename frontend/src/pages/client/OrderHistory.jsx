import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import './OrderHistory.css';

const OrderHistory = () => {
  const navigate = useNavigate();
  const { axiosInstance, isAuthenticated, user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect if not authenticated or not a client
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/orders' } });
      return;
    }

    if (user?.role !== 'client') {
      alert('Only clients can view order history.');
      navigate('/');
      return;
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setError(null);
      const response = await axiosInstance.get('/orders/client/my-orders');

      if (response.data.status === 'success') {
        setOrders(response.data.data.orders);
      } else {
        throw new Error(response.data.message || 'Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.message || 'Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (isAuthenticated && user?.role === 'client') {
      fetchOrders();
    }
  }, [isAuthenticated, user]);

  // Auto-refresh active orders every 30 seconds
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'client') return;

    const hasActiveOrders = orders.some(
      (order) => !['completed', 'cancelled'].includes(order.status)
    );

    if (!hasActiveOrders) return;

    const interval = setInterval(() => {
      fetchOrders();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [orders, isAuthenticated, user]);

  // Filter orders when status filter changes
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((order) => order.status === statusFilter));
    }
  }, [statusFilter, orders]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEstimatedTime = (status) => {
    const times = {
      pending: '15-20 minutes',
      preparing: '10-15 minutes',
      ready: 'Ready for pickup/delivery',
      completed: 'Completed',
      cancelled: 'Cancelled',
    };
    return times[status] || 'Unknown';
  };

  const handleViewDetails = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  if (loading) {
    return (
      <div className="order-history-container">
        <div className="loading">Loading your orders...</div>
      </div>
    );
  }

  return (
    <div className="order-history-container">
      <div className="order-history-header">
        <h1>My Orders</h1>
        <div className="filter-buttons">
          <button
            className={statusFilter === 'all' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setStatusFilter('all')}
          >
            All
          </button>
          <button
            className={statusFilter === 'pending' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setStatusFilter('pending')}
          >
            Pending
          </button>
          <button
            className={statusFilter === 'preparing' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setStatusFilter('preparing')}
          >
            Preparing
          </button>
          <button
            className={statusFilter === 'ready' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setStatusFilter('ready')}
          >
            Ready
          </button>
          <button
            className={statusFilter === 'completed' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setStatusFilter('completed')}
          >
            Completed
          </button>
          <button
            className={statusFilter === 'cancelled' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setStatusFilter('cancelled')}
          >
            Cancelled
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchOrders} className="retry-btn">
            Retry
          </button>
        </div>
      )}

      {!error && filteredOrders.length === 0 && (
        <div className="no-orders">
          <p>
            {statusFilter === 'all'
              ? 'You have no orders yet.'
              : `No ${statusFilter} orders found.`}
          </p>
          <button onClick={() => navigate('/browse')} className="browse-btn">
            Browse Products
          </button>
        </div>
      )}

      <div className="orders-list">
        {filteredOrders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-card-header">
              <div className="order-info">
                <div className="order-id">
                  <span className="label">Order ID:</span>
                  <span className="value">{order.id.substring(0, 8).toUpperCase()}</span>
                </div>
                <div className="order-date">
                  <span className="date-value">{formatDate(order.createdAt)}</span>
                </div>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>

            <div className="order-card-body">
              <div className="restaurant-info">
                <h3>{order.restaurantName}</h3>
                <div className="order-type-badge">
                  {order.orderType === 'delivery' ? '🚚 Delivery' : '🏪 Pickup'}
                </div>
              </div>

              {order.orderType === 'delivery' && order.deliveryAddress && (
                <div className="delivery-info">
                  <p className="delivery-address">
                    <strong>Delivery to:</strong> {order.deliveryAddress}
                  </p>
                </div>
              )}

              <div className="order-items">
                {order.items.map((item) => (
                  <div key={item.id} className="order-item">
                    {item.productImage && (
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="item-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    <div className="item-details">
                      <span className="item-name">{item.productName}</span>
                      <span className="item-quantity">x{item.quantity}</span>
                    </div>
                    <span className="item-price">
                      ${(item.priceAtOrder * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <span className="total-label">Total:</span>
                  <span className="total-amount">${order.totalAmount.toFixed(2)}</span>
                </div>

                {!['completed', 'cancelled'].includes(order.status) && (
                  <div className="estimated-time">
                    <span className="time-icon">⏱️</span>
                    <span className="time-text">{getEstimatedTime(order.status)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="order-card-actions">
              <button
                className="view-details-btn"
                onClick={() => handleViewDetails(order.id)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
