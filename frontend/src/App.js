import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import RestaurantDashboardLayout from './components/RestaurantDashboardLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import RestaurantProfile from './pages/restaurant/RestaurantProfile';
import Products from './pages/restaurant/Products';
import ProductForm from './pages/restaurant/ProductForm';
import Orders from './pages/restaurant/Orders';
import Sales from './pages/restaurant/Sales';
import BrowseProducts from './pages/client/BrowseProducts';
import RestaurantsMap from './pages/client/RestaurantsMap';
import ProductDetail from './pages/client/ProductDetail';
import Cart from './pages/client/Cart';
import Checkout from './pages/client/Checkout';
import OrderHistory from './pages/client/OrderHistory';
import OrderDetails from './pages/client/OrderDetails';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="App">
            <Navbar />
            <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Client Public Routes */}
            <Route path="/browse" element={<BrowseProducts />} />
            <Route path="/restaurants" element={<RestaurantsMap />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/orders/:id" element={<OrderDetails />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            {/* Restaurant Routes - Protected, restaurant role only */}
            <Route
              path="/restaurant/*"
              element={
                <ProtectedRoute allowedRoles="restaurant">
                  <RestaurantDashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="profile" element={<RestaurantProfile />} />
              <Route path="products" element={<Products />} />
              <Route path="products/new" element={<ProductForm />} />
              <Route path="products/edit/:id" element={<ProductForm />} />
              <Route path="orders" element={<Orders />} />
              <Route path="sales" element={<Sales />} />
              {/* Add more restaurant routes here as needed */}
            </Route>
          </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
