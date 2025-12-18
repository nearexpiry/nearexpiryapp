const { query, getClient } = require('../db/db');

/**
 * Create new order
 * POST /api/orders
 * @access Protected - Client role only
 */
const createOrder = async (req, res) => {
  const client = await getClient();

  try {
    const userId = req.user.userId;
    const { items, orderType, deliveryAddress, deliveryPhone } = req.body;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Items array is required and must not be empty',
      });
    }

    if (!orderType || !['pickup', 'delivery'].includes(orderType)) {
      return res.status(400).json({
        status: 'error',
        message: 'Order type must be either "pickup" or "delivery"',
      });
    }

    // If delivery, validate delivery address and phone
    if (orderType === 'delivery') {
      if (!deliveryAddress || !deliveryAddress.trim()) {
        return res.status(400).json({
          status: 'error',
          message: 'Delivery address is required for delivery orders',
        });
      }
      if (!deliveryPhone || !deliveryPhone.trim()) {
        return res.status(400).json({
          status: 'error',
          message: 'Delivery phone is required for delivery orders',
        });
      }
    }

    // Validate items structure
    for (const item of items) {
      if (!item.productId || !item.quantity) {
        return res.status(400).json({
          status: 'error',
          message: 'Each item must have productId and quantity',
        });
      }
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Quantity must be a positive integer',
        });
      }
    }

    // Begin transaction
    await client.query('BEGIN');

    // Fetch all products and validate
    const productIds = items.map(item => item.productId);
    const productsResult = await client.query(
      `SELECT id, restaurant_id, name, price, quantity, is_active
       FROM products
       WHERE id = ANY($1::uuid[])`,
      [productIds]
    );

    if (productsResult.rows.length !== productIds.length) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        status: 'error',
        message: 'One or more products not found',
      });
    }

    const products = productsResult.rows;

    // Check if all products are active
    const inactiveProduct = products.find(p => !p.is_active);
    if (inactiveProduct) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        status: 'error',
        message: `Product "${inactiveProduct.name}" is not available`,
      });
    }

    // Validate all products belong to the same restaurant
    const restaurantIds = [...new Set(products.map(p => p.restaurant_id))];
    if (restaurantIds.length > 1) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        status: 'error',
        message: 'All items must be from the same restaurant',
      });
    }

    const restaurantId = restaurantIds[0];

    // Validate quantities and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = products.find(p => p.id === item.productId);

      if (product.quantity < item.quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          status: 'error',
          message: `Insufficient quantity for product "${product.name}". Available: ${product.quantity}, Requested: ${item.quantity}`,
        });
      }

      const itemTotal = parseFloat(product.price) * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        priceAtOrder: parseFloat(product.price),
      });
    }

    // Create order
    const orderQuery = `
      INSERT INTO orders (client_id, restaurant_id, total_amount, commission_amount, status, order_type, delivery_address, delivery_phone)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, client_id, restaurant_id, total_amount, commission_amount, status, order_type, delivery_address, delivery_phone, created_at, updated_at
    `;

    const orderResult = await client.query(orderQuery, [
      userId,
      restaurantId,
      totalAmount.toFixed(2),
      0, // commission_amount is 0 initially (will be calculated on completion)
      'pending',
      orderType,
      orderType === 'delivery' ? deliveryAddress : null,
      orderType === 'delivery' ? deliveryPhone : null,
    ]);

    const order = orderResult.rows[0];

    // Create order items and reduce product quantities
    for (const item of orderItems) {
      // Insert order item
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price_at_order)
         VALUES ($1, $2, $3, $4)`,
        [order.id, item.productId, item.quantity, item.priceAtOrder]
      );

      // Reduce product quantity
      await client.query(
        `UPDATE products
         SET quantity = quantity - $1
         WHERE id = $2`,
        [item.quantity, item.productId]
      );
    }

    // Fetch complete order with items
    const completeOrderResult = await client.query(
      `SELECT
        o.id, o.client_id, o.restaurant_id, o.total_amount, o.commission_amount,
        o.status, o.order_type, o.delivery_address, o.delivery_phone,
        o.created_at, o.updated_at,
        r.name as restaurant_name, r.address as restaurant_address, r.phone as restaurant_phone
       FROM orders o
       JOIN restaurants r ON o.restaurant_id = r.id
       WHERE o.id = $1`,
      [order.id]
    );

    const orderItemsResult = await client.query(
      `SELECT
        oi.id, oi.product_id, oi.quantity, oi.price_at_order,
        p.name as product_name, p.image_url as product_image
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [order.id]
    );

    // Commit transaction
    await client.query('COMMIT');

    const completeOrder = completeOrderResult.rows[0];
    const items_list = orderItemsResult.rows.map(item => ({
      id: item.id,
      productId: item.product_id,
      productName: item.product_name,
      productImage: item.product_image,
      quantity: item.quantity,
      priceAtOrder: parseFloat(item.price_at_order),
    }));

    res.status(201).json({
      status: 'success',
      message: 'Order created successfully',
      data: {
        order: {
          id: completeOrder.id,
          clientId: completeOrder.client_id,
          restaurantId: completeOrder.restaurant_id,
          restaurantName: completeOrder.restaurant_name,
          restaurantAddress: completeOrder.restaurant_address,
          restaurantPhone: completeOrder.restaurant_phone,
          totalAmount: parseFloat(completeOrder.total_amount),
          commissionAmount: parseFloat(completeOrder.commission_amount),
          status: completeOrder.status,
          orderType: completeOrder.order_type,
          deliveryAddress: completeOrder.delivery_address,
          deliveryPhone: completeOrder.delivery_phone,
          items: items_list,
          createdAt: completeOrder.created_at,
          updatedAt: completeOrder.updated_at,
        },
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create order error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create order. Please try again.',
    });
  } finally {
    client.release();
  }
};

/**
 * Get all orders for authenticated restaurant
 * GET /api/orders/restaurant/my-orders
 * @access Protected - Restaurant role only
 */
const getRestaurantOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { status, startDate, endDate } = req.query;

    // First, get the restaurant ID for the authenticated user
    const restaurantResult = await query(
      'SELECT id FROM restaurants WHERE user_id = $1',
      [userId]
    );

    if (restaurantResult.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Restaurant profile not found',
      });
    }

    const restaurantId = restaurantResult.rows[0].id;

    // Build query with filters
    let queryText = `
      SELECT
        o.id, o.client_id, o.restaurant_id, o.total_amount, o.commission_amount,
        o.status, o.order_type, o.delivery_address, o.delivery_phone,
        o.created_at, o.updated_at,
        u.email as client_email,
        COALESCE(u.full_name, u.email) as client_name
      FROM orders o
      JOIN users u ON o.client_id = u.id
      WHERE o.restaurant_id = $1
    `;

    const queryParams = [restaurantId];
    let paramCounter = 2;

    // Add status filter if provided
    if (status) {
      queryText += ` AND o.status = $${paramCounter}`;
      queryParams.push(status);
      paramCounter++;
    }

    // Add date range filter if provided
    if (startDate) {
      queryText += ` AND o.created_at >= $${paramCounter}`;
      queryParams.push(startDate);
      paramCounter++;
    }

    if (endDate) {
      queryText += ` AND o.created_at <= $${paramCounter}`;
      queryParams.push(endDate);
      paramCounter++;
    }

    // Sort by created_at desc
    queryText += ' ORDER BY o.created_at DESC';

    const ordersResult = await query(queryText, queryParams);

    // Fetch order items for all orders
    const orders = await Promise.all(
      ordersResult.rows.map(async (order) => {
        const itemsResult = await query(
          `SELECT
            oi.id, oi.product_id, oi.quantity, oi.price_at_order,
            p.name as product_name, p.image_url as product_image
          FROM order_items oi
          JOIN products p ON oi.product_id = p.id
          WHERE oi.order_id = $1`,
          [order.id]
        );

        return {
          id: order.id,
          clientId: order.client_id,
          clientName: order.client_name,
          clientEmail: order.client_email,
          restaurantId: order.restaurant_id,
          totalAmount: parseFloat(order.total_amount),
          commissionAmount: parseFloat(order.commission_amount),
          status: order.status,
          orderType: order.order_type,
          deliveryAddress: order.delivery_address,
          deliveryPhone: order.delivery_phone,
          items: itemsResult.rows.map(item => ({
            id: item.id,
            productId: item.product_id,
            productName: item.product_name,
            productImage: item.product_image,
            quantity: item.quantity,
            priceAtOrder: parseFloat(item.price_at_order),
          })),
          createdAt: order.created_at,
          updatedAt: order.updated_at,
        };
      })
    );

    res.status(200).json({
      status: 'success',
      data: {
        orders,
      },
    });
  } catch (error) {
    console.error('Get restaurant orders error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch orders. Please try again.',
    });
  }
};

/**
 * Update order status
 * PATCH /api/orders/:id/status
 * @access Protected - Restaurant role only
 */
const updateOrderStatus = async (req, res) => {
  const client = await getClient();

  try {
    const userId = req.user.userId;
    const orderId = req.params.id;
    const { status: newStatus } = req.body;

    // Validate new status
    const validStatuses = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];
    if (!newStatus || !validStatuses.includes(newStatus)) {
      return res.status(400).json({
        status: 'error',
        message: `Status must be one of: ${validStatuses.join(', ')}`,
      });
    }

    // Get restaurant ID for authenticated user
    const restaurantResult = await client.query(
      'SELECT id FROM restaurants WHERE user_id = $1',
      [userId]
    );

    if (restaurantResult.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Restaurant profile not found',
      });
    }

    const restaurantId = restaurantResult.rows[0].id;

    // Begin transaction
    await client.query('BEGIN');

    // Get current order
    const orderResult = await client.query(
      'SELECT * FROM orders WHERE id = $1 AND restaurant_id = $2',
      [orderId, restaurantId]
    );

    if (orderResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        status: 'error',
        message: 'Order not found or you do not have permission to update it',
      });
    }

    const order = orderResult.rows[0];
    const currentStatus = order.status;

    // Validate status transitions
    const validTransitions = {
      pending: ['preparing', 'cancelled'],
      preparing: ['ready', 'cancelled'],
      ready: ['completed', 'cancelled'],
      completed: [],
      cancelled: [],
    };

    if (!validTransitions[currentStatus].includes(newStatus)) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        status: 'error',
        message: `Cannot transition from ${currentStatus} to ${newStatus}. Valid transitions: ${validTransitions[currentStatus].join(', ') || 'none'}`,
      });
    }

    let commissionAmount = parseFloat(order.commission_amount);

    // If status changes to 'completed', calculate commission
    if (newStatus === 'completed') {
      // Get commission percentage from settings
      const settingsResult = await client.query(
        "SELECT value FROM settings WHERE key = 'commission_percentage'"
      );

      const commissionPercentage = settingsResult.rows.length > 0
        ? parseFloat(settingsResult.rows[0].value)
        : 10; // Default to 10% if not found

      const totalAmount = parseFloat(order.total_amount);
      commissionAmount = (totalAmount * commissionPercentage) / 100;
    }

    // Update order status and commission
    const updateResult = await client.query(
      `UPDATE orders
       SET status = $1, commission_amount = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING id, client_id, restaurant_id, total_amount, commission_amount,
                 status, order_type, delivery_address, delivery_phone,
                 created_at, updated_at`,
      [newStatus, commissionAmount.toFixed(2), orderId]
    );

    // Commit transaction
    await client.query('COMMIT');

    const updatedOrder = updateResult.rows[0];

    res.status(200).json({
      status: 'success',
      message: 'Order status updated successfully',
      data: {
        order: {
          id: updatedOrder.id,
          clientId: updatedOrder.client_id,
          restaurantId: updatedOrder.restaurant_id,
          totalAmount: parseFloat(updatedOrder.total_amount),
          commissionAmount: parseFloat(updatedOrder.commission_amount),
          status: updatedOrder.status,
          orderType: updatedOrder.order_type,
          deliveryAddress: updatedOrder.delivery_address,
          deliveryPhone: updatedOrder.delivery_phone,
          createdAt: updatedOrder.created_at,
          updatedAt: updatedOrder.updated_at,
        },
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Update order status error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update order status. Please try again.',
    });
  } finally {
    client.release();
  }
};

module.exports = {
  createOrder,
  getRestaurantOrders,
  updateOrderStatus,
};
