import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartIcon.css';

const CartIcon = () => {
  const { cart, getItemCount, getTotalPrice, removeFromCart } = useCart();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const itemCount = getItemCount();
  const totalPrice = getTotalPrice();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleViewCart = () => {
    setShowDropdown(false);
    navigate('/cart');
  };

  return (
    <div className="cart-icon-wrapper" ref={dropdownRef}>
      <button
        className="cart-icon-button"
        onClick={() => setShowDropdown(!showDropdown)}
        aria-label="Shopping cart"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
      </button>

      {showDropdown && (
        <div className="cart-dropdown">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <p>Your cart is empty</p>
              <Link to="/browse" className="cart-browse-link" onClick={() => setShowDropdown(false)}>
                Browse Products
              </Link>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((item) => (
                  <div key={item.id} className="cart-dropdown-item">
                    <img
                      src={item.imageUrl || 'https://via.placeholder.com/50'}
                      alt={item.name}
                      className="cart-item-image"
                    />
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <p>
                        ${item.price.toFixed(2)} x {item.quantity}
                      </p>
                    </div>
                    <button
                      className="cart-item-remove"
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Remove item"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
              <div className="cart-dropdown-footer">
                <div className="cart-total">
                  <span>Total:</span>
                  <span className="cart-total-price">${totalPrice.toFixed(2)}</span>
                </div>
                <button className="cart-view-button" onClick={handleViewCart}>
                  View Cart
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CartIcon;
