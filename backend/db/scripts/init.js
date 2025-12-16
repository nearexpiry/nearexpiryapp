require('dotenv').config();
const { initDatabase, closePool } = require('../db');

const run = async () => {
  try {
    console.log('Starting database initialization...\n');
    await initDatabase();
    console.log('\n✓ Database initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Database initialization failed:', error.message);
    process.exit(1);
  } finally {
    await closePool();
  }
};

run();
