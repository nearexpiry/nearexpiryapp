const { query } = require('../db/db');

/**
 * Get all active restaurants with coordinates (public endpoint)
 * GET /api/client/restaurants
 * @access Public
 */
const getAllRestaurants = async (req, res) => {
  try {
    // Get all restaurants with their details
    const result = await query(
      `SELECT id, name, description, address, latitude, longitude, phone, logo_url, is_open
       FROM restaurants
       ORDER BY name ASC`
    );

    const restaurants = result.rows.map(restaurant => ({
      id: restaurant.id,
      name: restaurant.name,
      description: restaurant.description,
      address: restaurant.address,
      latitude: restaurant.latitude ? parseFloat(restaurant.latitude) : null,
      longitude: restaurant.longitude ? parseFloat(restaurant.longitude) : null,
      phone: restaurant.phone,
      logoUrl: restaurant.logo_url,
      isOpen: restaurant.is_open,
    }));

    res.status(200).json({
      status: 'success',
      data: {
        restaurants,
      },
    });
  } catch (error) {
    console.error('Get all restaurants error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get restaurants.',
    });
  }
};

module.exports = {
  getAllRestaurants,
};
