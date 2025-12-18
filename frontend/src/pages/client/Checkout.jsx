import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getTotalPrice, clearCart, restaurantName } = useCart();
  const { axiosInstance, isAuthenticated, user } = useAuth();

  const [orderType, setOrderType] = useState('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryPhone, setDeliveryPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const totalPrice = getTotalPrice();

  // Redirect if not authenticated or not a client
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    if (user?.role !== 'client') {
      alert('Only clients can place orders.');
      navigate('/');
      return;
    }

    if (cart.length === 0) {
      navigate('/cart');
      return;
    }
  }, [isAuthenticated, user, cart, navigate]);

  const handleOrderTypeChange = (e) => {
    setOrderType(e.target.value);
    if (e.target.value === 'pickup') {
      setDeliveryAddress('');
      setDeliveryPhone('');
    }
  };

  const validateForm = () => {
    if (orderType === 'delivery') {
      if (!deliveryAddress.trim()) {
        setError('Delivery address is required for delivery orders');
        return false;
      }
      if (!deliveryPhone.trim()) {
        setError('Delivery phone is required for delivery orders');
        return false;
      }
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Prepare order data
      const orderData = {
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        orderType: orderType,
      };

      // Add delivery details if applicable
      if (orderType === 'delivery') {
        orderData.deliveryAddress = deliveryAddress;
        orderData.deliveryPhone = deliveryPhone;
      }

      // Create order
      const response = await axiosInstance.post('/orders', orderData);

      if (response.data.status === 'success') {
        // Clear cart
        clearCart();

        // Show success message
        alert('Order placed successfully! Order ID: ' + response.data.data.order.id);

        // Redirect to orders page
        navigate('/orders');
      } else {
        throw new Error(response.data.message || 'Failed to place order');
      }
    } catch (err) {
      console.error('Place order error:', err);
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to place order. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-content">
        <div className="checkout-form-section">
          <div className="checkout-section">
            <h2>Order Type</h2>
            <div className="order-type-options">
              <label className="order-type-option">
                <input
                  type="radio"
                  name="orderType"
                  value="pickup"
                  checked={orderType === 'pickup'}
                  onChange={handleOrderTypeChange}
                />
                <div className="order-type-content">
                  <strong>Pickup</strong>
                  <span>Pick up your order from the restaurant</span>
                </div>
              </label>

              <label className="order-type-option">
                <input
                  type="radio"
                  name="orderType"
                  value="delivery"
                  checked={orderType === 'delivery'}
                  onChange={handleOrderTypeChange}
                />
                <div className="order-type-content">
                  <strong>Delivery</strong>
                  <span>Get your order delivered to your address</span>
                </div>
              </label>
            </div>
          </div>

          {orderType === 'delivery' && (
            <div className="checkout-section">
              <h2>Delivery Details</h2>
              <div className="form-group">
                <label htmlFor="deliveryAddress">Delivery Address</label>
                <textarea
                  id="deliveryAddress"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter your full delivery address"
                  rows="3"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="deliveryPhone">Phone Number</label>
                <input
                  type="tel"
                  id="deliveryPhone"
                  value={deliveryPhone}
                  onChange={(e) => setDeliveryPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>
          )}

          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}
        </div>

        <div className="checkout-summary">
          <h2>Order Summary</h2>

          <div className="summary-restaurant">
            <strong>Restaurant:</strong> {restaurantName}
          </div>

          <div className="summary-items">
            {cart.map((item) => (
              <div key={item.id} className="summary-item">
                <img
                  src={item.imageUrl || 'https://via.placeholder.com/60'}
                  alt={item.name}
                  className="summary-item-image"
                />
                <div className="summary-item-details">
                  <h4>{item.name}</h4>
                  <p>
                    ${item.price.toFixed(2)} x {item.quantity}
                  </p>
                </div>
                <div className="summary-item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="summary-divider"></div>

          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="summary-row summary-total">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="place-order-btn"
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>

          <button
            onClick={() => navigate('/cart')}
            className="back-to-cart-btn"
            disabled={loading}
          >
            Back to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
