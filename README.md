# Blog Platform - Full Stack Web Application

A modern, feature-rich full-stack blog application with robust JWT-based authentication, featuring a Node.js/Express backend and React/Vite frontend. Create, manage, and share blog posts with a secure authentication system.

---

## 📋 Project Overview

**Blog Platform** is a modern, learning and production-ready project demonstrating full-stack development with enterprise-level authentication. The application showcases:

- ✅ User authentication system (Sign-In & Sign-Up)
- ✅ Secure password hashing with bcrypt
- ✅ Stateless JWT session management
- ✅ Refresh token mechanism with httpOnly cookies
- ✅ Blog post creation and management
- ✅ Comment system on posts
- ✅ Category and tag organization
- ✅ User profile management
- ✅ PostgreSQL database integration
- ✅ Rate limiting and security headers
- ✅ Responsive React UI with animated components
- ✅ Modern styling with TailwindCSS

**Current Status:** Phase 2 - Core Authentication Complete (as of 15 April 2026)  
**Next Phase:** Blog Features Implementation (Posts, Comments, Categories)

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js v20
- **Framework**: Express 5.2
- **Database**: PostgreSQL 12+
- **Authentication**: JWT (jsonwebtoken v9.0.3)
- **Password Hashing**: bcrypt 6.0.0
- **Security**: 
  - Helmet 8.1.0 (security headers)
  - Express Rate Limit 8.3.1 (DDoS protection)
  - CORS middleware
- **Development**: Nodemon 3.1.11
- **Module System**: ES6 Modules

### Frontend
- **Library**: React 18.2.0
- **Build Tool**: Vite 5.1.4
- **Routing**: React Router DOM 7.13.2
- **Animation**: Framer Motion 12.34.0
- **Styling**: TailwindCSS 4.2.2 + CSS3
- **Icons**: Lucide React 1.7.0

---

## 🏗️ Architecture

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    USER AUTHENTICATION FLOW                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. User submits email & password (Sign-In or Sign-Up)     │
│     └─► POST /api/login                                    │
│                                                             │
│  2. Backend validates credentials                          │
│     ├─ Sign-In: hash comparison with bcrypt               │
│     └─ Sign-Up: email uniqueness check + hash creation     │
│                                                             │
│  3. Generate JWT Tokens                                    │
│     ├─ Access Token (expires in 1 hour)                   │
│     └─ Refresh Token (httpOnly cookie, expires in 30 days) │
│                                                             │
│  4. Frontend stores Access Token in memory                 │
│     └─► Sent with subsequent requests in Authorization    │
│                                                             │
│  5. Token Refresh Flow                                     │
│     └─► POST /api/refresh (uses httpOnly cookie)           │
│         └─► Returns new Access Token                       │
│                                                             │
│  6. Logout                                                 │
│     └─► GET /api/logout (clears refresh token)             │
└─────────────────────────────────────────────────────────────┘
```

### Backend Structure

```
Backend/
├── index.js                          # Express server setup
├── package.json                      # Dependencies
├── config/
│   └── config.js                     # DB pool & bcrypt salt rounds
├── controllers/
│   └── authController.js             # Auth logic (login, signup, logout)
├── middleware/
│   └── auth.js                       # JWT verification & token refresh
├── routes/
│   ├── index.js                      # Main router
│   └── authRoutes.js                 # Auth endpoints
├── utils/
│   └── tokens.js                     # JWT token generation
└── migrations/                       # Database schema migrations
```

### Frontend Structure

```
Frontend/
├── index.html                        # Entry point
├── package.json                      # Dependencies
├── vite.config.js                    # Vite configuration
└── src/
    ├── main.jsx                      # React DOM render
    ├── app.js                        # Session management & auth logic
    ├── App.jsx                       # Main App component
    ├── App.css                       # App styling
    ├── index.css                     # Global styles
    ├── Login.jsx                     # Login component
    ├── Signup.jsx                    # Signup component
    ├── Dashboard.jsx                 # Protected dashboard
    └── components/
        ├── AnimatedBackground.jsx    # Background animation
        └── CustomCursor.jsx          # Custom cursor effect
```

---

## 📦 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(100) UNIQUE,
    bio TEXT,
    avatar_url VARCHAR(500),
    refresh_token TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_refresh_token ON users(refresh_token);
```

### Blog Posts Table
```sql
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id INT REFERENCES users(id) ON DELETE CASCADE,
    category_id INT,
    views INT DEFAULT 0,
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_published ON posts(published);
```

### Comments Table
```sql
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    post_id INT REFERENCES posts(id) ON DELETE CASCADE,
    author_id INT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_author ON comments(author_id);
```

### Categories Table
```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** v20 or higher
- **npm** or yarn
- **PostgreSQL** 12+ with running service
- **Git** (optional, for version control)

### Backend Setup

1. **Navigate to Backend directory**
   ```bash
   cd Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```bash
   touch .env
   ```

4. **Configure environment variables** (`.env`)
   ```env
   # Server Configuration
   PORT=8000
   NODE_ENV=development

   # JWT Secrets (use strong random strings in production)
   ACCESS_TOKEN_SECRET=your_super_secret_access_token_key_change_this_in_production
   REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_change_this_in_production

   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=auth_db
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password

   # Security
   BCRYPT_ROUNDS=10
   ```

5. **Create PostgreSQL database**
   ```sql
   CREATE DATABASE auth_db;
   ```

6. **Run database migrations** (if using migration tool)
   ```bash
   # Execute the SQL schema from the migrations folder
   psql -U postgres -d auth_db -f migrations/001_create_users_table.sql
   ```

7. **Start development server**
   ```bash
   npm run dev
   ```
   Server will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to Frontend directory**
   ```bash
   cd Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Application will be available at `http://localhost:5173`

---

## 🔌 API Endpoints

### Base URL
- Development: `http://localhost:8000/api`
- Production: `https://your-domain.com/api`

### Authentication Endpoints

#### 1. **Login / Sign-Up**
**POST** `/login`

**Authentication Required:** ❌ No

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "type": "Sign-In"  // or "Sign-Up"
}
```

**Response - Success (200):**
```json
{
  "success": true,
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

**Response - Error (401/400):**
```json
{
  "success": false,
  "message": "User not found" // or "Wrong password"
}
```

**Refresh Token Cookie:** Automatically set as httpOnly cookie
- Name: `refresh_token`
- Max-Age: 30 days
- Secure: true (production), false (development)
- SameSite: strict

---

#### 2. **Get Current User**
**GET** `/me`

**Authentication Required:** ✅ Yes (Bearer Token)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response - Success (200):**
```json
{
  "message": "JWT is working!",
  "user": {
    "userId": 1,
    "email": "user@example.com",
    "iat": 1681234567,
    "exp": 1681238167
  }
}
```

**Response - Error (401/403):**
```json
{
  "message": "No token" // or "Invalid token"
}
```

---

#### 3. **Refresh Access Token**
**POST** `/refresh`

**Authentication Required:** ✅ Yes (Refresh Token Cookie)

**Headers:** None (uses httpOnly cookie automatically)

**Response - Success (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response - Error (401/403):**
```json
{
  "message": "No refresh token" // or "Invalid refresh token"
}
```

---

#### 4. **Logout**
**GET** `/logout`

**Authentication Required:** ✅ Yes (Refresh Token Cookie)

**Headers:** None (uses httpOnly cookie)

**Response - Success (200):**
```json
{
  "message": "Logged Out"
}
```

---

## 🔐 Security Features

### 1. **Password Security**
- Passwords hashed with bcrypt (10 salt rounds)
- Never stored in plaintext
- Secure comparison during login

### 2. **JWT Authentication**
- **Access Token**: Short-lived (1 hour), in-memory storage
- **Refresh Token**: Long-lived (30 days), httpOnly cookie
- Tokens include userId and email (access), userId only (refresh)

### 3. **Cookie Security**
- **httpOnly**: Prevents JavaScript access (XSS protection)
- **Secure**: Only sent over HTTPS (production)
- **SameSite=Strict**: Prevents CSRF attacks

### 4. **Request Security**
- **Helmet.js**: Security headers (CSP, X-Frame-Options, etc.)
- **Rate Limiting**: 100 requests per 15 minutes
- **CORS**: Whitelist frontend origins only

### 5. **Data Validation**
- Email and password validation at middleware level
- Prepared statements for SQL (using pg parameterized queries)

---

## 📝 Environment Variables Reference

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `PORT` | number | 5000 | Server port |
| `NODE_ENV` | string | development | Environment mode |
| `ACCESS_TOKEN_SECRET` | string | required | JWT access token secret |
| `REFRESH_TOKEN_SECRET` | string | required | JWT refresh token secret |
| `DB_HOST` | string | localhost | PostgreSQL host |
| `DB_PORT` | number | 5432 | PostgreSQL port |
| `DB_NAME` | string | auth_db | Database name |
| `DB_USER` | string | postgres | Database user |
| `DB_PASSWORD` | string | required | Database password |
| `BCRYPT_ROUNDS` | number | 10 | Bcrypt salt rounds |

---

## 💻 Available Scripts

### Backend
```bash
# Development server with auto-reload
npm run dev

# Run tests (alias for dev currently)
npm test
```

### Frontend
```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## 🔄 Authentication Flow Walkthrough

### Sign-Up Flow
```
1. User fills signup form (email, password)
   │
2. Frontend sends: POST /api/login
   │  Body: { email, password, type: "Sign-Up" }
   │
3. Backend:
   ├─ Checks if email already exists
   ├─ Hashes password with bcrypt
   ├─ Creates new user in database
   ├─ Generates access & refresh tokens
   └─ Sets refresh_token in httpOnly cookie
   │
4. Frontend:
   ├─ Stores access_token in state/memory
   ├─ Redirect to dashboard
   └─ Cookie automatically sent with future requests
```

### Sign-In Flow
```
1. User fills login form (email, password)
   │
2. Frontend sends: POST /api/login
   │  Body: { email, password, type: "Sign-In" }
   │
3. Backend:
   ├─ Finds user by email
   ├─ Compares password hash (bcrypt.compare())
   ├─ If valid: generates tokens, sets cookie
   └─ If invalid: returns 401 error
   │
4. Frontend handles response
   ├─ On success: stores token, redirects to dashboard
   └─ On error: shows error message
```

### Protected Route Access
```
1. Frontend includes token in request:
   │  GET /api/me
   │  Headers: { Authorization: "Bearer access_token" }
   │
2. Backend middleware (authenticate_token):
   ├─ Extracts token from Authorization header
   ├─ Verifies token signature with ACCESS_TOKEN_SECRET
   ├─ If valid: adds user data to req.user
   └─ If invalid: returns 403 Forbidden
   │
3. Route handler accesses req.user with decoded token data
```

### Token Refresh Flow
```
1. Access token expires (1 hour)
   │
2. Frontend sends: POST /api/refresh
   │  (Cookie automatically included)
   │
3. Backend middleware (cookievalidator):
   ├─ Extracts refresh_token from cookie
   ├─ Verifies token in database (not logged out)
   ├─ Verifies token signature
   └─ Generates new access_token
   │
4. Frontend receives new access_token
   └─ Updates state/memory
```

---

## 🎨 Frontend Features

### Components

**Login.jsx**
- Email and password input fields
- Form validation
- Sign-In / Sign-Up toggle
- Error message display
- Loading state handling

**Signup.jsx**
- Email validation
- Password strength indication
- Duplicate email detection
- Form submission handling

**Dashboard.jsx**
- Protected route (requires valid token)
- User information display
- Logout functionality
- Navigation

**AnimatedBackground.jsx**
- Interactive animated gradient background
- Smooth CSS animations
- Responsive design

**CustomCursor.jsx**
- Custom cursor styling
- Smooth tracking animation
- Enhanced UX

---

## 🐛 Error Handling

### Frontend Error Cases
- Network timeouts
- Invalid credentials
- Duplicate email during signup
- Expired tokens (auto-refresh attempt)
- Missing authorization header

### Backend Error Cases
| Error | Status | Message |
|-------|--------|---------|
| User not found | 401 | "User not found" |
| Wrong password | 401 | "Wrong password" |
| Email exists | 400 | "Email already registered" |
| No token | 401 | "No token" |
| Invalid token | 403 | "Invalid token" |
| No refresh token | 401 | "No refresh token" |
| Rate limit exceeded | 429 | "Too many requests, slow down" |
| Server error | 500 | "Internal server error" |

---

## 📈 Project Roadmap

### ✅ Completed (Phase 1-2)
- [x] User authentication (Sign-In, Sign-Up)
- [x] Password hashing with bcrypt
- [x] JWT token generation and verification
- [x] Refresh token mechanism
- [x] Session management
- [x] Frontend UI components
- [x] Database integration
- [x] Security headers and rate limiting

### 🚧 In Progress / Upcoming (Phase 3+)
- [ ] Blog post creation and editing
- [ ] Rich text editor for posts
- [ ] Comment system implementation
- [ ] Category and tag management
- [ ] User profile pages
- [ ] Post search and filtering
- [ ] Admin dashboard
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Two-factor authentication (2FA)
- [ ] Like/upvote system for posts
- [ ] Bookmark/save posts
- [ ] Social sharing features
- [ ] Unit & integration tests
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Docker containerization
- [ ] CI/CD pipeline setup
- [ ] Production deployment guide

---

## 🧪 Testing (Upcoming)

Future test suite will include:
- Unit tests for authentication logic
- Integration tests for API endpoints
- Frontend component tests
- End-to-end tests with Cypress/Playwright

Run tests with:
```bash
npm test
```

---

## 📚 Best Practices Implemented

1. **Security**
   - Never store sensitive data in localStorage
   - httpOnly cookies for refresh tokens
   - Secure password hashing
   - Rate limiting on endpoints

2. **Code Organization**
   - Separation of concerns (controllers, middleware, routes)
   - Environment configuration
   - Reusable utility functions
   - Error handling

3. **Frontend Architecture**
   - Component-based structure
   - Session state management
   - Protected routes
   - Clean component composition

4. **Database**
   - Parameterized queries (SQL injection prevention)
   - Indexes on frequently queried columns
   - Proper schema design

---

## 🚨 Important Security Notes

### For Production Deployment

1. **Environment Variables**
   - Use strong, unique JWT secrets (min 32 characters)
   - Never commit `.env` files
   - Rotate secrets periodically

2. **CORS Configuration**
   - Update allowed origins for your production domain
   - Remove localhost entries

3. **Certificate & HTTPS**
   - Use SSL/TLS certificates
   - Set `secure: true` in cookie configuration
   - Use HTTPS for all endpoints

4. **Database**
   - Use strong PostgreSQL password
   - Enable encryption at rest
   - Regular backups
   - Connection pooling for scalability

5. **Rate Limiting**
   - Adjust limits based on your usage patterns
   - Consider DDoS protection (Cloudflare, AWS Shield)

6. **Monitoring**
   - Log authentication failures
   - Monitor for suspicious activity
   - Set up alerts for errors

---

## 🤝 Contributing

To contribute to this project:

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

## 📞 Support & Issues

For issues, questions, or suggestions:
- Check existing documentation
- Review error logs
- consult the [troubleshooting section](#) (to be added)

---

## 📄 License

ISC

---

## 👨‍💻 Author

Created as a learning project for full-stack authentication implementation.

---

## 🎯 Key Achievements

✅ Enterprise-level authentication system  
✅ Modern tech stack (React 18, Express 5, PostgreSQL)  
✅ Security best practices implemented  
✅ Clean, maintainable code architecture  
✅ Comprehensive documentation  
✅ Ready for blog feature implementation  
✅ Scalable database design for content management  

---

**Last Updated:** 15 April 2026  
**Status:** Active Development - Blog Features Phase
