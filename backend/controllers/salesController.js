const { query } = require('../db/db');

/**
 * Get restaurant sales analytics
 * Query params: period ('today', 'week', 'month', 'all')
 */
const getRestaurantSales = async (req, res) => {
  try {
    const { userId, role } = req.user;
    const { period = 'today' } = req.query;

    // Verify restaurant exists and get restaurant_id
    const restaurantResult = await query(
      'SELECT id FROM restaurants WHERE user_id = $1',
      [userId]
    );

    if (restaurantResult.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Restaurant not found'
      });
    }

    const restaurantId = restaurantResult.rows[0].id;

    // Determine date filter based on period
    let dateFilter = '';
    let previousPeriodFilter = '';

    switch (period) {
      case 'today':
        dateFilter = "AND DATE(o.created_at) = CURRENT_DATE";
        previousPeriodFilter = "AND DATE(o.created_at) = CURRENT_DATE - INTERVAL '1 day'";
        break;
      case 'week':
        dateFilter = "AND o.created_at >= CURRENT_DATE - INTERVAL '7 days'";
        previousPeriodFilter = "AND o.created_at >= CURRENT_DATE - INTERVAL '14 days' AND o.created_at < CURRENT_DATE - INTERVAL '7 days'";
        break;
      case 'month':
        dateFilter = "AND o.created_at >= CURRENT_DATE - INTERVAL '30 days'";
        previousPeriodFilter = "AND o.created_at >= CURRENT_DATE - INTERVAL '60 days' AND o.created_at < CURRENT_DATE - INTERVAL '30 days'";
        break;
      case 'all':
        dateFilter = "";
        previousPeriodFilter = "";
        break;
      default:
        return res.status(400).json({
          status: 'error',
          message: 'Invalid period. Must be one of: today, week, month, all'
        });
    }

    // 1. Get overall sales summary for current period
    const summaryQuery = `
      SELECT
        COALESCE(SUM(o.total_amount), 0) as total_sales,
        COALESCE(SUM(o.commission_amount), 0) as total_commission,
        COUNT(o.id) as total_orders,
        COALESCE(SUM(oi.quantity), 0) as total_items_sold
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.restaurant_id = $1
        AND o.status = 'completed'
        ${dateFilter}
    `;

    const summaryResult = await query(summaryQuery, [restaurantId]);
    const summary = summaryResult.rows[0];

    // 2. Get previous period summary for comparison
    let previousSummary = null;
    let percentageChange = null;

    if (period !== 'all') {
      const previousSummaryQuery = `
        SELECT
          COALESCE(SUM(o.total_amount), 0) as total_sales
        FROM orders o
        WHERE o.restaurant_id = $1
          AND o.status = 'completed'
          ${previousPeriodFilter}
      `;

      const previousResult = await query(previousSummaryQuery, [restaurantId]);
      previousSummary = parseFloat(previousResult.rows[0].total_sales);

      const currentSales = parseFloat(summary.total_sales);
      if (previousSummary > 0) {
        percentageChange = ((currentSales - previousSummary) / previousSummary * 100).toFixed(2);
      } else if (currentSales > 0) {
        percentageChange = 100;
      } else {
        percentageChange = 0;
      }
    }

    // 3. Get top selling products
    const topProductsQuery = `
      SELECT
        p.id,
        p.name,
        p.category_id,
        SUM(oi.quantity) as quantity_sold,
        SUM(oi.quantity * oi.price_at_order) as revenue
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      JOIN products p ON oi.product_id = p.id
      WHERE o.restaurant_id = $1
        AND o.status = 'completed'
        ${dateFilter}
      GROUP BY p.id, p.name, p.category_id
      ORDER BY revenue DESC
      LIMIT 10
    `;

    const topProductsResult = await query(topProductsQuery, [restaurantId]);

    // 4. Get sales by category
    const categoryQuery = `
      SELECT
        c.id,
        c.name as category_name,
        COUNT(DISTINCT o.id) as order_count,
        SUM(oi.quantity) as items_sold,
        SUM(oi.quantity * oi.price_at_order) as revenue
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      JOIN products p ON oi.product_id = p.id
      JOIN categories c ON p.category_id = c.id
      WHERE o.restaurant_id = $1
        AND o.status = 'completed'
        ${dateFilter}
      GROUP BY c.id, c.name
      ORDER BY revenue DESC
    `;

    const categoryResult = await query(categoryQuery, [restaurantId]);

    // 5. Get daily/weekly breakdown for charts
    let breakdownQuery = '';

    if (period === 'today') {
      // Hourly breakdown for today
      breakdownQuery = `
        SELECT
          EXTRACT(HOUR FROM o.created_at) as hour,
          COUNT(o.id) as order_count,
          SUM(o.total_amount) as sales,
          SUM(o.commission_amount) as commission
        FROM orders o
        WHERE o.restaurant_id = $1
          AND o.status = 'completed'
          AND DATE(o.created_at) = CURRENT_DATE
        GROUP BY EXTRACT(HOUR FROM o.created_at)
        ORDER BY hour
      `;
    } else if (period === 'week') {
      // Daily breakdown for the week
      breakdownQuery = `
        SELECT
          DATE(o.created_at) as date,
          COUNT(o.id) as order_count,
          SUM(o.total_amount) as sales,
          SUM(o.commission_amount) as commission
        FROM orders o
        WHERE o.restaurant_id = $1
          AND o.status = 'completed'
          AND o.created_at >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY DATE(o.created_at)
        ORDER BY date
      `;
    } else if (period === 'month') {
      // Daily breakdown for the month
      breakdownQuery = `
        SELECT
          DATE(o.created_at) as date,
          COUNT(o.id) as order_count,
          SUM(o.total_amount) as sales,
          SUM(o.commission_amount) as commission
        FROM orders o
        WHERE o.restaurant_id = $1
          AND o.status = 'completed'
          AND o.created_at >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY DATE(o.created_at)
        ORDER BY date
      `;
    } else {
      // Monthly breakdown for all time
      breakdownQuery = `
        SELECT
          DATE_TRUNC('month', o.created_at) as month,
          COUNT(o.id) as order_count,
          SUM(o.total_amount) as sales,
          SUM(o.commission_amount) as commission
        FROM orders o
        WHERE o.restaurant_id = $1
          AND o.status = 'completed'
        GROUP BY DATE_TRUNC('month', o.created_at)
        ORDER BY month
      `;
    }

    const breakdownResult = await query(breakdownQuery, [restaurantId]);

    // 6. Get order type breakdown (pickup vs delivery)
    const orderTypeQuery = `
      SELECT
        o.order_type,
        COUNT(o.id) as order_count,
        SUM(o.total_amount) as revenue
      FROM orders o
      WHERE o.restaurant_id = $1
        AND o.status = 'completed'
        ${dateFilter}
      GROUP BY o.order_type
    `;

    const orderTypeResult = await query(orderTypeQuery, [restaurantId]);

    // Format the response
    return res.status(200).json({
      status: 'success',
      data: {
        period,
        summary: {
          totalSales: parseFloat(summary.total_sales),
          totalCommission: parseFloat(summary.total_commission),
          netRevenue: parseFloat(summary.total_sales) - parseFloat(summary.total_commission),
          totalOrders: parseInt(summary.total_orders),
          totalItemsSold: parseInt(summary.total_items_sold),
          averageOrderValue: summary.total_orders > 0
            ? (parseFloat(summary.total_sales) / parseInt(summary.total_orders)).toFixed(2)
            : 0,
        },
        comparison: period !== 'all' ? {
          previousPeriodSales: previousSummary,
          percentageChange: parseFloat(percentageChange),
          trend: percentageChange >= 0 ? 'up' : 'down'
        } : null,
        topProducts: topProductsResult.rows.map(p => ({
          id: p.id,
          name: p.name,
          categoryId: p.category_id,
          quantitySold: parseInt(p.quantity_sold),
          revenue: parseFloat(p.revenue)
        })),
        salesByCategory: categoryResult.rows.map(c => ({
          id: c.id,
          categoryName: c.category_name,
          orderCount: parseInt(c.order_count),
          itemsSold: parseInt(c.items_sold),
          revenue: parseFloat(c.revenue)
        })),
        salesBreakdown: breakdownResult.rows.map(b => ({
          period: b.date || b.month || b.hour,
          orderCount: parseInt(b.order_count),
          sales: parseFloat(b.sales),
          commission: parseFloat(b.commission)
        })),
        orderTypeBreakdown: orderTypeResult.rows.map(ot => ({
          orderType: ot.order_type,
          orderCount: parseInt(ot.order_count),
          revenue: parseFloat(ot.revenue)
        }))
      }
    });

  } catch (error) {
    console.error('Error fetching restaurant sales:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch sales data',
      error: error.message
    });
  }
};

module.exports = {
  getRestaurantSales
};
