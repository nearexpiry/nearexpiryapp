const { query } = require('../db/db');

/**
 * Get all users with pagination and filters
 * GET /api/admin/users
 * @access Protected - Admin role only
 */
const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      role,
      is_active,
      search,
    } = req.query;

    const offset = (page - 1) * limit;
    let queryStr = `
      SELECT
        u.id,
        u.email,
        u.role,
        u.is_active,
        u.created_at,
        u.updated_at,
        r.id as restaurant_id,
        r.name as restaurant_name,
        r.phone as restaurant_phone,
        r.address as restaurant_address,
        r.is_open as restaurant_is_open
      FROM users u
      LEFT JOIN restaurants r ON u.id = r.user_id
      WHERE 1=1
    `;

    const queryParams = [];
    let paramCounter = 1;

    // Filter by role
    if (role && ['client', 'restaurant', 'admin'].includes(role)) {
      queryStr += ` AND u.role = $${paramCounter}`;
      queryParams.push(role);
      paramCounter++;
    }

    // Filter by active status
    if (is_active !== undefined && is_active !== '') {
      queryStr += ` AND u.is_active = $${paramCounter}`;
      queryParams.push(is_active === 'true');
      paramCounter++;
    }

    // Search by email
    if (search) {
      queryStr += ` AND u.email ILIKE $${paramCounter}`;
      queryParams.push(`%${search}%`);
      paramCounter++;
    }

    // Get total count for pagination
    const countResult = await query(
      `SELECT COUNT(*) FROM (${queryStr}) as filtered_users`,
      queryParams
    );
    const totalUsers = parseInt(countResult.rows[0].count);

    // Add ordering and pagination
    queryStr += ` ORDER BY u.created_at DESC LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`;
    queryParams.push(limit, offset);

    // Execute main query
    const result = await query(queryStr, queryParams);

    // Format the response
    const users = result.rows.map((user) => ({
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.is_active,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      restaurant: user.restaurant_id
        ? {
            id: user.restaurant_id,
            name: user.restaurant_name,
            phone: user.restaurant_phone,
            address: user.restaurant_address,
            isOpen: user.restaurant_is_open,
          }
        : null,
    }));

    res.status(200).json({
      status: 'success',
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalUsers / limit),
          totalUsers,
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve users.',
    });
  }
};

/**
 * Toggle user active status (activate/deactivate)
 * PATCH /api/admin/users/:id/toggle-status
 * @access Protected - Admin role only
 */
const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const adminUserId = req.user.userId;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid user ID format',
      });
    }

    // Prevent admin from deactivating themselves
    if (id === adminUserId) {
      return res.status(400).json({
        status: 'error',
        message: 'You cannot deactivate your own account',
      });
    }

    // Get current user
    const userResult = await query(
      'SELECT id, email, role, is_active FROM users WHERE id = $1',
      [id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    const user = userResult.rows[0];

    // Prevent deactivating other admin accounts
    if (user.role === 'admin' && user.id !== adminUserId) {
      return res.status(403).json({
        status: 'error',
        message: 'You cannot deactivate other admin accounts',
      });
    }

    // Toggle the status
    const newStatus = !user.is_active;
    const updateResult = await query(
      'UPDATE users SET is_active = $1 WHERE id = $2 RETURNING id, email, role, is_active, created_at, updated_at',
      [newStatus, id]
    );

    const updatedUser = updateResult.rows[0];

    res.status(200).json({
      status: 'success',
      message: `User ${newStatus ? 'activated' : 'deactivated'} successfully`,
      data: {
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          role: updatedUser.role,
          isActive: updatedUser.is_active,
          createdAt: updatedUser.created_at,
          updatedAt: updatedUser.updated_at,
        },
      },
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to toggle user status.',
    });
  }
};

/**
 * Get system statistics
 * GET /api/admin/stats
 * @access Protected - Admin role only
 */
const getSystemStats = async (req, res) => {
  try {
    // Get user counts by role
    const userStatsResult = await query(`
      SELECT
        role,
        COUNT(*) as count,
        COUNT(*) FILTER (WHERE is_active = true) as active_count
      FROM users
      GROUP BY role
    `);

    // Get restaurant count
    const restaurantStatsResult = await query(`
      SELECT
        COUNT(*) as total_restaurants,
        COUNT(*) FILTER (WHERE is_open = true) as open_restaurants
      FROM restaurants
    `);

    // Get order statistics
    const orderStatsResult = await query(`
      SELECT
        COUNT(*) as total_orders,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_orders,
        COUNT(*) FILTER (WHERE status = 'preparing') as preparing_orders,
        COUNT(*) FILTER (WHERE status = 'ready') as ready_orders,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_orders,
        COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_orders,
        COALESCE(SUM(total_amount), 0) as total_revenue,
        COALESCE(SUM(commission_amount), 0) as total_commission
      FROM orders
    `);

    // Format user stats
    const userStats = {
      total: 0,
      byRole: {},
    };

    userStatsResult.rows.forEach((row) => {
      const count = parseInt(row.count);
      const activeCount = parseInt(row.active_count);
      userStats.total += count;
      userStats.byRole[row.role] = {
        total: count,
        active: activeCount,
        inactive: count - activeCount,
      };
    });

    const restaurantStats = restaurantStatsResult.rows[0];
    const orderStats = orderStatsResult.rows[0];

    res.status(200).json({
      status: 'success',
      data: {
        users: userStats,
        restaurants: {
          total: parseInt(restaurantStats.total_restaurants),
          open: parseInt(restaurantStats.open_restaurants),
          closed: parseInt(restaurantStats.total_restaurants) - parseInt(restaurantStats.open_restaurants),
        },
        orders: {
          total: parseInt(orderStats.total_orders),
          byStatus: {
            pending: parseInt(orderStats.pending_orders),
            preparing: parseInt(orderStats.preparing_orders),
            ready: parseInt(orderStats.ready_orders),
            completed: parseInt(orderStats.completed_orders),
            cancelled: parseInt(orderStats.cancelled_orders),
          },
        },
        revenue: {
          total: parseFloat(orderStats.total_revenue),
          commission: parseFloat(orderStats.total_commission),
        },
      },
    });
  } catch (error) {
    console.error('Get system stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve system statistics.',
    });
  }
};

/**
 * Get current commission percentage
 * GET /api/admin/commission
 * @access Protected - Admin role only
 */
const getCommission = async (req, res) => {
  try {
    const result = await query(
      "SELECT value FROM settings WHERE key = 'commission_percentage'",
      []
    );

    if (result.rows.length === 0) {
      // If not found, return default value of 10%
      return res.status(200).json({
        status: 'success',
        data: {
          commissionPercentage: 10,
        },
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        commissionPercentage: parseFloat(result.rows[0].value),
      },
    });
  } catch (error) {
    console.error('Get commission error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve commission percentage.',
    });
  }
};

/**
 * Update commission percentage
 * PUT /api/admin/commission
 * @access Protected - Admin role only
 */
const updateCommission = async (req, res) => {
  try {
    const { commissionPercentage } = req.body;

    // Validation
    if (commissionPercentage === undefined || commissionPercentage === null) {
      return res.status(400).json({
        status: 'error',
        message: 'Commission percentage is required',
      });
    }

    const commission = parseFloat(commissionPercentage);

    // Validate range (0-100)
    if (isNaN(commission) || commission < 0 || commission > 100) {
      return res.status(400).json({
        status: 'error',
        message: 'Commission percentage must be a number between 0 and 100',
      });
    }

    // Update or insert the commission percentage
    await query(
      `INSERT INTO settings (key, value)
       VALUES ('commission_percentage', $1)
       ON CONFLICT (key)
       DO UPDATE SET value = $1, updated_at = CURRENT_TIMESTAMP`,
      [commission.toString()]
    );

    res.status(200).json({
      status: 'success',
      message: 'Commission percentage updated successfully',
      data: {
        commissionPercentage: commission,
      },
    });
  } catch (error) {
    console.error('Update commission error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update commission percentage.',
    });
  }
};

module.exports = {
  getAllUsers,
  toggleUserStatus,
  getSystemStats,
  getCommission,
  updateCommission,
};
