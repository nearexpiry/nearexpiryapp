# Docker Setup Guide for Near Expiry App

This guide will help you run the Near Expiry application using Docker and Docker Compose.

## Prerequisites

- **Docker** (version 20.10 or later)
- **Docker Compose** (version 2.0 or later)

### Installing Docker

- **Windows/Mac**: Download [Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Linux**: Follow the [official installation guide](https://docs.docker.com/engine/install/)

Verify installation:
```bash
docker --version
docker compose version
```

## Quick Start

### ⚡ Option 1: Automated Startup (Easiest)

We provide a startup script that checks prerequisites and guides you through the setup:

```bash
./start.sh
```

The script will:
- ✓ Check if Docker is installed
- ✓ Verify Docker Compose is available
- ✓ Create `.env` from `.env.example` if needed
- ✓ Validate required environment variables
- ✓ Start the application

### 🔧 Option 2: Manual Setup

### 1. Clone the repository (if not already done)
```bash
git clone <repository-url>
cd nearexpiryapp
```

### 2. Configure environment variables

Copy the example environment file and edit it with your credentials:

```bash
cp .env.example .env
```

Edit `.env` and set the following **required** values:

```env
# REQUIRED: Set a strong JWT secret (use a random string generator)
JWT_SECRET=your_strong_random_secret_here

# REQUIRED: Cloudinary credentials (for image uploads)
# Sign up at https://cloudinary.com for free
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# REQUIRED: Email credentials (for password reset emails)
# For Gmail, use an App Password: https://support.google.com/accounts/answer/185833
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

### 3. Start the application

```bash
docker compose up
```

That's it! The application will:
- Build the Docker images (first time only)
- Start PostgreSQL database
- Initialize the database schema
- Seed initial data
- Start the backend API server
- Start the frontend web server

### 4. Access the application

Once all services are running (look for "Starting application..." in logs):

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **PostgreSQL**: localhost:5432

### 5. Default login credentials

After seeding, you can login with:

- **Email**: admin@nearexpiry.com
- **Password**: Admin123!

## Docker Commands Reference

### Start services (detached mode)
```bash
docker compose up -d
```

### Stop services
```bash
docker compose down
```

### Stop services and remove volumes (⚠️ deletes all data)
```bash
docker compose down -v
```

### View logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres
```

### Rebuild containers (after code changes)
```bash
# Rebuild all
docker compose up --build

# Rebuild specific service
docker compose up --build backend
```

### Execute commands in running containers
```bash
# Access backend shell
docker compose exec backend sh

# Access PostgreSQL
docker compose exec postgres psql -U nearexpiry_user -d nearexpiry

# Run database migrations
docker compose exec backend npm run db:setup
```

### Check service status
```bash
docker compose ps
```

### Restart a service
```bash
docker compose restart backend
docker compose restart frontend
```

## Architecture

The application consists of three main services:

```
┌─────────────────────────────────────────────────────┐
│                    Docker Network                    │
│  ┌────────────┐  ┌────────────┐  ┌──────────────┐  │
│  │  Frontend  │  │  Backend   │  │  PostgreSQL  │  │
│  │   (Nginx)  │◄─┤  (Node.js) │◄─┤   Database   │  │
│  │   :80      │  │   :5000    │  │   :5432      │  │
│  └────────────┘  └────────────┘  └──────────────┘  │
│       ▲                                              │
└───────┼──────────────────────────────────────────────┘
        │
   localhost:3000
```

### Services

1. **PostgreSQL Database** (`postgres`)
   - Image: `postgres:15-alpine`
   - Port: 5432
   - Data persisted in Docker volume `postgres_data`
   - Auto-initialized with schema and seed data

2. **Backend API** (`backend`)
   - Built from `./backend/Dockerfile`
   - Port: 5000
   - Node.js/Express server
   - Automatically waits for database to be ready
   - Runs database initialization on first start

3. **Frontend** (`frontend`)
   - Built from `./frontend/Dockerfile`
   - Port: 3000 (mapped to internal port 80)
   - React SPA served by Nginx
   - Production-optimized build

### Networking

All services communicate through a Docker bridge network (`nearexpiry-network`). Services can reach each other using their service names as hostnames (e.g., `postgres`, `backend`).

## Development vs Production

### Current Setup (Development-friendly)

The current `docker-compose.yml` is configured for easy development:

- Ports are exposed to host machine
- Backend has volume mount for hot-reload (optional)
- Logs are visible in console
- Services restart automatically

### For Production Deployment

Consider these changes for production:

1. **Remove exposed ports** (except frontend)
2. **Use Docker secrets** for sensitive data
3. **Add reverse proxy** (Nginx/Traefik) with SSL
4. **Remove volume mounts** for backend
5. **Set NODE_ENV=production**
6. **Use production-grade database** (managed PostgreSQL)
7. **Configure log aggregation**
8. **Set up monitoring** (health checks, metrics)

## Troubleshooting

### Port already in use

If you see "port already allocated" error:

```bash
# Change ports in docker-compose.yml
# For example, change "3000:80" to "3001:80" for frontend
```

Or stop the conflicting service on your host machine.

### Database connection failed

If backend can't connect to database:

1. Check PostgreSQL is healthy:
   ```bash
   docker compose ps postgres
   ```

2. View PostgreSQL logs:
   ```bash
   docker compose logs postgres
   ```

3. Manually test connection:
   ```bash
   docker compose exec backend npm run db:test
   ```

### Build fails

If Docker build fails:

1. Clear Docker cache:
   ```bash
   docker compose build --no-cache
   ```

2. Remove old containers and images:
   ```bash
   docker compose down -v
   docker system prune -a
   ```

### Frontend can't reach backend

Check that `REACT_APP_API_URL` is set correctly:

```bash
docker compose exec frontend env | grep REACT_APP
```

Should show: `REACT_APP_API_URL=http://localhost:5000/api`

### Cloudinary uploads not working

1. Verify Cloudinary credentials in `.env`
2. Check backend logs for Cloudinary errors:
   ```bash
   docker compose logs backend | grep -i cloudinary
   ```

### Email not sending

1. For Gmail, make sure you're using an App Password, not your regular password
2. Check email configuration:
   ```bash
   docker compose exec backend env | grep EMAIL
   ```

## Data Persistence

### Database Data

PostgreSQL data is stored in a Docker volume named `postgres_data`. This means your data persists even when you stop and start containers.

To completely reset the database:
```bash
docker compose down -v  # ⚠️ This deletes all data!
docker compose up
```

### Uploaded Images

Images are stored in Cloudinary, not in Docker containers. They persist independently of your Docker setup.

## Environment Variables Reference

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `JWT_SECRET` | Secret key for JWT tokens | `random_string_here` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your-cloud-name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `abcdefghijklmnop` |
| `EMAIL_USER` | SMTP email address | `your@email.com` |
| `EMAIL_PASS` | SMTP password/app password | `your_app_password` |

### Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `EMAIL_HOST` | SMTP server | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `FRONTEND_PORT` | Frontend port on host | `3000` |
| `BACKEND_PORT` | Backend port on host | `5000` |
| `POSTGRES_PORT` | PostgreSQL port on host | `5432` |

## Health Checks

All services include health checks:

- **PostgreSQL**: Checks database is accepting connections
- **Backend**: HTTP GET to `/health` endpoint
- **Frontend**: HTTP GET to `/health` endpoint

View health status:
```bash
docker compose ps
```

Healthy services show `(healthy)` in the status column.

## Next Steps

After successfully running the application:

1. **Create accounts** for different user types (client, restaurant, admin)
2. **Explore the API** at http://localhost:5000/api
3. **Check the application** at http://localhost:3000
4. **Read API documentation** in `README.md`
5. **Review authentication** in `AUTH_IMPLEMENTATION.md`

## Support

If you encounter issues:

1. Check this troubleshooting guide
2. Review logs: `docker compose logs -f`
3. Verify environment variables in `.env`
4. Ensure Docker and Docker Compose are up to date

## License

[Your License Here]
