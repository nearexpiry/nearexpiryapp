import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const {
    cart,
    restaurantName,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice,
  } = useCart();

  const totalPrice = getTotalPrice();

  const handleQuantityChange = (productId, newQuantity) => {
    const quantity = parseInt(newQuantity);
    if (quantity > 0) {
      updateQuantity(productId, quantity);
    }
  };

  const handleIncrement = (item) => {
    if (item.quantity < item.availableQuantity) {
      updateQuantity(item.id, item.quantity + 1);
    }
  };

  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleRemove = (productId) => {
    if (window.confirm('Are you sure you want to remove this item from your cart?')) {
      removeFromCart(productId);
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      clearCart();
    }
  };

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      // Redirect to login with return path
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    if (user?.role !== 'client') {
      alert('Only clients can place orders. Please login with a client account.');
      return;
    }

    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty-state">
          <div className="cart-empty-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
          <h2>Your cart is empty</h2>
          <p>Start adding some delicious near-expiry products to your cart!</p>
          <Link to="/browse" className="browse-btn">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <button onClick={handleClearCart} className="clear-cart-btn">
          Clear Cart
        </button>
      </div>

      {restaurantName && (
        <div className="cart-restaurant-info">
          <p>
            <strong>Restaurant:</strong> {restaurantName}
          </p>
          <span className="cart-info-text">
            All items in your cart are from this restaurant
          </span>
        </div>
      )}

      <div className="cart-content">
        <div className="cart-items-section">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <img
                src={item.imageUrl || 'https://via.placeholder.com/150'}
                alt={item.name}
                className="cart-item-image"
              />

              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p className="cart-item-restaurant">{item.restaurantName}</p>
                <p className="cart-item-price">${item.price.toFixed(2)} each</p>
                {item.quantity > item.availableQuantity && (
                  <p className="cart-item-warning">
                    Only {item.availableQuantity} available
                  </p>
                )}
              </div>

              <div className="cart-item-quantity">
                <button
                  onClick={() => handleDecrement(item)}
                  className="quantity-btn"
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                  min="1"
                  max={item.availableQuantity}
                  className="quantity-input"
                />
                <button
                  onClick={() => handleIncrement(item)}
                  className="quantity-btn"
                  disabled={item.quantity >= item.availableQuantity}
                >
                  +
                </button>
              </div>

              <div className="cart-item-total">
                <p className="item-total-label">Subtotal</p>
                <p className="item-total-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>

              <button
                onClick={() => handleRemove(item.id)}
                className="cart-item-remove-btn"
                aria-label="Remove item"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Items ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-row summary-total">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>

          <button onClick={handleProceedToCheckout} className="checkout-btn">
            Proceed to Checkout
          </button>

          <Link to="/browse" className="continue-shopping-link">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
