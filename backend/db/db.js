const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Create a new pool using environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait for a connection from the pool
});

// Test connection on startup
pool.on('connect', () => {
  console.log('✓ Database connected successfully');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle database client', err);
  process.exit(-1);
});

// Helper function to execute queries
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;

    if (process.env.NODE_ENV === 'development') {
      console.log('Executed query', { text, duration, rows: res.rowCount });
    }

    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Helper function to get a client from the pool for transactions
const getClient = async () => {
  try {
    const client = await pool.connect();
    const query = client.query;
    const release = client.release;

    // Set a timeout of 5 seconds, after which we will log this client's last query
    const timeout = setTimeout(() => {
      console.error('A client has been checked out for more than 5 seconds!');
    }, 5000);

    // Monkey patch the query method to keep track of the last query executed
    client.query = (...args) => {
      client.lastQuery = args;
      return query.apply(client, args);
    };

    // Monkey patch the release method to clear our timeout
    client.release = () => {
      clearTimeout(timeout);
      // Set the methods back to their old un-monkey-patched version
      client.query = query;
      client.release = release;
      return release.apply(client);
    };

    return client;
  } catch (error) {
    console.error('Error getting client from pool:', error);
    throw error;
  }
};

// Function to initialize database (run init.sql)
const initDatabase = async () => {
  const client = await getClient();
  try {
    console.log('Initializing database schema...');
    const initSQL = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
    await client.query(initSQL);
    console.log('✓ Database schema initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Function to seed database (run seed.sql)
const seedDatabase = async () => {
  const client = await getClient();
  try {
    console.log('Seeding database...');
    const seedSQL = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
    await client.query(seedSQL);
    console.log('✓ Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Function to test database connection
const testConnection = async () => {
  try {
    const result = await query('SELECT NOW() as current_time, version() as db_version');
    console.log('✓ Database connection test successful');
    console.log(`  - Current time: ${result.rows[0].current_time}`);
    console.log(`  - Database: ${result.rows[0].db_version}`);
    return true;
  } catch (error) {
    console.error('✗ Database connection test failed:', error.message);
    return false;
  }
};

// Graceful shutdown
const closePool = async () => {
  try {
    await pool.end();
    console.log('✓ Database pool closed');
  } catch (error) {
    console.error('Error closing database pool:', error);
  }
};

module.exports = {
  query,
  getClient,
  pool,
  initDatabase,
  seedDatabase,
  testConnection,
  closePool,
};
