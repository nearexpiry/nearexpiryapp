const { query } = require('../db/db');

/**
 * Get all categories
 * GET /api/categories
 * @access Public
 */
const getAllCategories = async (req, res) => {
  try {
    const result = await query(
      'SELECT id, name, created_at FROM categories ORDER BY name ASC'
    );

    const categories = result.rows.map(category => ({
      id: category.id,
      name: category.name,
      createdAt: category.created_at,
    }));

    res.status(200).json({
      status: 'success',
      data: {
        categories,
      },
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get categories.',
    });
  }
};

module.exports = {
  getAllCategories,
};
