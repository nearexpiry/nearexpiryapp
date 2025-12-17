const { query, getClient } = require('../db/db');

/**
 * Create new product
 * POST /api/products
 * @access Protected - Restaurant role only
 */
const createProduct = async (req, res) => {
  const client = await getClient();

  try {
    const userId = req.user.userId;
    const { name, description, category_id, price, quantity, expiry_date, image_url } = req.body;

    // Validation
    if (!name || !category_id || price === undefined || quantity === undefined || !expiry_date) {
      return res.status(400).json({
        status: 'error',
        message: 'Name, category_id, price, quantity, and expiry_date are required',
      });
    }

    // Validate price (must be positive)
    if (price < 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Price must be a positive number',
      });
    }

    // Validate quantity (must be non-negative integer)
    if (quantity < 0 || !Number.isInteger(Number(quantity))) {
      return res.status(400).json({
        status: 'error',
        message: 'Quantity must be a non-negative integer',
      });
    }

    // Validate expiry_date (must be future date)
    const expiryDate = new Date(expiry_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset to start of day for fair comparison

    if (expiryDate < today) {
      return res.status(400).json({
        status: 'error',
        message: 'Expiry date must be today or a future date',
      });
    }

    // Begin transaction
    await client.query('BEGIN');

    // Get restaurant ID from user ID
    const restaurantResult = await client.query(
      'SELECT id FROM restaurants WHERE user_id = $1',
      [userId]
    );

    if (restaurantResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        status: 'error',
        message: 'Restaurant profile not found. Please create your profile first.',
      });
    }

    const restaurantId = restaurantResult.rows[0].id;

    // Verify category exists
    const categoryResult = await client.query(
      'SELECT id FROM categories WHERE id = $1',
      [category_id]
    );

    if (categoryResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        status: 'error',
        message: 'Invalid category_id. Category does not exist.',
      });
    }

    // Insert product
    const insertQuery = `
      INSERT INTO products (restaurant_id, category_id, name, description, image_url, price, quantity, expiry_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, restaurant_id, category_id, name, description, image_url, price, quantity, expiry_date, is_active, created_at, updated_at
    `;

    const result = await client.query(insertQuery, [
      restaurantId,
      category_id,
      name,
      description || null,
      image_url || null,
      price,
      quantity,
      expiry_date,
    ]);

    const product = result.rows[0];

    // Commit transaction
    await client.query('COMMIT');

    res.status(201).json({
      status: 'success',
      message: 'Product created successfully',
      data: {
        product: {
          id: product.id,
          restaurantId: product.restaurant_id,
          categoryId: product.category_id,
          name: product.name,
          description: product.description,
          imageUrl: product.image_url,
          price: parseFloat(product.price),
          quantity: product.quantity,
          expiryDate: product.expiry_date,
          isActive: product.is_active,
          createdAt: product.created_at,
          updatedAt: product.updated_at,
        },
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create product error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create product. Please try again.',
    });
  } finally {
    client.release();
  }
};

/**
 * Update existing product
 * PUT /api/products/:id
 * @access Protected - Restaurant role only, owner check
 */
const updateProduct = async (req, res) => {
  const client = await getClient();

  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { name, description, category_id, price, quantity, expiry_date, image_url } = req.body;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid product ID format',
      });
    }

    // Validation
    if (!name || !category_id || price === undefined || quantity === undefined || !expiry_date) {
      return res.status(400).json({
        status: 'error',
        message: 'Name, category_id, price, quantity, and expiry_date are required',
      });
    }

    // Validate price
    if (price < 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Price must be a positive number',
      });
    }

    // Validate quantity
    if (quantity < 0 || !Number.isInteger(Number(quantity))) {
      return res.status(400).json({
        status: 'error',
        message: 'Quantity must be a non-negative integer',
      });
    }

    // Validate expiry_date
    const expiryDate = new Date(expiry_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (expiryDate < today) {
      return res.status(400).json({
        status: 'error',
        message: 'Expiry date must be today or a future date',
      });
    }

    // Begin transaction
    await client.query('BEGIN');

    // Get restaurant ID from user ID
    const restaurantResult = await client.query(
      'SELECT id FROM restaurants WHERE user_id = $1',
      [userId]
    );

    if (restaurantResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        status: 'error',
        message: 'Restaurant profile not found.',
      });
    }

    const restaurantId = restaurantResult.rows[0].id;

    // Check if product exists and belongs to this restaurant (ownership check)
    const productCheck = await client.query(
      'SELECT id, restaurant_id FROM products WHERE id = $1',
      [id]
    );

    if (productCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        status: 'error',
        message: 'Product not found',
      });
    }

    if (productCheck.rows[0].restaurant_id !== restaurantId) {
      await client.query('ROLLBACK');
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to update this product',
      });
    }

    // Verify category exists
    const categoryResult = await client.query(
      'SELECT id FROM categories WHERE id = $1',
      [category_id]
    );

    if (categoryResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        status: 'error',
        message: 'Invalid category_id. Category does not exist.',
      });
    }

    // Update product
    const updateQuery = `
      UPDATE products
      SET name = $1, description = $2, category_id = $3, price = $4, quantity = $5, expiry_date = $6, image_url = $7
      WHERE id = $8
      RETURNING id, restaurant_id, category_id, name, description, image_url, price, quantity, expiry_date, is_active, created_at, updated_at
    `;

    const result = await client.query(updateQuery, [
      name,
      description || null,
      category_id,
      price,
      quantity,
      expiry_date,
      image_url || null,
      id,
    ]);

    const product = result.rows[0];

    // Commit transaction
    await client.query('COMMIT');

    res.status(200).json({
      status: 'success',
      message: 'Product updated successfully',
      data: {
        product: {
          id: product.id,
          restaurantId: product.restaurant_id,
          categoryId: product.category_id,
          name: product.name,
          description: product.description,
          imageUrl: product.image_url,
          price: parseFloat(product.price),
          quantity: product.quantity,
          expiryDate: product.expiry_date,
          isActive: product.is_active,
          createdAt: product.created_at,
          updatedAt: product.updated_at,
        },
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Update product error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update product. Please try again.',
    });
  } finally {
    client.release();
  }
};

/**
 * Delete product (soft delete - set is_active = false)
 * DELETE /api/products/:id
 * @access Protected - Restaurant role only, owner check
 */
const deleteProduct = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid product ID format',
      });
    }

    // Get restaurant ID from user ID
    const restaurantResult = await query(
      'SELECT id FROM restaurants WHERE user_id = $1',
      [userId]
    );

    if (restaurantResult.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Restaurant profile not found.',
      });
    }

    const restaurantId = restaurantResult.rows[0].id;

    // Check if product exists and belongs to this restaurant
    const productCheck = await query(
      'SELECT id, restaurant_id FROM products WHERE id = $1',
      [id]
    );

    if (productCheck.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found',
      });
    }

    if (productCheck.rows[0].restaurant_id !== restaurantId) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to delete this product',
      });
    }

    // Soft delete - set is_active to false
    await query(
      'UPDATE products SET is_active = false WHERE id = $1',
      [id]
    );

    res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete product. Please try again.',
    });
  }
};

/**
 * Get all products for authenticated restaurant
 * GET /api/products/my-products
 * @access Protected - Restaurant role only
 */
const getMyProducts = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get restaurant ID from user ID
    const restaurantResult = await query(
      'SELECT id FROM restaurants WHERE user_id = $1',
      [userId]
    );

    if (restaurantResult.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Restaurant profile not found.',
      });
    }

    const restaurantId = restaurantResult.rows[0].id;

    // Get all active products for this restaurant with category information
    const result = await query(
      `SELECT p.id, p.restaurant_id, p.category_id, p.name, p.description, p.image_url,
              p.price, p.quantity, p.expiry_date, p.is_active, p.created_at, p.updated_at,
              c.name as category_name
       FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE p.restaurant_id = $1 AND p.is_active = true
       ORDER BY p.created_at DESC`,
      [restaurantId]
    );

    const products = result.rows.map(product => ({
      id: product.id,
      restaurantId: product.restaurant_id,
      categoryId: product.category_id,
      categoryName: product.category_name,
      name: product.name,
      description: product.description,
      imageUrl: product.image_url,
      price: parseFloat(product.price),
      quantity: product.quantity,
      expiryDate: product.expiry_date,
      isActive: product.is_active,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    }));

    res.status(200).json({
      status: 'success',
      data: {
        products,
      },
    });
  } catch (error) {
    console.error('Get my products error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get products.',
    });
  }
};

/**
 * Get product by ID (public endpoint)
 * GET /api/products/:id
 * @access Public
 */
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid product ID format',
      });
    }

    // Get product by ID with category and restaurant information
    const result = await query(
      `SELECT p.id, p.restaurant_id, p.category_id, p.name, p.description, p.image_url,
              p.price, p.quantity, p.expiry_date, p.is_active, p.created_at, p.updated_at,
              c.name as category_name,
              r.name as restaurant_name
       FROM products p
       JOIN categories c ON p.category_id = c.id
       JOIN restaurants r ON p.restaurant_id = r.id
       WHERE p.id = $1 AND p.is_active = true`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found',
      });
    }

    const product = result.rows[0];

    res.status(200).json({
      status: 'success',
      data: {
        product: {
          id: product.id,
          restaurantId: product.restaurant_id,
          restaurantName: product.restaurant_name,
          categoryId: product.category_id,
          categoryName: product.category_name,
          name: product.name,
          description: product.description,
          imageUrl: product.image_url,
          price: parseFloat(product.price),
          quantity: product.quantity,
          expiryDate: product.expiry_date,
          isActive: product.is_active,
          createdAt: product.created_at,
          updatedAt: product.updated_at,
        },
      },
    });
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get product details.',
    });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  getProductById,
};
