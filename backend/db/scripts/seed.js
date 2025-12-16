require('dotenv').config();
const { seedDatabase, closePool } = require('../db');

const run = async () => {
  try {
    console.log('Starting database seeding...\n');
    await seedDatabase();
    console.log('\n✓ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Database seeding failed:', error.message);
    process.exit(1);
  } finally {
    await closePool();
  }
};

run();
