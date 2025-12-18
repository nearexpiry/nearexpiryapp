import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import './OrderDetails.css';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { axiosInstance, isAuthenticated, user } = useAuth();
  const { addToCart, clearCart, restaurantId } = useCart();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reordering, setReordering] = useState(false);

  // Redirect if not authenticated or not a client
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/orders/${id}` } });
      return;
    }

    if (user?.role !== 'client') {
      alert('Only clients can view order details.');
      navigate('/');
      return;
    }
  }, [isAuthenticated, user, navigate, id]);

  // Fetch order details
  const fetchOrderDetails = async () => {
    try {
      setError(null);
      const response = await axiosInstance.get('/orders/client/my-orders');

      if (response.data.status === 'success') {
        const foundOrder = response.data.data.orders.find((o) => o.id === id);
        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          setError('Order not found');
        }
      } else {
        throw new Error(response.data.message || 'Failed to fetch order');
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError(err.response?.data?.message || 'Failed to load order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === 'client') {
      fetchOrderDetails();
    }
  }, [id, isAuthenticated, user]);

  // Auto-refresh if order is active
  useEffect(() => {
    if (!order || ['completed', 'cancelled'].includes(order.status)) return;

    const interval = setInterval(() => {
      fetchOrderDetails();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [order]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusTimeline = (currentStatus) => {
    const statuses = [
      { key: 'pending', label: 'Order Placed', icon: '📝' },
      { key: 'preparing', label: 'Preparing', icon: '👨‍🍳' },
      { key: 'ready', label: 'Ready', icon: '✅' },
      { key: 'completed', label: 'Completed', icon: '🎉' },
    ];

    const statusOrder = ['pending', 'preparing', 'ready', 'completed'];
    const currentIndex = statusOrder.indexOf(currentStatus);

    if (currentStatus === 'cancelled') {
      return [
        { key: 'pending', label: 'Order Placed', icon: '📝', active: true, completed: true },
        { key: 'cancelled', label: 'Cancelled', icon: '❌', active: true, completed: true },
      ];
    }

    return statuses.map((status, index) => ({
      ...status,
      active: index <= currentIndex,
      completed: index < currentIndex,
    }));
  };

  const handleReorder = async () => {
    if (!order) return;

    // Check if cart has items from different restaurant
    if (restaurantId && restaurantId !== order.restaurantId) {
      const confirmClear = window.confirm(
        'Your cart contains items from a different restaurant. Clear cart and add these items?'
      );
      if (!confirmClear) return;
      clearCart();
    }

    setReordering(true);

    try {
      // Fetch current product details to get latest prices and availability
      const productsToAdd = [];
      for (const item of order.items) {
        try {
          const response = await axiosInstance.get(`/products/${item.productId}`);
          if (response.data.status === 'success') {
            const product = response.data.data.product;
            if (product.isActive && product.quantity > 0) {
              productsToAdd.push({
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                restaurantId: order.restaurantId,
                restaurantName: order.restaurantName,
                quantity: product.quantity,
              });
            }
          }
        } catch (err) {
          console.error(`Failed to fetch product ${item.productId}:`, err);
        }
      }

      if (productsToAdd.length === 0) {
        alert('None of the items from this order are currently available.');
        setReordering(false);
        return;
      }

      // Add all available products to cart
      let addedCount = 0;
      for (const product of productsToAdd) {
        const originalItem = order.items.find((i) => i.productId === product.id);
        const quantityToAdd = Math.min(originalItem.quantity, product.quantity);

        const result = addToCart(product, quantityToAdd);
        if (result.success) {
          addedCount++;
        }
      }

      if (addedCount > 0) {
        alert(`Added ${addedCount} item(s) to cart!`);
        navigate('/cart');
      } else {
        alert('Failed to add items to cart. Please try again.');
      }
    } catch (err) {
      console.error('Error reordering:', err);
      alert('Failed to reorder. Please try again.');
    } finally {
      setReordering(false);
    }
  };

  if (loading) {
    return (
      <div className="order-details-container">
        <div className="loading">Loading order details...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-details-container">
        <div className="error-message">
          <p>{error || 'Order not found'}</p>
          <button onClick={() => navigate('/orders')} className="back-btn">
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const timeline = getStatusTimeline(order.status);

  return (
    <div className="order-details-container">
      <div className="order-details-header">
        <button onClick={() => navigate('/orders')} className="back-button">
          ← Back to Orders
        </button>
        <h1>Order Details</h1>
      </div>

      <div className="order-details-content">
        {/* Order Summary Card */}
        <div className="details-card">
          <div className="card-header">
            <div className="order-id-section">
              <span className="label">Order ID</span>
              <span className="order-id">{order.id.substring(0, 8).toUpperCase()}</span>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          <div className="card-body">
            <div className="info-row">
              <span className="info-label">Order Date:</span>
              <span className="info-value">{formatDate(order.createdAt)}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Order Type:</span>
              <span className="info-value">
                {order.orderType === 'delivery' ? '🚚 Delivery' : '🏪 Pickup'}
              </span>
            </div>
            {order.orderType === 'delivery' && order.deliveryAddress && (
              <>
                <div className="info-row">
                  <span className="info-label">Delivery Address:</span>
                  <span className="info-value">{order.deliveryAddress}</span>
                </div>
                {order.deliveryPhone && (
                  <div className="info-row">
                    <span className="info-label">Phone:</span>
                    <span className="info-value">{order.deliveryPhone}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Status Timeline */}
        <div className="details-card">
          <h2 className="card-title">Order Status</h2>
          <div className="timeline">
            {timeline.map((status, index) => (
              <div
                key={status.key}
                className={`timeline-item ${status.active ? 'active' : ''} ${
                  status.completed ? 'completed' : ''
                }`}
              >
                <div className="timeline-marker">
                  <div className="timeline-icon">{status.icon}</div>
                  {index < timeline.length - 1 && (
                    <div
                      className={`timeline-line ${
                        status.completed ? 'completed' : ''
                      }`}
                    ></div>
                  )}
                </div>
                <div className="timeline-content">
                  <h3>{status.label}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Restaurant Information */}
        <div className="details-card">
          <h2 className="card-title">Restaurant Information</h2>
          <div className="card-body">
            <h3 className="restaurant-name">{order.restaurantName}</h3>
            <div className="info-row">
              <span className="info-label">Address:</span>
              <span className="info-value">{order.restaurantAddress}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Phone:</span>
              <span className="info-value">{order.restaurantPhone}</span>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="details-card">
          <h2 className="card-title">Order Items</h2>
          <div className="items-list">
            {order.items.map((item) => (
              <div key={item.id} className="item-row">
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
                <div className="item-info">
                  <span className="item-name">{item.productName}</span>
                  <span className="item-quantity">Quantity: {item.quantity}</span>
                  <span className="item-unit-price">
                    ${item.priceAtOrder.toFixed(2)} each
                  </span>
                </div>
                <div className="item-total">
                  ${(item.priceAtOrder * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="order-total-section">
            <div className="total-row">
              <span className="total-label">Total Amount:</span>
              <span className="total-value">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Reorder Button */}
        <div className="details-card">
          <button
            className="reorder-btn"
            onClick={handleReorder}
            disabled={reordering}
          >
            {reordering ? 'Adding to Cart...' : '🔄 Reorder'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
