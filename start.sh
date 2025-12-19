#!/bin/bash

# Startup script for Near Expiry App
# This script checks prerequisites and starts the application with Docker

set -e

echo "════════════════════════════════════════════════════════"
echo "  Near Expiry App - Docker Startup Script"
echo "════════════════════════════════════════════════════════"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed"
    echo "Please install Docker from: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is available
if ! docker compose version &> /dev/null; then
    echo "❌ Error: Docker Compose is not available"
    echo "Please install Docker Compose v2 or update Docker Desktop"
    exit 1
fi

echo "✓ Docker is installed: $(docker --version)"
echo "✓ Docker Compose is available: $(docker compose version)"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found"
    echo ""
    echo "Creating .env file from .env.example..."

    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✓ Created .env file"
        echo ""
        echo "⚠️  IMPORTANT: Please edit .env and configure the following:"
        echo "   - JWT_SECRET (required)"
        echo "   - CLOUDINARY_* credentials (required for image uploads)"
        echo "   - EMAIL_* credentials (required for password reset)"
        echo ""
        read -p "Press Enter after updating .env file, or Ctrl+C to exit..."
    else
        echo "❌ Error: .env.example not found"
        exit 1
    fi
fi

echo "✓ Environment file found"
echo ""

# Validate required environment variables
echo "Checking environment variables..."

missing_vars=()

check_var() {
    if ! grep -q "^$1=" .env || grep -q "^$1=your_" .env || grep -q "^$1=$" .env; then
        missing_vars+=("$1")
    fi
}

check_var "JWT_SECRET"
check_var "CLOUDINARY_CLOUD_NAME"
check_var "CLOUDINARY_API_KEY"
check_var "CLOUDINARY_API_SECRET"
check_var "EMAIL_USER"
check_var "EMAIL_PASS"

if [ ${#missing_vars[@]} -gt 0 ]; then
    echo "⚠️  Warning: The following environment variables need to be configured:"
    for var in "${missing_vars[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo "The application may not work correctly without these values."
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Please configure .env and run this script again."
        exit 1
    fi
else
    echo "✓ Required environment variables are configured"
fi

echo ""
echo "════════════════════════════════════════════════════════"
echo "  Starting Near Expiry App..."
echo "════════════════════════════════════════════════════════"
echo ""

# Start Docker Compose
docker compose up --build

echo ""
echo "════════════════════════════════════════════════════════"
echo "  Application stopped"
echo "════════════════════════════════════════════════════════"
