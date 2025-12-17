import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './RestaurantDashboardLayout.css';

const RestaurantDashboardLayout = () => {
  const { axiosInstance, user } = useAuth();
  const navigate = useNavigate();
  const [restaurantData, setRestaurantData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    loadRestaurantData();
  }, []);

  const loadRestaurantData = async () => {
    try {
      const response = await axiosInstance.get('/restaurants/my-profile');
      setRestaurantData(response.data.data.restaurant);
    } catch (error) {
      // If 404, restaurant profile doesn't exist yet
      if (error.response?.status !== 404) {
        console.error('Failed to load restaurant data:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="restaurant-dashboard">
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Restaurant Dashboard</h2>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {sidebarOpen ? '«' : '»'}
          </button>
        </div>

        {!loading && restaurantData && (
          <div className="restaurant-info">
            <h3 className="restaurant-name">{restaurantData.name}</h3>
            <div className={`restaurant-status ${restaurantData.isOpen ? 'open' : 'closed'}`}>
              <span className="status-dot"></span>
              {restaurantData.isOpen ? 'Open' : 'Closed'}
            </div>
          </div>
        )}

        <nav className="sidebar-nav">
          <NavLink
            to="/restaurant/profile"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">👤</span>
            {sidebarOpen && <span className="nav-text">Profile</span>}
          </NavLink>

          <NavLink
            to="/restaurant/products"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">📦</span>
            {sidebarOpen && <span className="nav-text">Products</span>}
          </NavLink>

          <NavLink
            to="/restaurant/orders"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">📋</span>
            {sidebarOpen && <span className="nav-text">Orders</span>}
          </NavLink>

          <NavLink
            to="/restaurant/sales"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">💰</span>
            {sidebarOpen && <span className="nav-text">Sales</span>}
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <span className="user-icon">👨‍🍳</span>
            {sidebarOpen && (
              <div className="user-details">
                <div className="user-email">{user?.email}</div>
                <div className="user-role">{user?.role}</div>
              </div>
            )}
          </div>
        </div>
      </aside>

      <main className={`dashboard-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="content-wrapper">
          <Outlet context={{ restaurantData, refreshRestaurantData: loadRestaurantData }} />
        </div>
      </main>
    </div>
  );
};

export default RestaurantDashboardLayout;
