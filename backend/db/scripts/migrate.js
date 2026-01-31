/**
 * Database Migration Runner
 *
 * This script runs any pending migrations in the migrations folder.
 * Migrations are tracked in a `migrations` table to prevent re-running.
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { getClient, closePool } = require('../db');

const MIGRATIONS_DIR = path.join(__dirname, '..', 'migrations');

/**
 * Ensure the migrations table exists
 */
const ensureMigrationsTable = async (client) => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

/**
 * Get list of already executed migrations
 */
const getExecutedMigrations = async (client) => {
  const result = await client.query('SELECT name FROM migrations ORDER BY id');
  return result.rows.map(row => row.name);
};

/**
 * Get list of migration files from the migrations directory
 */
const getMigrationFiles = () => {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    return [];
  }

  return fs.readdirSync(MIGRATIONS_DIR)
    .filter(file => file.endsWith('.sql'))
    .sort(); // Sort to ensure correct order (YYYYMMDD_HHMMSS_name.sql)
};

/**
 * Run a single migration
 */
const runMigration = async (client, filename) => {
  const filePath = path.join(MIGRATIONS_DIR, filename);
  const sql = fs.readFileSync(filePath, 'utf8');

  console.log(`  Running migration: ${filename}`);

  // Execute the migration SQL
  await client.query(sql);

  // Record the migration as executed
  await client.query('INSERT INTO migrations (name) VALUES ($1)', [filename]);

  console.log(`  ✓ Migration completed: ${filename}`);
};

/**
 * Main migration runner
 */
const runMigrations = async () => {
  const client = await getClient();

  try {
    console.log('Starting database migrations...\n');

    // Ensure migrations table exists
    await ensureMigrationsTable(client);

    // Get executed and available migrations
    const executedMigrations = await getExecutedMigrations(client);
    const migrationFiles = getMigrationFiles();

    // Find pending migrations
    const pendingMigrations = migrationFiles.filter(
      file => !executedMigrations.includes(file)
    );

    if (pendingMigrations.length === 0) {
      console.log('No pending migrations found.\n');
      return;
    }

    console.log(`Found ${pendingMigrations.length} pending migration(s):\n`);

    // Run each pending migration in a transaction
    for (const migration of pendingMigrations) {
      await client.query('BEGIN');
      try {
        await runMigration(client, migration);
        await client.query('COMMIT');
      } catch (error) {
        await client.query('ROLLBACK');
        throw new Error(`Migration ${migration} failed: ${error.message}`);
      }
    }

    console.log(`\n✓ All migrations completed successfully!`);
  } finally {
    client.release();
  }
};

// Run if called directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n✗ Migration failed:', error.message);
      process.exit(1);
    })
    .finally(() => {
      closePool();
    });
}

module.exports = { runMigrations };
