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

### Windows Compatibility

✅ **This Docker setup is fully compatible with Windows!**

The application includes special handling for Windows line-ending issues:
- `.gitattributes` ensures shell scripts use Unix (LF) line endings
- Dockerfile automatically converts any CRLF to LF line endings
- No manual configuration needed

**Note**: If you cloned the repository before the `.gitattributes` file was added, you may need to refresh your line endings:
```bash
git rm --cached -r .
git reset --hard
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

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:8000
- **PostgreSQL**: Not exposed (internal only - accessible within Docker network)

> **Note**: Ports can be customized via `.env` file if 8080 or 8000 are already in use.

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
│  │   :80      │  │   :5003    │  │   :5432      │  │
│  └────────────┘  └────────────┘  └──────────────┘  │
│       ▲                                              │
└───────┼──────────────────────────────────────────────┘
        │
   localhost:8080
```

### Services

1. **PostgreSQL Database** (`postgres`)
   - Image: `postgres:15-alpine`
   - Internal Port: 5432 (not exposed to host)
   - Data persisted in Docker volume `postgres_data`
   - Auto-initialized with schema and seed data
   - Only accessible within Docker network (prevents port conflicts)

2. **Backend API** (`backend`)
   - Built from `./backend/Dockerfile`
   - Internal Port: 5003
   - Host Port: 8000 (configurable via `BACKEND_PORT`)
   - Node.js/Express server
   - Automatically waits for database to be ready
   - Runs database initialization on first start

3. **Frontend** (`frontend`)
   - Built from `./frontend/Dockerfile`
   - Internal Port: 80
   - Host Port: 8080 (configurable via `FRONTEND_PORT`)
   - React SPA served by Nginx
   - Production-optimized build

### Networking

All services communicate through a Docker bridge network (`nearexpiry-network`). Services can reach each other using their service names as hostnames (e.g., `postgres`, `backend`).

## Development vs Production

### Current Setup (Development-friendly)

The current `docker-compose.yml` is configured for easy development:

- `NODE_ENV=development` (disables SSL for local PostgreSQL)
- Ports are exposed to host machine
- Backend has volume mount for hot-reload (optional)
- Logs are visible in console
- Services restart automatically
- PostgreSQL without SSL (suitable for local development)

### For Production Deployment

Consider these changes for production:

1. **Remove exposed ports** (except frontend)
2. **Use Docker secrets** for sensitive data
3. **Add reverse proxy** (Nginx/Traefik) with SSL
4. **Remove volume mounts** for backend
5. **Set NODE_ENV=production** (enables SSL for database connections)
6. **Use production-grade database** (managed PostgreSQL with SSL)
7. **Configure log aggregation**
8. **Set up monitoring** (health checks, metrics)

## Troubleshooting

### Port already in use

If you see "port already allocated" error, you can easily change the ports:

**Option 1: Use .env file (Recommended)**
```bash
# Create or edit .env file
echo "FRONTEND_PORT=8081" >> .env
echo "BACKEND_PORT=8001" >> .env
```

**Option 2: Set environment variables**
```bash
FRONTEND_PORT=8081 BACKEND_PORT=8001 docker compose up
```

**Option 3: Stop the conflicting service**
```bash
# Find what's using the port
lsof -i :8080  # or :8000
# Then stop that service
```

The default ports (Frontend: 8080, Backend: 8000) are chosen to minimize conflicts with common development tools.

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

### SSL Connection Error

If you see "The server does not support SSL connections" error:

This happens when `NODE_ENV=production` but PostgreSQL doesn't have SSL configured. The docker-compose.yml uses `NODE_ENV=development` by default to avoid this.

**Solution**: Verify that `NODE_ENV=development` in docker-compose.yml (line 36-38). If you need production mode with a local database, update the DATABASE_URL to include `?sslmode=disable`.

### Windows: "docker-entrypoint.sh not found" Error

If you see this error on Windows:
```
exec /usr/local/bin/docker-entrypoint.sh: no such file or directory
```

**Cause**: Line ending mismatch (Windows CRLF vs Unix LF)

**Solution**:
1. The repository includes `.gitattributes` to handle this automatically
2. If you cloned before this was added, refresh your checkout:
   ```bash
   git rm --cached -r .
   git reset --hard
   ```

3. Rebuild the Docker image:
   ```bash
   docker compose build --no-cache backend
   docker compose up
   ```

The Dockerfile automatically converts line endings, so this should work after rebuilding.

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

Should show: `REACT_APP_API_URL=http://localhost:8000/api` (or your custom backend port)

If the URL is incorrect or you changed ports, rebuild the frontend:

```bash
docker compose up --build frontend
```

**Note**: React apps bake environment variables into the build at build time, so you must rebuild after changing `REACT_APP_API_URL`.

### CORS Errors

If you see CORS errors like "No 'Access-Control-Allow-Origin' header":

```
Access to XMLHttpRequest at 'http://localhost:8000/api/...' from origin 'http://localhost:8080'
has been blocked by CORS policy
```

**Common Causes**:
1. Frontend port changed but backend CORS not updated
2. Using wrong API URL in frontend code

**Solutions**:
1. Verify backend allows your frontend origin (check backend/server.js:9-15)
2. Restart backend container: `docker compose restart backend`
3. Check backend logs: `docker compose logs backend | grep CORS`

The backend is configured to allow:
- `http://localhost:3000` (manual setup)
- `http://localhost:3001` (alternative port)
- `http://localhost:8080` (Docker default)
- `http://localhost:8081` (Docker alternative)
- Value of `FRONTEND_URL` env variable

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
| `FRONTEND_PORT` | Frontend port on host | `8080` |
| `BACKEND_PORT` | Backend port on host | `8000` |
| `POSTGRES_PORT` | PostgreSQL port on host (if exposed) | `54320` |

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
2. **Explore the API** at http://localhost:8000/api
3. **Check the application** at http://localhost:8080
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
