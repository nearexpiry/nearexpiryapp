import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_URL } from '../../config';
import ImageUpload from '../../components/ImageUpload';
import CategoryDropdown from '../../components/CategoryDropdown';
import './ProductForm.css';

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    price: '',
    quantity: '',
    expiry_date: '',
    image_url: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      fetchProduct();
    }
  }, [id, isEditMode]);

  const fetchProduct = async () => {
    try {
      setFetchLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(
        `${API_URL}/products/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.status === 'success') {
        const product = data.data.product;
        // Format date for input field (YYYY-MM-DD)
        const expiryDate = new Date(product.expiryDate).toISOString().split('T')[0];

        setFormData({
          name: product.name,
          description: product.description || '',
          category_id: product.categoryId,
          price: product.price.toString(),
          quantity: product.quantity.toString(),
          expiry_date: expiryDate,
          image_url: product.imageUrl || '',
        });
      } else {
        throw new Error(data.message || 'Failed to fetch product');
      }
    } catch (err) {
      console.error('Fetch product error:', err);
      alert(err.message || 'Failed to load product');
      navigate('/restaurant/products');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleCategoryChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      category_id: value,
    }));
    if (errors.category_id) {
      setErrors((prev) => ({
        ...prev,
        category_id: '',
      }));
    }
  };

  const handleImageUpload = (imageUrl) => {
    setFormData((prev) => ({
      ...prev,
      image_url: imageUrl,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.category_id) {
      newErrors.category_id = 'Please select a category';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) < 0) {
      newErrors.price = 'Price must be a positive number';
    }

    if (!formData.quantity) {
      newErrors.quantity = 'Quantity is required';
    } else if (isNaN(formData.quantity) || parseInt(formData.quantity) < 0 || !Number.isInteger(parseFloat(formData.quantity))) {
      newErrors.quantity = 'Quantity must be a non-negative integer';
    }

    if (!formData.expiry_date) {
      newErrors.expiry_date = 'Expiry date is required';
    } else {
      const expiryDate = new Date(formData.expiry_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (expiryDate < today) {
        newErrors.expiry_date = 'Expiry date must be today or a future date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Authentication required');
      }

      const url = isEditMode
        ? `${API_URL}/products/${id}`
        : `${API_URL}/products`;

      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          category_id: formData.category_id,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity),
          expiry_date: formData.expiry_date,
          image_url: formData.image_url || null,
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        navigate('/restaurant/products');
      } else {
        throw new Error(data.message || `Failed to ${isEditMode ? 'update' : 'create'} product`);
      }
    } catch (err) {
      console.error('Submit product error:', err);
      setSubmitError(err.message || `Failed to ${isEditMode ? 'update' : 'create'} product`);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="product-form-container">
        <div className="loading">Loading product...</div>
      </div>
    );
  }

  return (
    <div className="product-form-container">
      <div className="form-header">
        <h1>{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
        <button onClick={() => navigate('/restaurant/products')} className="btn-back">
          Back to Products
        </button>
      </div>

      <form onSubmit={handleSubmit} className="product-form">
        {submitError && (
          <div className="submit-error">
            {submitError}
          </div>
        )}

        {/* Product Image */}
        <ImageUpload
          onUploadSuccess={handleImageUpload}
          currentImageUrl={formData.image_url}
          uploadType="product-image"
          label="Product Image"
        />

        {/* Product Name */}
        <div className="form-group">
          <label htmlFor="name">Product Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
            placeholder="Enter product name"
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Enter product description (optional)"
          />
        </div>

        {/* Category */}
        <CategoryDropdown
          value={formData.category_id}
          onChange={handleCategoryChange}
          error={errors.category_id}
        />

        {/* Price and Quantity */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Price ($) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={errors.price ? 'error' : ''}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
            {errors.price && <span className="error-message">{errors.price}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Quantity *</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className={errors.quantity ? 'error' : ''}
              placeholder="0"
              min="0"
              step="1"
            />
            {errors.quantity && <span className="error-message">{errors.quantity}</span>}
          </div>
        </div>

        {/* Expiry Date */}
        <div className="form-group">
          <label htmlFor="expiry_date">Expiry Date *</label>
          <input
            type="date"
            id="expiry_date"
            name="expiry_date"
            value={formData.expiry_date}
            onChange={handleChange}
            className={errors.expiry_date ? 'error' : ''}
            min={new Date().toISOString().split('T')[0]}
          />
          {errors.expiry_date && <span className="error-message">{errors.expiry_date}</span>}
        </div>

        {/* Submit Buttons */}
        <div className="form-actions">
          <button
            type="submit"
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Saving...' : (isEditMode ? 'Update Product' : 'Create Product')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/restaurant/products')}
            className="btn-cancel"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
