import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const AuthContext = createContext(null);

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Axios request interceptor to add token to all requests
  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Axios response interceptor to handle 401 errors
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          // Token expired or invalid - logout user
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // Load user from token on mount
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const response = await axiosInstance.get('/auth/me');
          setUser(response.data.data.user);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to load user:', error);
          localStorage.removeItem('token');
          setToken(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Register function
  const register = async (email, password, role) => {
    try {
      const response = await axiosInstance.post('/auth/register', {
        email,
        password,
        role,
      });

      // New flow: registration requires email verification
      if (response.data.data?.requiresVerification) {
        return {
          success: true,
          requiresVerification: true,
          email: response.data.data.email,
          data: response.data,
        };
      }

      // Fallback for old behavior (shouldn't happen with new backend)
      const { token, user } = response.data.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, error: errorMessage };
    }
  };

  // Verify email with OTP (does not auto-login, user must login after verification)
  const verifyEmail = async (email, otpCode) => {
    try {
      const response = await axiosInstance.post('/auth/verify-email', {
        email,
        otpCode,
      });

      // Don't auto-login - just return success
      // User will be redirected to login page
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Verification failed. Please try again.';
      return { success: false, error: errorMessage };
    }
  };

  // Resend verification OTP
  const resendVerificationOTP = async (email) => {
    try {
      const response = await axiosInstance.post('/auth/resend-verification', {
        email,
      });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to resend code. Please try again.';
      return { success: false, error: errorMessage };
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password,
      });

      const { token, user } = response.data.data;

      // Store token
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);

      return { success: true, data: response.data };
    } catch (error) {
      // Check if email verification is required (check data flag, not just status code)
      if (error.response?.data?.data?.requiresVerification) {
        return {
          success: false,
          requiresVerification: true,
          email: error.response.data.data.email,
          error: error.response.data.message,
        };
      }

      const errorMessage =
        error.response?.data?.message || 'Login failed. Please try again.';
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Forgot password function
  const forgotPassword = async (email) => {
    try {
      const response = await axiosInstance.post('/auth/forgot-password', {
        email,
      });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        'Failed to send reset email. Please try again.';
      return { success: false, error: errorMessage };
    }
  };

  // Reset password function
  const resetPassword = async (token, newPassword) => {
    try {
      const response = await axiosInstance.post('/auth/reset-password', {
        token,
        newPassword,
      });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        'Failed to reset password. Please try again.';
      return { success: false, error: errorMessage };
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      const response = await axiosInstance.get('/auth/me');
      setUser(response.data.data.user);
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to refresh user data.';
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    register,
    verifyEmail,
    resendVerificationOTP,
    login,
    logout,
    forgotPassword,
    resetPassword,
    refreshUser,
    axiosInstance, // Export axios instance for other components to use
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
