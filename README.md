# Near Expiry

A platform connecting restaurants with customers to reduce food waste and save money on near-expiry products.

## Project Overview

Near Expiry helps restaurants sell products that are close to their expiration date at discounted prices, allowing customers to save money while reducing food waste. The platform includes features for restaurant management, product listings, real-time location mapping, and secure transactions.

## Tech Stack

### Frontend
- **React.js** - UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Leaflet & React-Leaflet** - Interactive maps
- **OpenStreetMap** - Map tiles
- **Nominatim** - Geocoding service

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Cloudinary** - Image storage and management
- **Multer** - File upload handling
- **Nodemailer** - Email notifications

## Project Structure

```
nearexpiryapp/
├── backend/                 # Backend API server
│   ├── node_modules/       # Backend dependencies
│   ├── .env.example        # Environment variables template
│   ├── package.json        # Backend dependencies and scripts
│   └── server.js           # Express server entry point
│
├── frontend/               # React frontend application
│   ├── node_modules/       # Frontend dependencies
│   ├── public/             # Static files
│   ├── src/                # React source code
│   │   ├── App.js          # Main App component
│   │   ├── App.css         # App styles
│   │   └── index.js        # React entry point
│   └── package.json        # Frontend dependencies and scripts
│
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## Getting Started

### 🐳 Quick Start with Docker (Recommended)

The easiest way to run the application is using Docker:

**Prerequisites:**
- Docker (v20.10+)
- Docker Compose (v2.0+)

**Steps:**
1. Copy `.env.example` to `.env` and configure your credentials
2. Run `docker compose up`
3. Access the app at http://localhost:8080

**📖 For detailed Docker instructions, see [DOCKER.md](DOCKER.md)**

---

### Manual Setup (Alternative)

If you prefer to run without Docker:

**Prerequisites:**
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration:
   - Database credentials
   - JWT secret
   - Cloudinary credentials
   - Email service credentials

5. Start the development server:
   ```bash
   npm run dev
   ```

   The backend API will be available at `http://localhost:5003` (or your configured PORT)

6. Test the health check endpoint:
   ```bash
   curl http://localhost:5003/health
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`

## Available Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (one-way operation)

## API Endpoints

### Health Check
- `GET /health` - Check API server status
- `GET /` - API welcome message

## Environment Variables

See `backend/.env.example` for all required environment variables:

- **Server Configuration**: PORT, NODE_ENV
- **Database**: DATABASE_URL
- **Authentication**: JWT_SECRET, JWT_EXPIRE
- **Cloudinary**: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
- **Email**: EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS
- **Frontend**: FRONTEND_URL

## Development Roadmap

- [ ] Database schema design and implementation
- [ ] User authentication (register, login, JWT)
- [ ] Restaurant management CRUD operations
- [ ] Product listing and management
- [ ] Image upload with Cloudinary
- [ ] Map integration with Leaflet
- [ ] Search and filter functionality
- [ ] Shopping cart and checkout
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Payment integration

## Contributing

This project is currently in initial development phase.

## License

ISC
