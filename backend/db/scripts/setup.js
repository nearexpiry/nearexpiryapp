require('dotenv').config();
const { initDatabase, seedDatabase, closePool } = require('../db');

const run = async () => {
  try {
    console.log('Starting complete database setup...\n');

    // Initialize schema
    await initDatabase();

    // Seed data
    await seedDatabase();

    console.log('\n✓ Complete database setup finished successfully!');
    console.log('\nYou can now:');
    console.log('  - Login as admin: admin@nearexpiry.com / Admin123!');
    console.log('  - Start the server: npm start\n');

    process.exit(0);
  } catch (error) {
    console.error('\n✗ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    await closePool();
  }
};

run();
