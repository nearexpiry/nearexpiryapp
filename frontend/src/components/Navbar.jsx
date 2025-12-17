import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Near Expiry
        </Link>

        <div className="navbar-menu">
          {/* Public links visible to everyone */}
          <Link to="/browse" className="navbar-link">
            Browse Products
          </Link>
          <Link to="/restaurants" className="navbar-link">
            Restaurants
          </Link>

          {isAuthenticated ? (
            <>
              {user?.role === 'restaurant' && (
                <Link to="/restaurant/profile" className="navbar-link">
                  Dashboard
                </Link>
              )}
              <span className="navbar-user">
                {user?.email}
                <span className="navbar-role">({user?.role})</span>
              </span>
              <button onClick={handleLogout} className="navbar-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="navbar-button">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
