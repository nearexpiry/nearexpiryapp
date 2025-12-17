import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/products/${id}`
      );

      const data = await response.json();

      if (data.status === 'success') {
        setProduct(data.data.product);
      } else {
        throw new Error(data.message || 'Failed to fetch product');
      }
    } catch (err) {
      console.error('Fetch product error:', err);
      setError(err.message || 'Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

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
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-detail-page">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={() => navigate('/browse')} className="back-btn">
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="error-container">
          <p className="error-message">Product not found</p>
          <button onClick={() => navigate('/browse')} className="back-btn">
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  const daysUntilExpiry = getDaysUntilExpiry(product.expiryDate);
  const expiryClass =
    daysUntilExpiry < 3
      ? 'expiry-urgent'
      : daysUntilExpiry < 7
      ? 'expiry-warning'
      : 'expiry-normal';

  return (
    <div className="product-detail-page">
      <button onClick={() => navigate(-1)} className="back-btn">
        ← Back
      </button>

      <div className="product-detail-container">
        <div className="product-detail-image">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} />
          ) : (
            <div className="product-detail-image-placeholder">
              <span>No Image Available</span>
            </div>
          )}
        </div>

        <div className="product-detail-info">
          <h1 className="product-detail-name">{product.name}</h1>

          <div className="product-detail-meta">
            <span className="product-detail-category">{product.categoryName}</span>
            <span className={`product-detail-expiry ${expiryClass}`}>
              {daysUntilExpiry === 0
                ? 'Expires Today'
                : daysUntilExpiry === 1
                ? 'Expires Tomorrow'
                : daysUntilExpiry < 0
                ? 'Expired'
                : `${daysUntilExpiry} Days Left`}
            </span>
          </div>

          <div className="product-detail-price">
            <span className="price-label">Price:</span>
            <span className="price-value">${parseFloat(product.price).toFixed(2)}</span>
          </div>

          <div className="product-detail-section">
            <h3>Description</h3>
            <p>{product.description || 'No description available'}</p>
          </div>

          <div className="product-detail-section">
            <h3>Product Details</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Quantity Available:</span>
                <span className="detail-value">{product.quantity}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Expiry Date:</span>
                <span className="detail-value">{formatDate(product.expiryDate)}</span>
              </div>
            </div>
          </div>

          <div className="product-detail-section">
            <h3>Restaurant Information</h3>
            <div className="restaurant-info-box">
              <h4>{product.restaurantName}</h4>
              <p className="restaurant-address">{product.restaurantAddress}</p>
              <p className="restaurant-phone">
                <strong>Phone:</strong> {product.restaurantPhone}
              </p>
            </div>
          </div>

          <div className="product-actions">
            <button className="contact-btn">Contact Restaurant</button>
            <button
              onClick={() => navigate('/browse')}
              className="browse-more-btn"
            >
              Browse More Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
