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


# Chapter 3: Design

This chapter explains the design of the Near Expiry platform, including system structure, specifications, design processes, legal considerations, limitations, standards, alternative options, and safety considerations.

## 3.1 Design Overview

### 3.1.1 Solution Architecture

The Near Expiry platform uses a three-layer architecture, which is a well-known design pattern that separates different concerns into presentation, application logic, and data management layers. This design makes the system easier to build, maintain, and scale.

**Architecture Layers:**

**Layer 1: Presentation Layer (Frontend)**
- Technology: React 19.2.3 Single Page Application
- What it does: Shows the user interface, handles user inputs, manages page navigation
- How it talks: Sends requests to the backend through REST API
- How it's deployed: Nginx web server serves the website files

**Layer 2: Application Layer (Backend)**
- Technology: Node.js 20.x with Express.js 5.2.1
- What it does: Handles business rules, checks authentication, validates data, provides API endpoints
- How it talks: Sends SQL queries to database, makes requests to external services
- How it's deployed: Node.js process in Docker container

**Layer 3: Data Layer (Database)**
- Technology: PostgreSQL 15 database
- What it does: Stores data permanently, maintains data relationships, ensures data integrity
- How it talks: Receives SQL queries from the backend
- How it's deployed: PostgreSQL server in Docker container with data saved on disk

**External Services:**
- Cloudinary: Stores images in the cloud and delivers them quickly
- SMTP Server: Sends emails for notifications and password resets
- Nominatim/OpenStreetMap: Converts addresses to map coordinates and provides map displays

### 3.1.2 Problem-Solving Approach

The Near Expiry platform solves the food waste problem by creating a marketplace that gives everyone economic reasons to reduce waste:

**For Restaurants:**
- Problem: Food about to expire means lost money
- Solution: Platform gives restaurants a way to sell these products and get back some money
- Benefit: Less money lost, better inventory management, helps the environment

**For Customers:**
- Problem: Food costs are high, especially for people on a budget
- Solution: Access to good food at big discounts (usually 30-70% off)
- Benefit: Save money, help the environment by making conscious choices

**For Society:**
- Problem: Food waste creates greenhouse gases and wastes resources
- Solution: Platform keeps good food from going to landfills
- Benefit: Less environmental damage, more awareness in the community, better sustainability

### 3.1.3 Detailed System Architecture

**Figure 1: System Architecture Diagram**

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────────┐   │
│  │ Client Pages │  │ Restaurant   │  │  Admin Dashboard    │   │
│  │   (React)    │  │  Dashboard   │  │      (React)        │   │
│  └──────────────┘  └──────────────┘  └─────────────────────┘   │
│           │                │                     │               │
│           └────────────────┴─────────────────────┘               │
│                            │                                     │
│                    ┌───────▼────────┐                           │
│                    │  React Router  │                           │
│                    │  AuthContext   │                           │
│                    │  CartContext   │                           │
│                    └───────┬────────┘                           │
└────────────────────────────┼──────────────────────────────────┘
                             │ HTTPS/HTTP
                             │ JSON API Requests
┌────────────────────────────▼──────────────────────────────────┐
│                      NGINX WEB SERVER                          │
│                   (Static File Serving)                         │
└────────────────────────────┬──────────────────────────────────┘
                             │
┌────────────────────────────▼──────────────────────────────────┐
│                    EXPRESS.JS API SERVER                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Middleware Stack                      │  │
│  │  CORS │ JSON Parser │ Auth Verification │ Role Check    │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      API Routes                          │  │
│  │  /auth │ /products │ /orders │ /restaurants │ /admin    │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                     Controllers                          │  │
│  │  AuthController │ ProductController │ OrderController    │  │
│  └──────────────────────────────────────────────────────────┘  │
└────┬──────────────┬─────────────┬──────────────┬─────────────┘
     │              │             │              │
     │ SQL          │ HTTP        │ SMTP         │ HTTP
     │              │             │              │
┌────▼────┐  ┌──────▼──────┐  ┌──▼────────┐  ┌─▼──────────┐
│PostgreSQL│  │ Cloudinary │  │   SMTP    │  │ Nominatim  │
│ Database │  │  Image CDN │  │   Email   │  │ Geocoding  │
└──────────┘  └────────────┘  └───────────┘  └────────────┘
```

### 3.1.4 User Scenarios

**Scenario 1: Client Discovery and Order Flow**

1. **Discovery Phase:**
   - Customer goes to platform homepage
   - Clicks "Browse Products" or "Restaurant Map"
   - Sees products sorted by expiry date or price
   - Uses filters by category (Bakery, Prepared Meals, Dairy, etc.)

2. **Selection Phase:**
   - Clicks on product to see full details (description, price, expiry date, restaurant)
   - Adds product to cart
   - System checks: product must be from same restaurant as other cart items
   - Continues shopping or goes to cart

3. **Checkout Phase:**
   - Reviews cart: items, quantities, total price
   - Chooses order type: pickup or delivery
   - For delivery: enters address and phone number
   - Submits order

4. **After Order:**
   - Gets order confirmation email
   - Tracks order status: pending → preparing → ready → completed
   - Picks up order at restaurant or gets delivery
   - Can view order history anytime

**Scenario 2: Restaurant Product and Order Management**

1. **Profile Setup:**
   - Restaurant owner creates account with "restaurant" role
   - Fills in profile: name, description, address, phone, logo
   - System converts address to map coordinates automatically

2. **Product Management:**
   - Goes to Products dashboard
   - Adds new product: name, category, description, price, quantity, expiry date
   - Uploads product image (saved in Cloudinary)
   - Product shows up for customers to see

3. **Order Processing:**
   - Gets notification of new order
   - Views order details: items, customer info, delivery/pickup
   - Updates order status to "preparing"
   - When ready, updates status to "ready"
   - Customer picks up or gets delivery
   - Marks order as "completed"

4. **Analytics Review:**
   - Views sales dashboard
   - Looks at revenue by time period (today, week, month, all-time)
   - Reviews charts showing sales trends
   - Sees which products sell best

**Scenario 3: Admin System Management**

1. **User Oversight:**
   - Admin logs into admin dashboard
   - Sees all users (customers, restaurants)
   - Can activate or deactivate accounts
   - Moderates inappropriate content

2. **System Configuration:**
   - Changes commission percentage (default 10%)
   - Views system statistics
   - Monitors platform activity

3. **Analytics:**
   - Reviews total orders, revenue, active restaurants
   - Looks at platform growth trends
   - Creates reports for business planning

## 3.2 Design Details

### 3.2.1 Design Specifications

#### A. Functional Requirements

The Near Expiry platform has these main features:

**FR1: User Authentication and Authorization**
- User registration with email, password, and role choice (customer/restaurant)
- Secure login that creates JWT token
- Password reset through email
- Role-based access control (customer, restaurant, admin)
- Admins can activate/deactivate accounts

**FR2: Restaurant Profile Management**
- Create and edit restaurant profile
- Upload and show logo
- Convert address to map coordinates automatically
- Toggle open/closed status
- Show restaurant on map

**FR3: Product Catalog Management**
- Create, Read, Update, Delete products
- Assign category (Bakery, Prepared Meals, Dairy, Produce, Meat, Frozen, Beverages, Other)
- Upload product images
- Manage price and quantity
- Set expiry date
- Turn products on/off

**FR4: Product Discovery and Browsing**
- Browse all active products from open restaurants
- Search products by name
- Filter by category, restaurant, price range
- Sort by price (low-to-high, high-to-low) or expiry date
- View product details with restaurant information

**FR5: Shopping Cart Management**
- Add products to cart
- Change quantities
- Remove items from cart
- See cart total
- Enforce single-restaurant rule
- Cart saves even when browser closes

**FR6: Order Processing**
- Place order with pickup or delivery choice
- Collect delivery address and phone for delivery orders
- Send order confirmation email
- Track order status (pending, preparing, ready, completed, cancelled)
- View order history for customers
- Manage orders for restaurants

**FR7: Sales Analytics**
- Calculate revenue by time period (today, this week, this month, all-time)
- Show charts with sales trends
- Display order count and total revenue
- Track individual product sales

**FR8: Commission Management**
- Admin can change commission percentage
- Automatic commission calculation on each order
- Track commission in order records

**FR9: Restaurant Mapping**
- Interactive map showing all active restaurants
- Markers show restaurant locations
- Click markers to see restaurant details
- Link to browse restaurant's products

**FR10: Email Notifications**
- Password reset emails with secure link
- Order confirmation emails
- Order status update notifications

#### B. Non-Functional Requirements

**NFR1: Performance**
- API response time: < 500ms for most requests
- Page load time: < 3 seconds on regular internet
- Database made faster through indexing
- Images load quickly via CDN

**NFR2: Scalability**
- Support 100+ users at same time without slowing down
- Handle 1,000+ products across multiple restaurants
- Database handles 20 connections efficiently
- Can scale up by adding more Docker containers

**NFR3: Security**
- Passwords encrypted with bcrypt (10 rounds)
- JWT tokens for secure login with 7-day expiration
- SQL injection prevention through safe queries
- XSS protection through React and input cleaning
- HTTPS required for production
- CORS policy limits who can access

**NFR4: Usability**
- Easy navigation with clear menus
- Works on mobile, tablet, and desktop
- Consistent design across all pages
- Clear error messages
- Good color contrast and readable fonts

**NFR5: Reliability**
- 99% uptime goal
- Database ensures data stays consistent
- Rolls back on errors
- Error handling prevents crashes
- Health checks monitor system

**NFR6: Maintainability**
- Code organized in modules (routes, controllers, components)
- Comments explain complex parts
- Version control with Git
- Settings based on environment
- Docker makes deployment consistent

**NFR7: Availability**
- Platform available 24/7
- Database data survives container restarts
- Containers restart automatically if they fail
- Health checks monitor services


### 3.2.2 Design Process

#### A. Database Design

**Entity-Relationship Model:**

The database design follows third normal form (3NF) to avoid duplicate data and keep data relationships consistent. The main data structures and how they connect:

**Figure 2: Entity-Relationship Diagram**

```
┌──────────────┐          ┌──────────────────┐
│    USERS     │──────────│   RESTAURANTS    │
│              │ 1     1  │                  │
│ • id (PK)    │──────────│ • id (PK)        │
│ • email      │          │ • user_id (FK)   │
│ • password   │          │ • name           │
│ • role       │          │ • address        │
│ • is_active  │          │ • latitude       │
└──────┬───────┘          │ • longitude      │
       │                  └────────┬─────────┘
       │ 1                         │ 1
       │                           │
       │ *                         │ *
┌──────▼───────┐          ┌────────▼─────────┐
│    ORDERS    │          │    PRODUCTS      │
│              │          │                  │
│ • id (PK)    │          │ • id (PK)        │
│ • client_id  │          │ • restaurant_id  │
│ • rest_id    │          │ • category_id    │
│ • total      │          │ • name           │
│ • commission │          │ • price          │
│ • status     │          │ • quantity       │
│ • type       │          │ • expiry_date    │
└──────┬───────┘          └────────┬─────────┘
       │ 1                         │
       │                           │
       │ *                         │ 1
┌──────▼───────┐                   │
│ ORDER_ITEMS  │───────────────────┘
│              │ *
│ • id (PK)    │
│ • order_id   │
│ • product_id │
│ • quantity   │
│ • price      │
└──────────────┘

     ┌──────────────┐
     │  CATEGORIES  │
     │              │
     │ • id (PK)    │
     │ • name       │
     └──────────────┘
```

**Table 2: Database Tables Description**

| Table Name | Purpose | Key Fields | Relationships |
|------------|---------|-----------|---------------|
| **users** | Store user accounts and login info | id (PK), email (UNIQUE), password_hash, role (ENUM), is_active | Connected to restaurants, orders, password_reset_tokens |
| **restaurants** | Restaurant profiles and location | id (PK), user_id (FK→users), name, address, latitude, longitude, logo_url, is_open | Belongs to one user; has many products and orders |
| **categories** | Product categories | id (PK), name (UNIQUE) | Connected to products |
| **products** | Product listings with pricing and expiry | id (PK), restaurant_id (FK→restaurants), category_id (FK→categories), name, price, quantity, expiry_date, is_active | Belongs to one restaurant and one category; connected to order_items |
| **orders** | Order records with status | id (PK), client_id (FK→users), restaurant_id (FK→restaurants), total_amount, commission_amount, status (ENUM), order_type (ENUM) | Belongs to one customer and one restaurant; has many order_items |
| **order_items** | Individual items in orders | id (PK), order_id (FK→orders), product_id (FK→products), quantity, price_at_order | Belongs to one order and links to one product |
| **settings** | System settings | id (PK), key (UNIQUE), value | No direct connections |
| **password_reset_tokens** | Temporary password reset tokens | id (PK), user_id (FK→users), token (UNIQUE), expires_at | Belongs to one user |

**Database Rules:**

- **First Normal Form (1NF)**: All fields have single values; no repeating groups
- **Second Normal Form (2NF)**: All fields depend on the primary key
- **Third Normal Form (3NF)**: No indirect dependencies; fields depend only on primary key

**Making Queries Faster:**

Strategic indexes speed up common searches:

```sql
-- Finding users by email (for login)
CREATE INDEX idx_users_email ON users(email);

-- Finding products by restaurant and active status
CREATE INDEX idx_products_restaurant_active ON products(restaurant_id, is_active);

-- Sorting products by expiry date
CREATE INDEX idx_products_expiry_active ON products(expiry_date, is_active);

-- Finding orders by restaurant and status
CREATE INDEX idx_orders_restaurant_status ON orders(restaurant_id, status);

-- Sorting orders by date
CREATE INDEX idx_orders_created_at ON orders(created_at);
```

Indexes on multiple columns work better than separate indexes for queries that search by multiple fields.

#### B. API Design

The backend provides a REST API that follows standard HTTP rules and uses resource-based URLs.

**Table 7: API Endpoints Summary**

| Endpoint | Method | Authentication | Role | Description |
|----------|--------|----------------|------|-------------|
| `/api/auth/register` | POST | No | Any | Create new account |
| `/api/auth/login` | POST | No | Any | Login (returns JWT token) |
| `/api/auth/forgot-password` | POST | No | Any | Request password reset email |
| `/api/auth/reset-password` | POST | No | Any | Reset password with token |
| `/api/products` | GET | No | Any | Browse all active products |
| `/api/products/:id` | GET | No | Any | Get single product details |
| `/api/restaurants` | GET | No | Any | List all active restaurants |
| `/api/restaurants/map` | GET | No | Any | Get restaurants with map coordinates |
| `/api/categories` | GET | No | Any | List all categories |
| `/api/client/orders` | POST | Yes | Client | Place new order |
| `/api/client/orders` | GET | Yes | Client | Get your order history |
| `/api/restaurant/profile` | GET | Yes | Restaurant | Get your restaurant profile |
| `/api/restaurant/profile` | PUT | Yes | Restaurant | Update restaurant profile |
| `/api/restaurant/products` | GET | Yes | Restaurant | Get your products |
| `/api/restaurant/products` | POST | Yes | Restaurant | Create new product |
| `/api/restaurant/products/:id` | PUT | Yes | Restaurant | Update product |
| `/api/restaurant/products/:id` | DELETE | Yes | Restaurant | Delete product |
| `/api/restaurant/orders` | GET | Yes | Restaurant | Get your orders |
| `/api/restaurant/orders/:id` | PATCH | Yes | Restaurant | Update order status |
| `/api/sales/stats` | GET | Yes | Restaurant | Get sales data |
| `/api/upload/image` | POST | Yes | Restaurant | Upload image to Cloudinary |
| `/api/admin/users` | GET | Yes | Admin | List all users |
| `/api/admin/users/:id` | PATCH | Yes | Admin | Activate/deactivate user |
| `/api/admin/settings` | GET | Yes | Admin | Get system settings |
| `/api/admin/settings` | PUT | Yes | Admin | Update settings (commission) |

**REST Principles Used:**

1. **Resource-Based URLs**: Endpoints represent things (products, orders, users) not actions
2. **HTTP Methods**: Correct use of GET (read), POST (create), PUT/PATCH (update), DELETE (remove)
3. **Stateless**: Each request has all needed information (JWT token, parameters)
4. **JSON Format**: All request and response data uses JSON
5. **Standard Status Codes**: 200 (success), 201 (created), 400 (bad request), 401 (not logged in), 403 (no permission), 404 (not found), 500 (server error)

**Authentication Flow:**

```
Client                          Server
  │                               │
  │  POST /api/auth/login         │
  │  { email, password }          │
  ├──────────────────────────────>│
  │                               │ Check credentials
  │                               │ Create JWT token
  │  { token, user }              │
  │<──────────────────────────────┤
  │                               │
  │  Save token in browser        │
  │                               │
  │  GET /api/restaurant/products │
  │  Authorization: Bearer <token>│
  ├──────────────────────────────>│
  │                               │ Verify token
  │                               │ Check role
  │  { products: [...] }          │
  │<──────────────────────────────┤
```

#### C. Frontend Design

**Component Structure:**

The React frontend is organized like a tree:

```
App (Main)
├── AuthProvider (Login state)
├── CartProvider (Cart state)
├── Navbar (Top menu)
└── Routes
    ├── Public Pages
    │   ├── Login
    │   ├── Register
    │   ├── BrowseProducts
    │   ├── RestaurantsMap
    │   ├── ProductDetail
    │   └── Cart
    ├── Client Pages (Need login)
    │   ├── Checkout
    │   ├── OrderHistory
    │   └── OrderDetails
    ├── Restaurant Pages (Restaurant role only)
    │   ├── RestaurantProfile
    │   ├── Products
    │   ├── ProductForm
    │   ├── Orders
    │   └── Sales
    └── Admin Pages (Admin role only)
        ├── Dashboard
        ├── Users
        ├── Restaurants
        ├── Settings
        └── Analytics
```

**State Management:**

1. **Local State**: For page-specific things (form inputs, popups, loading indicators)
2. **Context API**: For app-wide state (login info, shopping cart)
3. **No Redux**: App isn't complex enough to need Redux

**Routing:**

- Client-side page navigation with React Router
- Protected routes check login and role before showing page
- Automatic redirect to login for unauthorized access
- Different menus for different user roles

**Responsive Design:**

- Mobile-first CSS design
- Uses Flexbox and Grid for layouts
- Media queries for different screen sizes: mobile (<768px), tablet (768-1024px), desktop (>1024px)
- Touch-friendly buttons for mobile

#### D. Third-Party Integration Design

**Cloudinary Image Management:**

**Upload Process:**
1. User selects image file in form
2. Frontend sends image to `/api/upload/image`
3. Multer middleware catches file and stores in memory temporarily
4. Backend sends to Cloudinary
5. Cloudinary returns URL
6. Backend sends URL back to frontend
7. Frontend saves URL in database

**Image Optimization:**
- Automatic format selection (WebP for newer browsers, JPEG for older)
- Quality adjustment for best size/quality balance
- Lazy loading (images load when user scrolls to them)
- CDN caching for fast loading worldwide

**Email System:**

**Nodemailer Setup:**
```javascript
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App password for Gmail
  },
});
```

**Email Types:**
- HTML-formatted emails with consistent look
- Password reset: includes time-limited link
- Order confirmation: lists items, total, pickup/delivery details
- Order status updates: notifies when status changes

**Geocoding:**

**Converting Address to Coordinates:**
```javascript
const geocodeAddress = async (address) => {
  const response = await axios.get(
    'https://nominatim.openstreetmap.org/search',
    {
      params: { q: address, format: 'json', limit: 1 },
      headers: { 'User-Agent': 'NearExpiryApp/1.0' },
    }
  );
  return {
    latitude: parseFloat(response.data[0].lat),
    longitude: parseFloat(response.data[0].lon),
  };
};
```

**Map Display:**
- Leaflet library creates interactive map
- OpenStreetMap provides free map images
- Custom markers for restaurant locations
- Click markers to see restaurant info and browse products

### 3.2.3 Legal Aspects

The Near Expiry platform works within several legal frameworks:

**A. Data Protection and Privacy**

While Jordan doesn't yet have laws like GDPR, the platform follows good privacy practices:

- **Minimal Data Collection**: Only collects necessary data (email, password, contact info)
- **Secure Storage**: Passwords are encrypted (never stored as plain text)
- **User Consent**: Signing up means agreeing to data processing
- **No Sharing**: User data isn't sold or shared with others
- **Right to Delete**: Users can request account deletion (done by admin)

**B. Food Safety Regulations**

- **Disclaimer**: Platform includes warnings to inspect products before buying
- **Restaurant Responsibility**: Restaurants are responsible for accurate expiry dates
- **Marketplace Model**: Platform acts as marketplace, not food seller, limiting legal responsibility
- **Compliance**: Restaurants must follow Jordan Ministry of Health food regulations

**C. E-Commerce and Consumer Protection**

- **Clear Pricing**: All prices shown clearly before purchase
- **Order Confirmation**: Users get confirmation with order details
- **Refund Policy**: Handled directly between customer and restaurant
- **Terms of Service**: Platform should publish terms explaining user responsibilities and liability limits

**D. Intellectual Property**

- **Open Source**: All technologies use free licenses (MIT, PostgreSQL License) allowing commercial use
- **Cloudinary Terms**: Free tier usage follows Cloudinary terms
- **User Content**: Users give platform permission to display uploaded images
- **Trademark**: "Near Expiry" name and logo should be registered

**E. Commission Model**

- **Service Fee**: 10% commission is a service fee, not an employment relationship
- **Independent Restaurants**: Restaurants work independently, not as employees
- **Taxes**: Platform and restaurants handle their own tax obligations

### 3.2.4 Design Constraints

**A. Technical Constraints**

1. **Browser Support:**
   - Must work on Chrome, Firefox, Safari, Edge (latest 2 versions)
   - No Internet Explorer support
   - JavaScript required (no backup for disabled JavaScript)

2. **Database Limits:**
   - Uses PostgreSQL-specific features (ENUM types, UUID, advanced indexing)
   - Maximum 20 concurrent connections
   - No distributed database in current design

3. **Third-Party Service Limits:**
   - Cloudinary: 25GB storage, 25GB bandwidth (free tier)
   - Nominatim: 1 request per second limit
   - Gmail SMTP: 500 emails per day limit

4. **Performance Limits:**
   - Single-server deployment (no load balancing initially)
   - Image uploads limited to 5MB to prevent memory problems
   - Address geocoding blocks request while processing

**B. Business Constraints**

1. **Commission Model:**
   - Fixed percentage commission (can be changed, default 10%)
   - No online payment (manual payment at pickup/delivery)
   - Single-restaurant cart limitation

2. **Manual Processes:**
   - Order status updates done manually by restaurants
   - No automatic inventory reduction
   - No automatic expiry date alerts

3. **Geographic Scope:**
   - Designed for local markets (single city/region)
   - Pickup model assumes restaurants and customers are nearby
   - No support for multiple regions with different currencies or languages

**C. Development Constraints**

1. **Team and Timeline:**
   - Solo developer or small team
   - 15-week semester timeline
   - Limited budget (using free services)

2. **Technology Knowledge:**
   - Assumes developer knows JavaScript
   - No mobile app (website only)

3. **Testing Constraints:**
   - Mostly manual testing
   - Limited automated tests
   - No formal QA process

**D. Security Constraints**

1. **Authentication:**
   - JWT tokens stored in browser localStorage (could be vulnerable to XSS if exploited)
   - No OAuth or two-factor authentication
   - Password strength not enforced (depends on user choice)

2. **HTTPS Requirement:**
   - Production needs HTTPS for secure data transmission
   - All resources must use HTTPS (no mixing HTTP and HTTPS)

3. **Input Validation:**
   - Server must validate all inputs
   - File upload restrictions (type, size)

**E. Regulatory Constraints**

1. **Food Safety:**
   - Must clearly show expiry dates
   - Disclaimers about product inspection
   - Restaurant licensing checked manually by admin

2. **Local Business Compliance:**
   - Restaurants must have valid operating licenses
   - Must follow Jordan food service regulations
   - Tax registration for business operations


### 3.2.5 Design Standards

The Near Expiry platform follows multiple industry and international standards:

**A. Software Engineering Standards**

**IEEE Standards:**
- **IEEE 730**: Software Quality Assurance - planning quality, reviews, testing
- **IEEE 1016**: Software Design Descriptions - documenting system design
- **IEEE 829**: Software Test Documentation - planning and reporting tests

**B. Web Standards**

**W3C Standards:**
- **HTML5**: Modern markup language, latest web features
- **CSS3**: Styling, responsive design, animations
- **WCAG 2.1**: Web Content Accessibility Guidelines (partly followed)
  - Good color contrast for readability
  - Keyboard navigation support
  - Alt text for images (to be added)

**C. API and Protocol Standards**

**REST API Standards:**
- **HTTP/1.1**: Standard web protocol (RFC 2616)
- **JSON**: Data format (RFC 8259)
- **JWT**: Secure tokens for authentication (RFC 7519)

**D. Database Standards**

- **SQL:2016**: PostgreSQL follows SQL standard
- **ACID Properties**: Ensures data stays consistent (Atomicity, Consistency, Isolation, Durability)
- **ISO/IEC 9075**: SQL standard compliance

**E. Security Standards**

**OWASP Top 10 Protection:**
1. **Injection**: Safe queries prevent SQL injection
2. **Broken Authentication**: JWT tokens with expiration, encrypted passwords
3. **Sensitive Data Exposure**: HTTPS encryption, password hashing
4. **XML External Entities**: Not applicable (JSON-only API)
5. **Broken Access Control**: Role-based checks enforce permissions
6. **Security Misconfiguration**: Environment-based settings, minimum privileges
7. **XSS**: React automatic protection, input cleaning
8. **Insecure Deserialization**: JSON parsing with validation
9. **Known Vulnerabilities**: Regular dependency updates
10. **Insufficient Logging**: Error logging, access logging

**F. Code Quality Standards**

- **ESLint**: JavaScript code checking for consistency
- **Prettier**: Code formatting standardization
- **JSDoc**: Function documentation comments
- **Git Commit Conventions**: Clear commit messages

### 3.2.6 Design Alternatives

Several different approaches were considered during design:

**Table 3: Design Alternatives Analysis**

| Decision Point | Alternatives Considered | Selected Choice | Rationale |
|----------------|------------------------|-----------------|-----------|
| **Frontend Framework** | React, Vue.js, Angular, Svelte | **React** | Biggest community, lots of tools, widely used, good for job market |
| **Backend Framework** | Express.js, Django, Spring Boot, Laravel, NestJS | **Express.js** | Lightweight, flexible, JavaScript everywhere, fast development |
| **Database** | PostgreSQL, MySQL, MongoDB, Firebase | **PostgreSQL** | Reliable for financial data, advanced features, strong community |
| **Authentication** | JWT, OAuth 2.0, Session-based, Firebase Auth | **JWT** | Works anywhere, mobile-ready, standard, no server sessions |
| **Image Storage** | Local files, AWS S3, Cloudinary, Firebase Storage | **Cloudinary** | Good free tier, automatic optimization, CDN included, simple |
| **Deployment** | Heroku, AWS EC2, DigitalOcean, Docker, Vercel | **Docker** | Works same everywhere, portable, supports full stack |
| **State Management** | Context API, Redux, MobX, Zustand, Recoil | **Context API** | Built into React, good enough for our needs, simpler |
| **Styling** | CSS Modules, Styled Components, Tailwind, Plain CSS | **Plain CSS** | No extra complexity, standard, sufficient, easier to learn |
| **Email Service** | Nodemailer + Gmail, SendGrid, Mailgun, AWS SES | **Nodemailer + Gmail** | Free for development, easy setup, can switch providers later |
| **Maps** | Google Maps, Mapbox, Leaflet + OSM | **Leaflet + OSM** | No API key needed, no limits, free, open-source |

**Why These Choices:**

**1. Frontend: React vs. Vue.js vs. Angular**

*Vue.js Good points:* Easier to learn, simpler syntax, good docs
*Vue.js Bad points:* Smaller job market, fewer big projects using it

*Angular Good points:* Full-featured, TypeScript built-in, used by big companies
*Angular Bad points:* Harder to learn, strict structure, bigger file size

*React Good points:* Huge community, reusable components, widely used in industry, many job opportunities
*React Bad points:* Need extra libraries for some features (but many available)

**Decision:** React's huge community and job market advantages outweigh the slightly harder learning curve compared to Vue.

**2. Backend: Express.js vs. Django vs. Spring Boot**

*Django Good points:* Includes many features, excellent admin panel, good database tools
*Django Bad points:* Need to learn Python, more strict structure

*Spring Boot Good points:* Enterprise-grade, robust, type safety with Java
*Spring Boot Bad points:* Complex, verbose code, slower development

*Express.js Good points:* JavaScript for everything, lightweight, flexible, fast development
*Express.js Bad points:* Need to add components manually (not all-in-one)

**Decision:** Using JavaScript everywhere makes development easier and enables code sharing.

**3. Database: PostgreSQL vs. MySQL vs. MongoDB**

*MySQL Good points:* Widely supported by hosting providers, slightly simpler than PostgreSQL
*MySQL Bad points:* Fewer advanced features, less good JSON support

*MongoDB Good points:* Flexible schema, good for scaling horizontally, JSON-native
*MongoDB Bad points:* Less strict consistency, not ideal for financial data (orders, money)

*PostgreSQL Good points:* Reliable for transactions, advanced features, excellent documentation
*PostgreSQL Bad points:* Slightly more complex than MySQL

**Decision:** Need ACID properties for orders and commission tracking; PostgreSQL's advanced features help future growth.

### 3.2.7 Safety Considerations

**A. User Safety**

1. **Food Safety:**
   - **Clear Expiry Dates**: All products show expiry date clearly
   - **Inspection Disclaimer**: Platform encourages customers to inspect products
   - **Restaurant Accountability**: Terms make restaurants responsible for food safety
   - **Quality Concerns**: Users can contact restaurant; admin can deactivate bad restaurants

2. **Data Security:**
   - **Password Protection**: Bcrypt prevents password exposure if database breached
   - **Token Expiration**: JWT tokens expire after 7 days, limiting damage if stolen
   - **Secure Communication**: HTTPS required for production (encrypts data)
   - **Minimal Data**: Platform only collects essential data

3. **Transaction Safety:**
   - **Order Confirmation**: Email provides record of transaction
   - **Status Tracking**: Users can monitor order progress
   - **No Payment Data Stored**: Platform doesn't handle payment, eliminating breach risk

**B. Development Team Safety**

1. **Version Control:**
   - **Git Repository**: All code versioned, no direct production edits
   - **Branches**: Feature branches prevent breaking main code
   - **Rollback**: Can go back to previous stable versions

2. **Code Reviews:**
   - **Peer Review**: Code changes reviewed before deployment (if team project)
   - **Security Focus**: Extra attention on authentication and payment code

3. **Testing Environments:**
   - **Separate Dev/Staging/Production**: Prevents accidental production changes
   - **Test Data**: Staging uses fake data

**C. System Safety**

1. **Input Validation:**
   - **SQL Injection Prevention**: Safe queries only
   - **XSS Protection**: React auto-protects, plus input cleaning
   - **File Upload Restrictions**: Type checking (images only), size limits (5MB)
   - **Email Validation**: Checks email format

2. **Error Handling:**
   - **Graceful Degradation**: System keeps working when external services fail
   - **User-Friendly Messages**: Technical errors translated to understandable messages
   - **Error Logging**: All errors logged for debugging without exposing details to users

3. **Backup Strategy:**
   - **Database Backups**: Docker volume keeps data safe
   - **Regular Snapshots**: Production database should be backed up daily
   - **Disaster Recovery**: Documented restore procedures

4. **Monitoring:**
   - **Health Endpoint**: `/health` endpoint checks if service is working
   - **Database Health**: Docker checks ensure database availability
   - **Error Logging**: Console logging (can add external logging service later)

### 3.2.8 Design Considerations Table

The following table addresses all relevant design considerations:

**Table 3: Design Considerations**

| Design Consideration | How It Applies to This Project | Where in Report |
|---------------------|-------------------------------|-----------------|
| **Performance** | API responses target <500ms through database indexes on frequently searched fields (products.restaurant_id, orders.status); Images optimized via Cloudinary CDN for faster page loads; Pagination for large lists; Connection pooling (20 connections) prevents database slowdowns | Chapter 3.2.1 (Requirements); Chapter 4.2.2 (Database Connection); Chapter 3.2.2.D (Images) |
| **Serviceability** | Code organized in modules (routes, controllers, services) makes maintenance easier; Docker containers ensure same deployment everywhere; Database scripts allow updates without downtime; Error logging helps debugging; Settings based on environment allow easy changes | Chapter 4.2 (Backend); Chapter 4.5 (Docker); Chapter 3.2.7.C (System Safety); Chapter 3.2.1.B (Maintainability) |
| **Economic** | Zero-cost technologies (free React, Express, PostgreSQL, Docker); Free cloud services (Cloudinary 25GB, Gmail 500 emails/day); Low hosting costs with cheap VPS (~$5-20/month); Commission-based income (10% default) creates revenue; No payment gateway fees initially | Chapter 6.1 (Cost); Chapter 3.2.4.C (Development Limits); Chapter 4.4.1 (Cloudinary Free Tier) |
| **Environmental** | **Main Goal**: Platform directly addresses food waste by preventing good food from landfills; Estimated impact: Could save tons of food annually at scale; **Other Benefits**: Reduces greenhouse gases from decomposing food waste; Lower carbon footprint by using food already produced; Digital platform eliminates physical marketing waste (flyers, print ads) | Chapter 1.1 (Problem); Chapter 2.1 (Food Waste); Chapter 6.4 (Environment); Chapter 8 (Conclusion) |
| **Environmental Sustainability** | Core mission prevents food waste supporting UN Goal 12.3 (halve food waste by 2030); Platform promotes sustainable eating by giving "imperfect" or near-expiry food a second chance; Uses energy-efficient cloud services (Cloudinary); Encourages local pickup over long-distance transportation, reducing delivery emissions; Raises awareness about food expiry dates vs. "best before" dates | Chapter 2 (Background); Chapter 6.4 (Environment); Chapter 8.1 (Contributions) |
| **Manufacturability** | Software "manufacturing" through Docker ensures same build every time; Multi-stage Docker build makes frontend smaller; Can add automated testing and deployment (GitHub Actions); Can scale by adding more containers; Database design supports data growth without restructuring | Chapter 4.5 (Docker); Chapter 3.2.2.A (Database); Chapter 3.2.6 (Alternatives: Docker) |
| **Ethical** | **Transparency**: Expiry dates clearly shown; no hidden fees; **Fairness**: Commission (10%) is adjustable and lower than typical delivery apps (20-30%); **Privacy**: Minimal data collection, no selling user data, secure password storage; **Honesty**: Accurate product representation enforced through admin moderation; **Food Safety**: Disclaimers protect users while empowering restaurants to sell safely | Chapter 3.2.3 (Legal); Chapter 6.2 (Ethics Codes); Chapter 6.3 (Ethical Dilemmas); Chapter 3.2.7.A (User Safety) |
| **Health and Safety** | **Food Safety**: Clear expiry dates on all products; disclaimer encourages inspection before purchase; **Account Protection**: Secure authentication prevents unauthorized access; **Data Encryption**: Passwords encrypted with bcrypt; HTTPS encryption in production; **Attack Prevention**: Input validation prevents security vulnerabilities (SQL injection, XSS); **No Payment Data**: Not storing payment info reduces breach risk | Chapter 3.2.7.A (User Safety); Chapter 4.2.3 (Authentication); Chapter 3.2.5.E (Security); Chapter 3.2.3.B (Food Safety) |
| **Social** | **Helps Low-Income People**: Provides quality food at 30-70% discount, addressing food affordability challenges; **Environmental Awareness**: Helps conscious consumers reduce personal food waste; **Supports Local Businesses**: Helps small restaurants and bakeries recover costs, supporting local economy; **Community Awareness**: Educates users about food waste and safe consumption of near-expiry products; **Job Creation**: Platform creates work opportunities (customer service, admin, future delivery partners) | Chapter 1.1 (Motivation); Chapter 2.3 (Target Market); Chapter 6.5 (Social Relevance); Chapter 8.1 (Impact) |
| **Political** | **National Goals**: Supports Jordan's sustainability and food security initiatives; **Regulatory Compliance**: Follows local food safety regulations and business licensing; **Economic Independence**: All services can be hosted within Jordan; **Local Economy**: Keeps food economy local rather than importing solutions; **Technology**: Shows Jordan's capability in tech innovation, supporting national IT sector | Chapter 2.1 (Jordan Context); Chapter 3.2.3 (Legal); Chapter 6.5 (Political Relevance); Chapter 8.2 (Regional Expansion) |

---

This complete design chapter provides detailed specifications, architectural decisions, standards followed, alternative options, and safety considerations. The design serves as the blueprint for the implementation described in Chapter 4 and sets the foundation for the results shown in Chapter 5.

