require('dotenv').config();
const { testConnection, query, closePool } = require('../db');

const run = async () => {
  try {
    console.log('Testing database connection...\n');

    // Test basic connection
    const isConnected = await testConnection();

    if (!isConnected) {
      console.error('\n✗ Database connection failed!');
      process.exit(1);
    }

    // Test table creation
    console.log('\nChecking database tables...');
    const result = await query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    if (result.rows.length > 0) {
      console.log(`✓ Found ${result.rows.length} tables:`);
      result.rows.forEach(row => {
        console.log(`  - ${row.table_name}`);
      });
    } else {
      console.log('⚠ No tables found. Run "npm run db:setup" to initialize the database.');
    }

    console.log('\n✓ Database test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Database test failed:', error.message);
    process.exit(1);
  } finally {
    await closePool();
  }
};

run();
