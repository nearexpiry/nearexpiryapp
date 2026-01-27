# Near Expiry: A Web Platform for Reducing Food Waste

**A Full-Stack E-Commerce Solution Connecting Restaurants with Cost-Conscious Consumers**

---

**Student Name:** [Your Name]
**Student ID:** [Your ID]
**Supervisor:** [Supervisor Name]

**Department of Computer Science**
**Yarmouk University**

**Semester:** First 2024/2025
**Date:** January 24, 2026

---

## Students' Property Right Declaration and Anti-Plagiarism Statement

I declare that the work in this graduation project at Yarmouk University is my own work except for quotes and references that I have clearly mentioned. This work has not been used for any other degree and I am not submitting it for any other degree at the same time. This work belongs to Yarmouk University and is protected by intellectual property laws.

I declare that this report is my own work except for properly referenced quotes and contains no plagiarism.

I have read and understood the school's rules on cheating and plagiarism, which are available in the Yarmouk University Handbook.

---

## Table of Contents

- Students' Property Right Declaration and Anti-Plagiarism Statement
- List of Tables
- List of Figures
- Abstract
- Chapter 1: Introduction
- Chapter 2: Background
- Chapter 3: Design
- Chapter 4: Implementation
- Chapter 5: Results and Discussion
- Chapter 6: Economical, Ethic, and Contemporary Issues
- Chapter 7: Project Management
- Chapter 8: Conclusion and Future Work
- References
- Appendix A: User Manual

---

## List of Tables

Table 1. Technology Stack Overview .....................................................................................................XX
Table 2. Database Tables Description ...................................................................................................XX
Table 3. Design Considerations Table ...................................................................................................XX
Table 4. Cost Estimation Summary .......................................................................................................XX
Table 5. Resource Allocation .................................................................................................................XX
Table 6. Risk Assessment Matrix ...........................................................................................................XX
Table 7. API Endpoints Summary ..........................................................................................................XX

---

## List of Figures

Figure 1. System Architecture Overview ................................................................................................XX
Figure 2. Database Entity-Relationship Diagram ....................................................................................XX
Figure 3. User Authentication Flow .......................................................................................................XX
Figure 4. Client User Flow .....................................................................................................................XX
Figure 5. Restaurant Dashboard Interface ..............................................................................................XX
Figure 6. Interactive Restaurant Map ....................................................................................................XX
Figure 7. Docker Deployment Architecture ............................................................................................XX
Figure 8. Sales Analytics Visualization ..................................................................................................XX
Figure 9. Project Timeline (Gantt Chart) ................................................................................................XX

---

## Abstract

Food waste is one of the biggest environmental and economic problems today. Around 1.05 billion tonnes of food are wasted every year around the world, creating 8-10% of global greenhouse gas emissions while millions of people don't have enough food. At the same time, restaurants and food businesses have problems with food that is about to expire, which causes them to lose money. This project presents "Near Expiry," a website platform that connects restaurants selling products close to their expiry date at cheaper prices with customers who care about the environment and want to save money.

The Near Expiry platform uses modern web development technologies, including React 19.2.3 for the user interface, Node.js with Express.js 5.2.1 for the backend server, and PostgreSQL 15 for database management. The system uses a three-layer structure with clear separation between different parts, RESTful API design, and Docker containers for easy deployment. Main features include secure login with JWT tokens, interactive restaurant maps using Leaflet and OpenStreetMap, order management, sales charts with Recharts, and automatic email notifications. The platform has three types of users—customers, restaurants, and administrators—each with their own special interface and features.

Development took 15 weeks during one semester, including planning, system design, building both frontend and backend, testing, and deployment using containers. The final system successfully shows all main features including user registration and login, restaurant profile management with address mapping, product management with image uploads to Cloudinary, shopping cart, order processing with pickup and delivery options, commission tracking, and admin controls.

The platform not only solves the technical challenge of building a working e-commerce website but also helps the environment by reducing food waste. By giving restaurants a way to get back some money from food that would otherwise be thrown away, and giving customers access to affordable quality food, Near Expiry benefits everyone while encouraging sustainable habits.

**Keywords:** Food waste reduction, Near-expiry products, Web platform, E-commerce, Sustainability, React, Node.js, PostgreSQL, Docker, RESTful API

---

# Chapter 4: Implementation

This chapter explains how the Near Expiry platform was built, including the tools used, how things work together, the decisions made, and important assumptions.

## 4.1 Technology Stack and Implementation Tools

The Near Expiry platform uses carefully chosen modern, open-source technologies that are good for building websites that can grow and are easy to maintain. Table 1 shows all the technologies used in different parts of the system.

### Table 1: Technology Stack Overview

| Layer | Technology | Version | Purpose/Rationale |
|-------|-----------|---------|-------------------|
| **Frontend Framework** | React | 19.2.3 | Component-based UI, fast performance, many helpful tools available, widely used |
| **Frontend Routing** | React Router DOM | 7.10.1 | Navigation between pages, protecting routes that need login, showing different content based on user role |
| **HTTP Client** | Axios | 1.13.2 | Making API requests easily, handling authentication, managing errors |
| **Mapping Library** | Leaflet | 1.9.4 | Interactive maps, free and open-source |
| **Mapping Integration** | React-Leaflet | 5.0.0 | Using Leaflet with React components easily |
| **Data Visualization** | Recharts | 3.6.0 | Creating charts for sales data |
| **Frontend Build** | React Scripts | 5.0.1 | Building the app automatically, no complex setup needed |
| **Backend Runtime** | Node.js | 20.x | Running JavaScript on the server, handles many requests at once |
| **Backend Framework** | Express.js | 5.2.1 | Simple web framework, lots of plugins available, flexible |
| **Database** | PostgreSQL | 15 | Reliable database, advanced features, free and open-source |
| **Database Client** | pg (node-postgres) | 8.16.3 | Connecting Node.js to PostgreSQL, managing connections efficiently |
| **Authentication** | jsonwebtoken | 9.0.3 | Creating and checking JWT tokens for secure login |
| **Password Hashing** | bcryptjs | 3.0.3 | Encrypting passwords securely |
| **File Upload** | Multer | 2.0.2 | Handling file uploads like images |
| **Image Management** | Cloudinary | 2.8.0 | Storing images in the cloud, automatic optimization, fast delivery |
| **Email Service** | Nodemailer | 7.0.11 | Sending emails for notifications and password reset |
| **HTTP Requests** | Axios (Backend) | 1.13.2 | Making requests to external APIs like geocoding |
| **Environment Config** | dotenv | 17.2.3 | Managing settings and secrets safely |
| **CORS Management** | cors | 2.8.5 | Allowing frontend and backend to talk to each other |
| **Containerization** | Docker | Latest | Packaging the app to run anywhere the same way |
| **Orchestration** | Docker Compose | Latest | Managing multiple Docker containers together |
| **Web Server** | Nginx | Alpine | Serving the frontend files in production |
| **Development Tools** | Nodemon | 3.1.11 | Automatically restarting server when code changes |

The technology choices follow these key principles:

1. **JavaScript Everywhere**: Using JavaScript for both frontend and backend makes development easier, allows code sharing, and uses the same package system (npm).

2. **Open-Source Foundation**: All main technologies are free and open-source, which means no licensing costs and active community support.

3. **Industry Standard Tools**: React and Express.js are very popular and widely used, so there's lots of documentation and help available.

4. **Cloud-Ready Architecture**: Docker makes it easy to deploy the app anywhere and scale it up when needed.

## 4.2 Backend Implementation

### 4.2.1 Server Architecture

The backend follows the MVC pattern adapted for REST APIs, with clear separation between routes, controllers, and database operations. The `server.js` file is the starting point of the application:

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5003;

// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:8080',
  'http://localhost:8081',
  process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS: Blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/admin', adminRoutes);
```

The server setup follows these good practices:

- **Environment-Based Configuration**: All passwords and secret settings are stored separately in environment variables for security.
- **CORS Security**: Only allows requests from specific trusted sources to prevent unauthorized access.
- **Middleware Stack**: Processes requests through layers (JSON parsing, security checks) before reaching the actual code.
- **Modular Routing**: API endpoints are organized by topic (auth, restaurants, products, orders) in separate files for better organization.

### 4.2.2 Database Connection and Management

The database connection uses connection pooling for better performance:

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = { query: (text, params) => pool.query(text, params) };
```

Connection pooling helps performance by keeping ready-to-use database connections instead of creating new ones every time. The setup includes:

- Maximum of 20 connections at the same time
- 30-second timeout to close unused connections
- 2-second connection timeout to fail quickly if database is down
- SSL encryption in production but not in development

### 4.2.3 Authentication Implementation

The authentication system uses JWT tokens for secure login and bcrypt for password encryption:

**Registration Flow:**
1. User enters email, password, and chooses role (client or restaurant)
2. Server checks if email is already used
3. Password is encrypted using bcrypt with 10 rounds of hashing
4. User account is created in database
5. JWT token is created and sent back to user

**Login Flow:**
1. User enters email and password
2. Server looks up user in database by email
3. Password is compared with the encrypted version using bcrypt
4. If correct, JWT token is created with user info
5. Token is sent back to user for future requests

**Token Structure:**
```javascript
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};
```

JWT tokens contain user information and allow the server to verify users without storing session data. Tokens expire after 7 days for security.

### 4.2.4 Authorization Middleware

Role-based access control checks if users have permission to access specific features:

```javascript
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token'
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

module.exports = { authenticate, authorize };
```

This middleware makes it easy to protect routes:
```javascript
router.get('/products', authenticate, authorize('restaurant'), getProducts);
```

### 4.2.5 Database Schema Implementation

The database schema has eight main tables:

1. **users**: Stores login information and user roles
2. **restaurants**: Contains restaurant profiles connected to user accounts
3. **categories**: Product categories (Bakery, Meals, Dairy, etc.)
4. **products**: Product listings with prices, quantities, and expiry dates
5. **orders**: Order records with status tracking and commission
6. **order_items**: Individual items in each order
7. **settings**: System settings like commission percentage
8. **password_reset_tokens**: Temporary tokens for resetting passwords

**Key Design Features:**

- **UUID Primary Keys**: Each record has a unique ID that can't be guessed, which is more secure.

- **Enum Types**: PostgreSQL ensures only valid values are used for user roles (`client`, `restaurant`, `admin`), order statuses (`pending`, `preparing`, `ready`, `completed`, `cancelled`), and order types (`pickup`, `delivery`).

- **Cascading Deletes**: When a user is deleted, all their related data (restaurants, products, orders) is automatically removed to keep the database clean.

- **Check Constraints**: Prevents invalid data like negative prices (`CHECK (price >= 0)`) and zero quantities (`CHECK (quantity > 0)`).

- **Indexing Strategy**: Makes common searches faster by creating indexes:
  ```sql
  CREATE INDEX idx_products_restaurant_active ON products(restaurant_id, is_active);
  CREATE INDEX idx_products_expiry_active ON products(expiry_date, is_active);
  CREATE INDEX idx_orders_restaurant_status ON orders(restaurant_id, status);
  ```
  These indexes speed up queries like finding active products for a restaurant or orders by status.

- **Automatic Timestamps**: Updates the `updated_at` field automatically when records change:
  ```sql
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
  END;
  $$ language 'plpgsql';

  CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  ```

## 4.3 Frontend Implementation

### 4.3.1 Application Structure

The React frontend is organized by features for better maintainability:

```
frontend/src/
├── components/        # Reusable UI components
│   ├── Navbar.js
│   ├── ProtectedRoute.js
│   ├── RestaurantDashboardLayout.js
│   └── AdminLayout.js
├── context/          # Global state management
│   ├── AuthContext.js
│   └── CartContext.js
├── pages/            # Page components
│   ├── auth/
│   ├── client/
│   ├── restaurant/
│   └── admin/
├── config.js         # Configuration
└── App.js           # Main app and routing
```

### 4.3.2 Routing and Protected Routes

React Router handles navigation between pages with role-based protection:

```javascript
<Routes>
  {/* Public Routes */}
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/browse" element={<BrowseProducts />} />
  <Route path="/restaurants" element={<RestaurantsMap />} />

  {/* Protected Client Routes */}
  <Route path="/checkout" element={<Checkout />} />
  <Route path="/orders" element={<OrderHistory />} />

  {/* Restaurant Routes - Protected, restaurant role only */}
  <Route
    path="/restaurant/*"
    element={
      <ProtectedRoute allowedRoles="restaurant">
        <RestaurantDashboardLayout />
      </ProtectedRoute>
    }
  >
    <Route path="profile" element={<RestaurantProfile />} />
    <Route path="products" element={<Products />} />
    <Route path="orders" element={<Orders />} />
    <Route path="sales" element={<Sales />} />
  </Route>

  {/* Admin Routes - Protected, admin role only */}
  <Route
    path="/admin/*"
    element={
      <ProtectedRoute allowedRoles="admin">
        <AdminLayout />
      </ProtectedRoute>
    }
  >
    <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="users" element={<AdminUsers />} />
    <Route path="settings" element={<AdminSettings />} />
  </Route>
</Routes>
```

The `ProtectedRoute` component checks if users are logged in and have the right permissions before showing protected pages. If not, it redirects them to login.

### 4.3.3 State Management with Context API

The app uses React's built-in Context API for managing global state instead of external libraries like Redux. This was chosen because the app's state is not too complex.

**AuthContext:**
- Stores current user information and JWT token
- Provides login, logout, and registration functions
- Saves authentication to browser storage (localStorage)
- Automatically adds JWT token to API requests

**CartContext:**
- Manages shopping cart items (add, update, remove)
- Calculates cart totals and item counts
- Ensures cart only has products from one restaurant at a time
- Saves cart to browser storage so it persists when page reloads

### 4.3.4 API Integration

Communication between frontend and backend uses Axios with centralized configuration:

```javascript
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5003/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

This setup ensures:
- All API calls use the same base URL
- JWT token is automatically included in requests
- Users are redirected to login if their session expires
- API calls are simple to make throughout the app


## 4.4 Third-Party Service Integration

### 4.4.1 Cloudinary Image Management

Images are stored using Cloudinary's cloud service:

```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
```

**Upload Flow:**
1. User selects image in the form
2. Multer receives the image and stores it temporarily in memory
3. Backend sends image to Cloudinary
4. Cloudinary returns a URL where the image is stored
5. URL is saved in database (for product images or restaurant logos)

**Benefits:**
- **Fast Delivery**: Images are served from servers close to users around the world
- **Automatic Optimization**: Cloudinary automatically makes images smaller and faster to load
- **No Storage Worries**: We don't need to manage storage on our server
- **Easy Transformations**: Can resize or change images on the fly

### 4.4.2 Email Service with Nodemailer

Email notifications use Nodemailer:

```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Near Expiry - Password Reset Request',
    html: `
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link expires in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  });
};
```

The system supports different email providers (Gmail for development, SendGrid or similar for production) which can be easily changed through settings.

### 4.4.3 Geocoding and Mapping

Restaurant addresses are converted to map coordinates using OpenStreetMap's Nominatim service:

```javascript
const axios = require('axios');

const geocodeAddress = async (address) => {
  try {
    const response = await axios.get(
      'https://nominatim.openstreetmap.org/search',
      {
        params: {
          q: address,
          format: 'json',
          limit: 1,
        },
        headers: {
          'User-Agent': 'NearExpiryApp/1.0',
        },
      }
    );

    if (response.data && response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
    }

    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

module.exports = { geocodeAddress };
```

When restaurants create or update their profiles, the system automatically converts their text address to latitude and longitude coordinates. This allows showing restaurants on an interactive map that customers can explore using Leaflet.

## 4.5 Deployment Implementation with Docker

### 4.5.1 Containerization Strategy

The application uses Docker containers to make deployment easy and consistent:

**Service Composition:**
1. **postgres**: PostgreSQL 15 database container
2. **backend**: Node.js API server container
3. **frontend**: Nginx-served React production build

**Dockerfile for Backend:**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5003
CMD ["node", "server.js"]
```

**Dockerfile for Frontend (Multi-Stage Build):**
```dockerfile
# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

The frontend uses a two-stage build:
1. **Build Stage**: Compiles React application using Node.js
2. **Production Stage**: Copies built files to lightweight Nginx image

This approach makes the final image smaller by not including build tools.

### 4.5.2 Service Dependencies and Health Checks

Docker Compose makes sure services start in the right order:

```yaml
backend:
  depends_on:
    postgres:
      condition: service_healthy
```

The backend waits for PostgreSQL to be ready before starting:

```yaml
postgres:
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U nearexpiry_user -d nearexpiry"]
    interval: 10s
    timeout: 5s
    retries: 5
```

This prevents startup errors by making sure the database is accepting connections before the backend tries to connect.

### 4.5.3 Volume Management

PostgreSQL data is saved even when containers restart using Docker volumes:

```yaml
volumes:
  postgres_data:
    driver: local
```

This volume stores database files on the host machine, so data isn't lost when containers are recreated.

## 4.6 Infrastructure Dependencies

The Near Expiry platform needs several external services to work:

### 4.6.1 External Services

1. **Cloudinary**: Image storage and fast delivery
   - Depends on: Internet connection and Cloudinary service
   - Backup plan: Could use local storage (not currently implemented)
   - Free tier: 25GB storage, 25GB monthly bandwidth

2. **SMTP Email Provider**: Email delivery (Gmail, SendGrid, etc.)
   - Depends on: Email server availability
   - Backup plan: Email sending fails gracefully without breaking the app
   - Free tier: Gmail allows 500 emails/day

3. **Nominatim/OpenStreetMap**: Converting addresses to coordinates and map display
   - Depends on: Nominatim API availability
   - Backup plan: Manual coordinate entry
   - Free tier: Free to use with fair usage

### 4.6.2 Internal Services

1. **PostgreSQL Database**: Main data storage
   - Version: PostgreSQL 15
   - Setup: Connection pooling with 20 max connections
   - Data safety: Docker volume keeps data safe

2. **Node.js Backend**: Application logic and API
   - Version: Node.js 20.x
   - Management: Single process per container (Docker handles restarts)
   - Port: 5003 (internal), mapped to 8000 (accessible from outside)

3. **Nginx Web Server**: Frontend delivery
   - Version: Nginx Alpine
   - Setup: Serves static files, handles SPA routing
   - Port: 80 (internal), mapped to 8080 (accessible from outside)

### 4.6.3 Dependency Diagram

```
[Client Browser]
    ↓
[Nginx Frontend :8080]
    ↓
[Express Backend :8000/api]
    ↓
    ├─→ [PostgreSQL :5432]
    ├─→ [Cloudinary API] (images)
    ├─→ [SMTP Server] (emails)
    └─→ [Nominatim API] (geocoding)
```

## 4.7 Implementation Trade-offs and Design Decisions

Several decisions involved choosing between different options:

### 4.7.1 Single-Restaurant Cart Limitation

**Decision**: Cart can only have items from one restaurant at a time.

**Why**:
- **Simpler Checkout**: Pickup/delivery is specific to one restaurant
- **Easier Commission**: Simpler to calculate commission per order
- **Better User Experience**: Matches what most food delivery apps do

**Trade-off**: Users must finish one order before starting another from a different restaurant

### 4.7.2 Manual Order Status Updates

**Decision**: Restaurant owners manually update order status (pending → preparing → ready → completed).

**Why**:
- **Simpler**: No need for complex automation
- **Restaurant Control**: Owners keep full control over the process
- **Easier Development**: Reduces complexity

**Trade-off**: No automatic notifications or status updates

### 4.7.3 Cloud Image Storage vs. Local Storage

**Decision**: Use Cloudinary for all image storage.

**Why**:
- **Fast Performance**: Global servers mean fast image loading
- **Automatic Optimization**: Cloudinary makes images smaller automatically
- **No Backup Worries**: Cloudinary manages everything
- **Can Handle Growth**: Free tier is generous before any costs

**Trade-off**: Depends on external service; images tied to Cloudinary

### 4.7.4 Context API vs. Redux

**Decision**: Use React Context API instead of Redux for state management.

**Why**:
- **Enough for Our Needs**: App complexity doesn't need Redux
- **Smaller App**: No extra dependencies to download
- **Built Into React**: Uses React's native features

**Trade-off**: Context API can have performance issues with very frequent updates (we didn't see this problem)

### 4.7.5 Docker Deployment vs. Platform-as-a-Service

**Decision**: Use Docker containers instead of deploying to Heroku, Vercel, or similar platforms.

**Why**:
- **Works Anywhere**: Docker containers run the same way everywhere
- **Full Control**: Complete control over server setup
- **Lower Costs**: Can deploy Docker to any cheap VPS, no vendor lock-in

**Trade-off**: More complex initial setup; need to learn Docker

## 4.8 Implementation Assumptions

The implementation makes several assumptions:

### 4.8.1 Technical Assumptions

1. **Modern Browser Support**: Users access the platform with modern browsers (Chrome, Firefox, Safari, Edge) with JavaScript enabled.

2. **Internet Connection**: Continuous internet connection required. No offline mode.

3. **SMTP Access**: Email providers allow SMTP access (Gmail requires app passwords).

4. **Docker Available**: Deployment environments support Docker and Docker Compose.

5. **PostgreSQL Compatibility**: Database server is PostgreSQL 12 or newer with UUID support.

### 4.8.2 Operational Assumptions

1. **Restaurant Inventory Management**: Restaurants manually update product quantities and remove expired items.

2. **Order Fulfillment**: Restaurants prepare orders after receiving them. No payment processing integrated; payment happens at pickup or delivery.

3. **Manual Quality Control**: Admins manually review and moderate restaurants, products, and users.

4. **Free Tier Enough**: Cloudinary free tier (25GB bandwidth) and email free tier (Gmail 500 emails/day) are enough for initial deployment.

5. **Address Accuracy**: Restaurant addresses are accurate and can be recognized by the geocoding service.

### 4.8.3 Business Assumptions

1. **Commission Model**: 10% commission rate (can be changed) is acceptable to restaurants.

2. **Trust Model**: Platform operates on trust that restaurants accurately show expiry dates and quality.

3. **Local Market**: Platform targets local markets where pickup is practical (restaurants and customers are close enough).

4. **No Payment Processing**: Payment is handled directly between customer and restaurant (cash on pickup, etc.), avoiding payment gateway complexity.

---

This detailed implementation chapter explains how the Near Expiry platform was built, covering all the technologies used, how different parts work together, deployment strategy, and the reasons behind key implementation choices.

