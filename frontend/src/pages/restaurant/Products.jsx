import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Products.css';

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/products/my-products`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.status === 'success') {
        setProducts(data.data.products);
      } else {
        throw new Error(data.message || 'Failed to fetch products');
      }
    } catch (err) {
      console.error('Fetch products error:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/products/${productId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.status === 'success') {
        // Refresh products list
        fetchProducts();
        setDeleteConfirm(null);
      } else {
        throw new Error(data.message || 'Failed to delete product');
      }
    } catch (err) {
      console.error('Delete product error:', err);
      alert(err.message || 'Failed to delete product');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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

  const isExpiringSoon = (expiryDate) => {
    const daysUntilExpiry = getDaysUntilExpiry(expiryDate);
    return daysUntilExpiry >= 0 && daysUntilExpiry <= 3;
  };

  if (loading) {
    return (
      <div className="products-container">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-container">
        <div className="error-message">
          {error}
          <button onClick={fetchProducts} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="products-container">
      <div className="products-header">
        <h1>My Products</h1>
        <button
          onClick={() => navigate('/restaurant/products/new')}
          className="btn-add-product"
        >
          Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="no-products">
          <p>You haven't added any products yet.</p>
          <button
            onClick={() => navigate('/restaurant/products/new')}
            className="btn-add-first"
          >
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              {product.imageUrl && (
                <div className="product-image">
                  <img src={product.imageUrl} alt={product.name} />
                </div>
              )}
              <div className="product-details">
                <h3>{product.name}</h3>
                <p className="product-category">{product.categoryName}</p>
                {product.description && (
                  <p className="product-description">{product.description}</p>
                )}
                <div className="product-info">
                  <div className="info-item">
                    <span className="label">Price:</span>
                    <span className="value">${product.price.toFixed(2)}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Quantity:</span>
                    <span className="value">{product.quantity}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Expiry Date:</span>
                    <span className={`value ${isExpiringSoon(product.expiryDate) ? 'expiring-soon' : ''}`}>
                      {formatDate(product.expiryDate)}
                      {isExpiringSoon(product.expiryDate) && (
                        <span className="warning-badge">
                          Expires in {getDaysUntilExpiry(product.expiryDate)} day(s)
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Status:</span>
                    <span className={`status-badge ${product.isActive ? 'active' : 'inactive'}`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="product-actions">
                  <button
                    onClick={() => navigate(`/restaurant/products/edit/${product.id}`)}
                    className="btn-edit"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(product.id)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Delete Confirmation Modal */}
              {deleteConfirm === product.id && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <h3>Confirm Delete</h3>
                    <p>Are you sure you want to delete "{product.name}"?</p>
                    <div className="modal-actions">
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="btn-confirm-delete"
                      >
                        Yes, Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="btn-cancel"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
