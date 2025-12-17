const { query, getClient } = require('../db/db');
const { geocodeAddress } = require('../utils/geocoding');

/**
 * Create or update restaurant profile
 * POST /api/restaurants/profile
 * @access Protected - Restaurant role only
 */
const createOrUpdateProfile = async (req, res) => {
  const client = await getClient();

  try {
    const userId = req.user.userId;
    const { name, description, address, phone } = req.body;

    // Validation
    if (!name || !address || !phone) {
      return res.status(400).json({
        status: 'error',
        message: 'Name, address, and phone are required',
      });
    }

    // Validate phone format (basic validation)
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid phone number format',
      });
    }

    // Geocode the address to get coordinates
    console.log(`Geocoding address: ${address}`);
    const coordinates = await geocodeAddress(address);

    if (!coordinates) {
      return res.status(400).json({
        status: 'error',
        message: 'Could not geocode the provided address. Please provide a valid address.',
      });
    }

    const { latitude, longitude } = coordinates;

    // Begin transaction
    await client.query('BEGIN');

    // Check if restaurant profile already exists for this user
    const existingRestaurant = await client.query(
      'SELECT id FROM restaurants WHERE user_id = $1',
      [userId]
    );

    let restaurant;

    if (existingRestaurant.rows.length > 0) {
      // Update existing restaurant
      const result = await client.query(
        `UPDATE restaurants
         SET name = $1, description = $2, address = $3, latitude = $4, longitude = $5, phone = $6
         WHERE user_id = $7
         RETURNING id, user_id, name, description, address, latitude, longitude, phone, logo_url, is_open, created_at, updated_at`,
        [name, description || null, address, latitude, longitude, phone, userId]
      );
      restaurant = result.rows[0];
    } else {
      // Create new restaurant
      const result = await client.query(
        `INSERT INTO restaurants (user_id, name, description, address, latitude, longitude, phone)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, user_id, name, description, address, latitude, longitude, phone, logo_url, is_open, created_at, updated_at`,
        [userId, name, description || null, address, latitude, longitude, phone]
      );
      restaurant = result.rows[0];
    }

    // Commit transaction
    await client.query('COMMIT');

    res.status(200).json({
      status: 'success',
      message: existingRestaurant.rows.length > 0
        ? 'Restaurant profile updated successfully'
        : 'Restaurant profile created successfully',
      data: {
        restaurant: {
          id: restaurant.id,
          userId: restaurant.user_id,
          name: restaurant.name,
          description: restaurant.description,
          address: restaurant.address,
          latitude: parseFloat(restaurant.latitude),
          longitude: parseFloat(restaurant.longitude),
          phone: restaurant.phone,
          logoUrl: restaurant.logo_url,
          isOpen: restaurant.is_open,
          createdAt: restaurant.created_at,
          updatedAt: restaurant.updated_at,
        },
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create/update restaurant profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to save restaurant profile. Please try again.',
    });
  } finally {
    client.release();
  }
};

/**
 * Get authenticated restaurant's profile
 * GET /api/restaurants/my-profile
 * @access Protected - Restaurant role only
 */
const getMyRestaurant = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get restaurant by user_id
    const result = await query(
      `SELECT id, user_id, name, description, address, latitude, longitude, phone, logo_url, is_open, created_at, updated_at
       FROM restaurants
       WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Restaurant profile not found. Please create your profile first.',
      });
    }

    const restaurant = result.rows[0];

    res.status(200).json({
      status: 'success',
      data: {
        restaurant: {
          id: restaurant.id,
          userId: restaurant.user_id,
          name: restaurant.name,
          description: restaurant.description,
          address: restaurant.address,
          latitude: restaurant.latitude ? parseFloat(restaurant.latitude) : null,
          longitude: restaurant.longitude ? parseFloat(restaurant.longitude) : null,
          phone: restaurant.phone,
          logoUrl: restaurant.logo_url,
          isOpen: restaurant.is_open,
          createdAt: restaurant.created_at,
          updatedAt: restaurant.updated_at,
        },
      },
    });
  } catch (error) {
    console.error('Get my restaurant error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get restaurant profile.',
    });
  }
};

/**
 * Toggle restaurant open/closed status
 * PATCH /api/restaurants/toggle-open
 * @access Protected - Restaurant role only
 */
const toggleOpenStatus = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get current restaurant status
    const restaurant = await query(
      'SELECT id, is_open FROM restaurants WHERE user_id = $1',
      [userId]
    );

    if (restaurant.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Restaurant profile not found. Please create your profile first.',
      });
    }

    const currentStatus = restaurant.rows[0].is_open;
    const newStatus = !currentStatus;

    // Toggle the status
    const result = await query(
      `UPDATE restaurants
       SET is_open = $1
       WHERE user_id = $2
       RETURNING id, user_id, name, description, address, latitude, longitude, phone, logo_url, is_open, created_at, updated_at`,
      [newStatus, userId]
    );

    const updatedRestaurant = result.rows[0];

    res.status(200).json({
      status: 'success',
      message: `Restaurant is now ${newStatus ? 'open' : 'closed'}`,
      data: {
        restaurant: {
          id: updatedRestaurant.id,
          userId: updatedRestaurant.user_id,
          name: updatedRestaurant.name,
          description: updatedRestaurant.description,
          address: updatedRestaurant.address,
          latitude: updatedRestaurant.latitude ? parseFloat(updatedRestaurant.latitude) : null,
          longitude: updatedRestaurant.longitude ? parseFloat(updatedRestaurant.longitude) : null,
          phone: updatedRestaurant.phone,
          logoUrl: updatedRestaurant.logo_url,
          isOpen: updatedRestaurant.is_open,
          createdAt: updatedRestaurant.created_at,
          updatedAt: updatedRestaurant.updated_at,
        },
      },
    });
  } catch (error) {
    console.error('Toggle open status error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to toggle restaurant status.',
    });
  }
};

/**
 * Get restaurant by ID (public endpoint)
 * GET /api/restaurants/:id
 * @access Public
 */
const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid restaurant ID format',
      });
    }

    // Get restaurant by ID
    const result = await query(
      `SELECT id, name, description, address, latitude, longitude, phone, logo_url, is_open, created_at
       FROM restaurants
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Restaurant not found',
      });
    }

    const restaurant = result.rows[0];

    res.status(200).json({
      status: 'success',
      data: {
        restaurant: {
          id: restaurant.id,
          name: restaurant.name,
          description: restaurant.description,
          address: restaurant.address,
          latitude: restaurant.latitude ? parseFloat(restaurant.latitude) : null,
          longitude: restaurant.longitude ? parseFloat(restaurant.longitude) : null,
          phone: restaurant.phone,
          logoUrl: restaurant.logo_url,
          isOpen: restaurant.is_open,
          createdAt: restaurant.created_at,
        },
      },
    });
  } catch (error) {
    console.error('Get restaurant by ID error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get restaurant details.',
    });
  }
};

module.exports = {
  createOrUpdateProfile,
  getMyRestaurant,
  toggleOpenStatus,
  getRestaurantById,
};
