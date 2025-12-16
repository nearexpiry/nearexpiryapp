# JWT Authentication Implementation

This document describes the JWT authentication system that has been implemented for the Near Expiry application.

## Backend Implementation

### 1. JWT Utilities (`/backend/utils/jwt.js`)
- `generateToken(userId, role)`: Creates JWT tokens with user ID and role
- `verifyToken(token)`: Verifies and decodes JWT tokens

### 2. Authentication Middleware (`/backend/middleware/auth.js`)
- `verifyToken`: Middleware to verify JWT tokens and attach user info to requests
- `roleCheck(allowedRoles)`: Middleware to check if user has required role(s)

### 3. Email Service (`/backend/utils/emailService.js`)
- `sendPasswordResetEmail(email, resetToken)`: Sends password reset emails with reset link
- `sendWelcomeEmail(email, name)`: Optional welcome email functionality

### 4. Auth Controller (`/backend/controllers/authController.js`)
- `register(req, res)`: Register new users (client or restaurant only)
- `login(req, res)`: Authenticate users and return JWT token
- `forgotPassword(req, res)`: Generate reset token and send email
- `resetPassword(req, res)`: Validate token and update password
- `getCurrentUser(req, res)`: Get authenticated user details

### 5. Auth Routes (`/backend/routes/authRoutes.js`)
- `POST /api/auth/register`: User registration
- `POST /api/auth/login`: User login
- `POST /api/auth/forgot-password`: Request password reset
- `POST /api/auth/reset-password`: Reset password with token
- `GET /api/auth/me`: Get current user (protected)

### Input Validation
- Email must be valid format
- Password must be at least 8 characters
- Role must be 'client' or 'restaurant' (admin cannot register via API)
- Password hashing uses bcryptjs with 10 rounds

## Frontend Implementation

### 1. Auth Context (`/frontend/src/context/AuthContext.js`)
- Manages authentication state (user, token, isAuthenticated)
- Provides authentication functions: `register`, `login`, `logout`, `forgotPassword`, `resetPassword`
- Stores token in localStorage
- Axios interceptor adds token to all requests
- Automatically handles 401 errors and logs out user

### 2. Protected Route Component (`/frontend/src/components/ProtectedRoute.jsx`)
- Redirects to `/login` if not authenticated
- Supports role-based access control with `allowedRoles` prop
- Shows loading state while checking authentication

### 3. Pages
- **Login** (`/frontend/src/pages/Login.jsx`): User login form
- **Register** (`/frontend/src/pages/Register.jsx`): Registration form with role selection
- **ForgotPassword** (`/frontend/src/pages/ForgotPassword.jsx`): Request password reset
- **ResetPassword** (`/frontend/src/pages/ResetPassword.jsx`): Reset password with token from email
- **Home** (`/frontend/src/pages/Home.jsx`): Protected home page showing role-specific content

### 4. Navbar Component (`/frontend/src/components/Navbar.jsx`)
- Shows login/register buttons when not authenticated
- Shows user email, role, and logout button when authenticated

### 5. Routing (`/frontend/src/App.js`)
- Public routes: `/login`, `/register`, `/forgot-password`, `/reset-password`
- Protected routes: `/` (home)
- Easy to add more role-based protected routes

## Testing the Authentication Flow

### Prerequisites
1. Ensure PostgreSQL database is running
2. Database should be initialized with the schema (`npm run db:init` in backend)

### Backend Setup
```bash
cd backend
npm install  # Already done - packages are installed
# Ensure .env file has correct DATABASE_URL and JWT_SECRET
npm start    # or npm run dev for development
```

### Frontend Setup
```bash
cd frontend
npm install  # Already done - packages are installed
# Ensure .env file has REACT_APP_API_URL=http://localhost:5000/api
npm start
```

### Test Scenarios

#### 1. User Registration
1. Navigate to http://localhost:3000/register
2. Select account type (Client or Restaurant)
3. Enter email and password (min 8 characters)
4. Click Register
5. Should be automatically logged in and redirected to home

#### 2. User Login
1. Navigate to http://localhost:3000/login
2. Enter registered email and password
3. Click Login
4. Should be logged in and redirected to home

#### 3. Token Persistence
1. After logging in, refresh the page
2. Should remain logged in (token stored in localStorage)
3. User info should be displayed in navbar

#### 4. Protected Routes
1. Without logging in, try to access http://localhost:3000/
2. Should be redirected to /login
3. After logging in, should be able to access home page

#### 5. Password Reset Flow
1. Navigate to http://localhost:3000/forgot-password
2. Enter email address
3. Click Send Reset Link
4. Check email for reset link (requires email configuration)
5. Click link in email or manually navigate to reset page with token
6. Enter new password
7. Submit and should be redirected to login

#### 6. Logout
1. While logged in, click Logout in navbar
2. Should be logged out and token removed
3. Should be redirected to login page

#### 7. Role-Based Access
1. Register/login as different roles (client vs restaurant)
2. Home page should show different content based on role
3. Can add role-specific routes using ProtectedRoute with allowedRoles prop

### API Testing with curl

#### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "client@example.com",
    "password": "password123",
    "role": "client"
  }'
```

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "client@example.com",
    "password": "password123"
  }'
```

#### Get Current User
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Forgot Password
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "client@example.com"
  }'
```

#### Reset Password
```bash
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "RESET_TOKEN_FROM_EMAIL",
    "newPassword": "newpassword123"
  }'
```

## Security Features

1. **Password Hashing**: Passwords are hashed using bcryptjs with 10 rounds
2. **JWT Tokens**: Secure token-based authentication with configurable expiration
3. **Token Verification**: Every protected request verifies the token
4. **Active User Check**: Middleware checks if user account is active
5. **Role-Based Access**: Easy to restrict routes by user role
6. **Password Reset Security**:
   - Tokens are hashed before storage
   - Tokens expire after 1 hour
   - Used tokens are deleted
   - Generic success messages (security through obscurity)
7. **Input Validation**: Email format and password strength validation

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://username:password@localhost:5432/nearexpiry
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Next Steps

1. **Configure Email**: Update EMAIL_* variables in backend/.env for password reset emails
2. **Update Database URL**: Set correct PostgreSQL connection string
3. **Change JWT Secret**: Use a strong random secret in production
4. **Add More Routes**: Create role-specific dashboards and features
5. **Enhance Security**: Add rate limiting, CSRF protection, etc.
6. **Error Handling**: Add more detailed error messages and logging
7. **Testing**: Write unit and integration tests

## File Structure

```
backend/
├── controllers/
│   └── authController.js       # Auth logic
├── middleware/
│   └── auth.js                 # JWT verification middleware
├── routes/
│   └── authRoutes.js           # Auth endpoints
├── utils/
│   ├── jwt.js                  # JWT token utilities
│   └── emailService.js         # Email sending
└── server.js                   # Updated with auth routes

frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Navigation with auth
│   │   ├── Navbar.css
│   │   └── ProtectedRoute.jsx  # Route protection
│   ├── context/
│   │   └── AuthContext.js      # Auth state management
│   ├── pages/
│   │   ├── Home.jsx            # Protected home page
│   │   ├── Home.css
│   │   ├── Login.jsx           # Login page
│   │   ├── Register.jsx        # Registration page
│   │   ├── ForgotPassword.jsx  # Password reset request
│   │   ├── ResetPassword.jsx   # Password reset form
│   │   └── Auth.css            # Shared auth styles
│   └── App.js                  # Updated with routing
```

## Notes

- Admin users cannot register via the API - they must be created directly in the database
- Email service is optional for development but required for password reset in production
- Tokens are stored in localStorage - consider using httpOnly cookies for production
- All auth pages have consistent styling using Auth.css
- The system is ready for expansion with additional features
