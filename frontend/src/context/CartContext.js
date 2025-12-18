import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);
  const [restaurantName, setRestaurantName] = useState(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedRestaurantId = localStorage.getItem('cartRestaurantId');
    const savedRestaurantName = localStorage.getItem('cartRestaurantName');

    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
        localStorage.removeItem('cart');
      }
    }

    if (savedRestaurantId) {
      setRestaurantId(savedRestaurantId);
    }

    if (savedRestaurantName) {
      setRestaurantName(savedRestaurantName);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('cart');
      localStorage.removeItem('cartRestaurantId');
      localStorage.removeItem('cartRestaurantName');
      setRestaurantId(null);
      setRestaurantName(null);
    }
  }, [cart]);

  // Save restaurant info to localStorage
  useEffect(() => {
    if (restaurantId) {
      localStorage.setItem('cartRestaurantId', restaurantId);
    }
    if (restaurantName) {
      localStorage.setItem('cartRestaurantName', restaurantName);
    }
  }, [restaurantId, restaurantName]);

  /**
   * Add product to cart
   * @param {Object} product - Product object with id, name, price, imageUrl, restaurantId, restaurantName, quantity
   * @param {number} quantity - Quantity to add
   * @returns {Object} - { success: boolean, message?: string }
   */
  const addToCart = (product, quantity = 1) => {
    // Validate all items are from same restaurant
    if (restaurantId && product.restaurantId !== restaurantId) {
      return {
        success: false,
        message: `You can only add items from ${restaurantName}. Please clear your cart to add items from a different restaurant.`,
      };
    }

    // Check if product is already in cart
    const existingItemIndex = cart.findIndex(item => item.id === product.id);

    if (existingItemIndex > -1) {
      // Update quantity of existing item
      const newCart = [...cart];
      newCart[existingItemIndex].quantity += quantity;
      setCart(newCart);
    } else {
      // Add new item to cart
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity: quantity,
          restaurantId: product.restaurantId,
          restaurantName: product.restaurantName,
          availableQuantity: product.quantity,
        },
      ]);

      // Set restaurant info if this is the first item
      if (!restaurantId) {
        setRestaurantId(product.restaurantId);
        setRestaurantName(product.restaurantName);
      }
    }

    return { success: true };
  };

  /**
   * Remove product from cart
   * @param {string} productId - Product ID
   */
  const removeFromCart = (productId) => {
    const newCart = cart.filter(item => item.id !== productId);
    setCart(newCart);
  };

  /**
   * Update quantity of product in cart
   * @param {string} productId - Product ID
   * @param {number} quantity - New quantity
   */
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const newCart = cart.map(item => {
      if (item.id === productId) {
        return { ...item, quantity };
      }
      return item;
    });
    setCart(newCart);
  };

  /**
   * Clear entire cart
   */
  const clearCart = () => {
    setCart([]);
    setRestaurantId(null);
    setRestaurantName(null);
    localStorage.removeItem('cart');
    localStorage.removeItem('cartRestaurantId');
    localStorage.removeItem('cartRestaurantName');
  };

  /**
   * Get total items count in cart
   */
  const getItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  /**
   * Get total price of cart
   */
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  /**
   * Check if product is in cart
   */
  const isInCart = (productId) => {
    return cart.some(item => item.id === productId);
  };

  /**
   * Get quantity of product in cart
   */
  const getProductQuantity = (productId) => {
    const item = cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    cart,
    restaurantId,
    restaurantName,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemCount,
    getTotalPrice,
    isInCart,
    getProductQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
