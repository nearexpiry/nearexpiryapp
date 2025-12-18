import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import OrderCard from '../../components/OrderCard';
import './Orders.css';

const Orders = () => {
  const { axiosInstance } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const previousOrdersRef = useRef([]);

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'preparing', label: 'Preparing' },
    { key: 'ready', label: 'Ready' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  const fetchOrders = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError('');

      const response = await axiosInstance.get('/orders/restaurant/my-orders');
      const fetchedOrders = response.data.data.orders;

      // Check for new orders
      if (previousOrdersRef.current.length > 0) {
        const previousIds = new Set(previousOrdersRef.current.map(o => o.id));
        const newOrders = fetchedOrders.filter(o => !previousIds.has(o.id));

        if (newOrders.length > 0) {
          setNewOrdersCount(prev => prev + newOrders.length);

          // Show browser notification if permitted
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('New Order Received!', {
              body: `You have ${newOrders.length} new order(s)`,
              icon: '/logo192.png',
            });
          }
        }
      }

      previousOrdersRef.current = fetchedOrders;
      setOrders(fetchedOrders);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, [axiosInstance]);

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Initial fetch
    fetchOrders();

    // Set up auto-refresh every 30 seconds
    const intervalId = setInterval(() => {
      fetchOrders(false); // Don't show loading on auto-refresh
    }, 30000);

    return () => clearInterval(intervalId);
  }, [fetchOrders]);

  useEffect(() => {
    // Filter orders based on active tab
    if (activeTab === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === activeTab));
    }
  }, [orders, activeTab]);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    // Reset new orders count when switching to pending tab
    if (tabKey === 'pending') {
      setNewOrdersCount(0);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axiosInstance.patch(`/orders/${orderId}/status`, {
        status: newStatus,
      });

      // Refresh orders after status update
      await fetchOrders(false);
    } catch (err) {
      console.error('Failed to update order status:', err);
      alert('Failed to update order status. Please try again.');
      throw err;
    }
  };

  const getTabCount = (tabKey) => {
    if (tabKey === 'all') return orders.length;
    return orders.filter(order => order.status === tabKey).length;
  };

  if (loading) {
    return (
      <div className="orders-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>Orders Management</h1>
        <button className="btn-refresh" onClick={() => fetchOrders()}>
          <span className="refresh-icon">⟳</span>
          Refresh
        </button>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠</span>
          {error}
        </div>
      )}

      <div className="orders-tabs">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => handleTabChange(tab.key)}
          >
            {tab.label}
            <span className="tab-count">{getTabCount(tab.key)}</span>
            {tab.key === 'pending' && newOrdersCount > 0 && (
              <span className="new-badge">{newOrdersCount}</span>
            )}
          </button>
        ))}
      </div>

      <div className="orders-content">
        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No orders found</h3>
            <p>
              {activeTab === 'all'
                ? 'You have no orders yet.'
                : `No orders with status "${activeTab}".`}
            </p>
          </div>
        ) : (
          <div className="orders-grid">
            {filteredOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusUpdate={handleStatusUpdate}
              />
            ))}
          </div>
        )}
      </div>

      <div className="auto-refresh-indicator">
        <span className="indicator-dot"></span>
        Auto-refreshing every 30 seconds
      </div>
    </div>
  );
};

export default Orders;
