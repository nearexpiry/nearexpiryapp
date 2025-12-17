import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

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
      </div>
    </div>
  );
};

export default ProductCard;
