import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import './CategoryDropdown.css';

const CategoryDropdown = ({ value, onChange, error }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setFetchError(null);

      const response = await fetch(`${API_URL}/categories`);
      const data = await response.json();

      if (data.status === 'success') {
        setCategories(data.data.categories);
      } else {
        throw new Error(data.message || 'Failed to fetch categories');
      }
    } catch (err) {
      console.error('Fetch categories error:', err);
      setFetchError(err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="category-dropdown">
        <label className="category-label">Category *</label>
        <select className="category-select" disabled>
          <option>Loading categories...</option>
        </select>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="category-dropdown">
        <label className="category-label">Category *</label>
        <div className="category-error">
          {fetchError}
          <button onClick={fetchCategories} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="category-dropdown">
      <label className="category-label">Category *</label>
      <select
        className={`category-select ${error ? 'error' : ''}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select a category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default CategoryDropdown;
