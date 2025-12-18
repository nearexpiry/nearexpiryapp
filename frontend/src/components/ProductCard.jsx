import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, restaurantId, isInCart, getProductQuantity } = useCart();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const daysUntilExpiry = getDaysUntilExpiry(product.expiryDate);
  const expiryClass =
    daysUntilExpiry < 3
      ? 'expiry-urgent'
      : daysUntilExpiry < 7
      ? 'expiry-warning'
      : 'expiry-normal';

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent card click

    // Check if product is out of stock
    if (product.quantity === 0) {
      setNotificationMessage('Product is out of stock');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }

    // Check if already in cart and at max quantity
    const currentQuantity = getProductQuantity(product.id);
    if (currentQuantity >= product.quantity) {
      setNotificationMessage('Maximum quantity already in cart');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }

    const result = addToCart(product, 1);

    if (result.success) {
      setNotificationMessage('Added to cart!');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
    } else {
      setNotificationMessage(result.message);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="product-card-image">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} />
        ) : (
          <div className="product-card-image-placeholder">
            <span>No Image</span>
          </div>
        )}
      </div>
      <div className="product-card-content">
        <h3 className="product-card-name">{product.name}</h3>
        <p className="product-card-restaurant">{product.restaurantName}</p>
        <p className="product-card-category">{product.categoryName}</p>
        <div className="product-card-details">
          <span className="product-card-price">${parseFloat(product.price).toFixed(2)}</span>
          <span className={`product-card-expiry ${expiryClass}`}>
            {daysUntilExpiry === 0
              ? 'Expires today'
              : daysUntilExpiry === 1
              ? 'Expires tomorrow'
              : daysUntilExpiry < 0
              ? 'Expired'
              : `${daysUntilExpiry} days left`}
          </span>
        </div>
        <p className="product-card-date">Expires: {formatDate(product.expiryDate)}</p>

        <div className="product-card-footer">
          <span className="product-card-stock">
            {product.quantity > 0 ? `${product.quantity} available` : 'Out of stock'}
          </span>
          <button
            onClick={handleAddToCart}
            className={`product-card-add-btn ${
              product.quantity === 0 ||
              (restaurantId && product.restaurantId !== restaurantId)
                ? 'disabled'
                : ''
            }`}
            disabled={
              product.quantity === 0 ||
              (restaurantId && product.restaurantId !== restaurantId)
            }
          >
            {restaurantId && product.restaurantId !== restaurantId
              ? 'Different Restaurant'
              : product.quantity === 0
              ? 'Out of Stock'
              : isInCart(product.id)
              ? 'Add More'
              : 'Add to Cart'}
          </button>
        </div>

        {showNotification && (
          <div className="product-card-notification">
            {notificationMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
