import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">Welcome to Near Expiry</h1>

        {isAuthenticated ? (
          <div className="home-authenticated">
            <p className="home-greeting">Hello, {user?.email}!</p>
            <p className="home-role-badge">Role: {user?.role}</p>

            <div className="home-info">
              {user?.role === 'client' && (
                <>
                  <h2>Client Dashboard</h2>
                  <p>
                    Browse and purchase near-expiry products from local
                    restaurants at discounted prices.
                  </p>
                  <ul>
                    <li>Discover great deals on quality food</li>
                    <li>Help reduce food waste</li>
                    <li>Save money on your purchases</li>
                  </ul>
                </>
              )}

              {user?.role === 'restaurant' && (
                <>
                  <h2>Restaurant Dashboard</h2>
                  <p>
                    List and sell your near-expiry products to reduce waste and
                    recover costs.
                  </p>
                  <ul>
                    <li>Add your products with expiry dates</li>
                    <li>Set discounted prices</li>
                    <li>Manage orders and inventory</li>
                  </ul>
                </>
              )}

              {user?.role === 'admin' && (
                <>
                  <h2>Admin Dashboard</h2>
                  <p>Manage the Near Expiry platform.</p>
                  <ul>
                    <li>Monitor all restaurants and clients</li>
                    <li>Manage system settings</li>
                    <li>View analytics and reports</li>
                  </ul>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="home-guest">
            <p className="home-description">
              Discover fresh food at discounted prices from local restaurants.
              Help reduce food waste while saving money!
            </p>

            <div className="home-features">
              <div className="feature-card">
                <h3>For Clients</h3>
                <p>Find great deals on quality food near its expiry date</p>
              </div>

              <div className="feature-card">
                <h3>For Restaurants</h3>
                <p>Reduce food waste and recover costs on near-expiry items</p>
              </div>
            </div>

            <p className="home-cta">Login or register to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
