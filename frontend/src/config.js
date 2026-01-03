// API Configuration
// Provides a centralized API URL with fallback for different environments

export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
