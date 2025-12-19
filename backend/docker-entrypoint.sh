#!/bin/sh
set -e

echo "Waiting for PostgreSQL to be ready..."

# Wait for PostgreSQL to be ready
until node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT 1')
  .then(() => { pool.end(); process.exit(0); })
  .catch(() => { pool.end(); process.exit(1); });
" > /dev/null 2>&1; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "PostgreSQL is up - checking database setup..."

# Check if database is already initialized
DB_INITIALIZED=$(node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query(\"SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users')\")
  .then(res => {
    console.log(res.rows[0].exists ? 'true' : 'false');
    pool.end();
  })
  .catch(() => {
    console.log('false');
    pool.end();
  });
" 2>/dev/null || echo "false")

if [ "$DB_INITIALIZED" = "false" ]; then
  echo "Database not initialized - running setup..."
  npm run db:setup
else
  echo "Database already initialized - skipping setup"
fi

echo "Starting application..."
exec npm start
