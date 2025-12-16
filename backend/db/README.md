# Database Setup Guide

This directory contains all database-related files for the Near Expiry application.

## Directory Structure

```
db/
├── init.sql          # Database schema (tables, indexes, triggers)
├── seed.sql          # Initial seed data (admin user, categories, settings)
├── db.js             # Database connection and helper functions
├── scripts/          # Database management scripts
│   ├── init.js       # Initialize database schema
│   ├── seed.js       # Seed initial data
│   ├── setup.js      # Complete setup (init + seed)
│   └── test.js       # Test database connection
└── README.md         # This file
```

## Prerequisites

### Option 1: Using Docker (Recommended)

1. Install [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
2. Start the PostgreSQL container from the project root:
   ```bash
   docker-compose up -d
   ```
3. Verify the database is running:
   ```bash
   docker ps
   ```

### Option 2: Local PostgreSQL Installation

1. Install PostgreSQL 12 or higher
2. Create a database named `nearexpiry`
3. Create a user with appropriate permissions
4. Update the `DATABASE_URL` in `backend/.env` with your credentials

## Environment Setup

1. Copy the environment example file:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Update the `DATABASE_URL` in `.env`:
   ```
   DATABASE_URL=postgresql://nearexpiry_user:nearexpiry_pass@localhost:5432/nearexpiry
   ```

## Database Setup

### Complete Setup (Recommended for first-time setup)

Run the complete setup script to initialize schema and seed data:

```bash
cd backend
npm run db:setup
```

This will:
- Create all database tables
- Set up indexes and constraints
- Insert default admin user (admin@nearexpiry.com / Admin123!)
- Insert predefined categories
- Insert default settings (commission: 10%)

### Individual Operations

#### Initialize Schema Only
```bash
npm run db:init
```

#### Seed Data Only
```bash
npm run db:seed
```

#### Test Connection
```bash
npm run db:test
```

## Database Schema

### Tables

1. **users** - User accounts (clients, restaurants, admins)
2. **restaurants** - Restaurant profiles and information
3. **categories** - Product categories
4. **products** - Products with expiry dates
5. **orders** - Customer orders
6. **order_items** - Individual items in orders
7. **settings** - Application settings (commission, etc.)
8. **password_reset_tokens** - Password reset functionality

### Default Data

After running `db:setup`, you'll have:

**Admin User:**
- Email: `admin@nearexpiry.com`
- Password: `Admin123!`
- Role: admin

**Categories:**
- Bakery
- Dairy
- Produce
- Meat & Seafood
- Prepared Foods
- Beverages
- Frozen Foods
- Pantry Items

**Settings:**
- Commission Percentage: 10%

## Using the Database in Your Code

```javascript
const { query, getClient, pool } = require('./db/db');

// Simple query
const users = await query('SELECT * FROM users WHERE role = $1', ['client']);

// Transaction example
const client = await getClient();
try {
  await client.query('BEGIN');
  await client.query('INSERT INTO orders (...) VALUES (...)');
  await client.query('INSERT INTO order_items (...) VALUES (...)');
  await client.query('COMMIT');
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  client.release();
}
```

## Troubleshooting

### Connection Issues

1. Ensure PostgreSQL is running:
   ```bash
   # For Docker
   docker ps

   # For local installation
   psql -U nearexpiry_user -d nearexpiry -c "SELECT version();"
   ```

2. Verify environment variables in `.env`:
   ```bash
   cat backend/.env | grep DATABASE_URL
   ```

3. Check database logs:
   ```bash
   # For Docker
   docker logs nearexpiry_db

   # For local installation
   tail -f /var/log/postgresql/postgresql-*.log
   ```

### Resetting the Database

To completely reset the database:

```bash
npm run db:init    # This will drop and recreate all tables
npm run db:seed    # Then seed fresh data
```

### Permission Issues

If you encounter permission errors:

```sql
-- Connect to PostgreSQL as superuser
psql -U postgres

-- Grant all privileges
GRANT ALL PRIVILEGES ON DATABASE nearexpiry TO nearexpiry_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO nearexpiry_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO nearexpiry_user;
```

## Production Considerations

1. **Migrations**: For production, consider using a migration tool like [node-pg-migrate](https://github.com/salsita/node-pg-migrate) or [Knex.js](http://knexjs.org/)

2. **Connection Pooling**: The pool configuration in `db.js` is already optimized for production use

3. **SSL**: For production databases, enable SSL in the connection string:
   ```
   DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
   ```

4. **Backups**: Set up regular database backups:
   ```bash
   pg_dump -U nearexpiry_user nearexpiry > backup.sql
   ```

5. **Monitoring**: Monitor connection pool metrics and slow queries in production

## Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [node-postgres (pg) Documentation](https://node-postgres.com/)
- [Database Design Best Practices](https://www.postgresql.org/docs/current/tutorial.html)
