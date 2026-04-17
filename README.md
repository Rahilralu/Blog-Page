# Blog Platform

A full-stack blog application with JWT authentication. Users can create posts, write comments, and manage profiles with secure password hashing and token-based sessions.

**Live Demo:** [https://blog-page-rho-indol.vercel.app/](https://blog-page-rho-indol.vercel.app/)

---

## Tech Stack

**Backend:** Node.js v20 · Express 5.2 · PostgreSQL 12 · JWT · bcrypt  
**Frontend:** React 18 · Vite 5.1 · React Router · TailwindCSS

---

## Key Features

- 🔐 JWT authentication with bcrypt password hashing & httpOnly token refresh
- 📝 Blog posts (CRUD) with auto-generated slugs
- 💬 Comment system with full CRUD operations
- 👤 User profiles and analytics
- 🔄 Automatic access token refresh
- 🛡️ Rate limiting, CORS, Helmet headers, protected routes
- 📱 Responsive design with mobile navigation
- ✅ Production-ready codebase

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | Sign-in/sign-up | No |
| POST | `/api/auth/refresh` | Refresh access token | No |
| GET | `/api/auth/me` | Get current user | Yes |
| GET | `/api/auth/logout` | Logout | Yes |
| GET | `/api/posts` | Get all posts | No |
| POST | `/api/posts` | Create post | Yes |
| GET | `/api/posts/:id` | Get post details | No |
| PUT | `/api/posts/:id` | Update post | Yes |
| DELETE | `/api/posts/:id` | Delete post | Yes |
| GET | `/api/comments/:postId` | Get comments | No |
| POST | `/api/comments/:postId` | Add comment | Yes |
| DELETE | `/api/comments/:id` | Delete comment | Yes |

---

## How to Run Locally

**Backend:**
```bash
cd Backend
npm install
cp .env.example .env  # Update DATABASE_URL, JWT secrets
npm run dev
```

**Frontend:**
```bash
cd Frontend
npm install
cp .env.example .env
npm run dev
```

Visit `http://localhost:5173`

---

## Database Schema

```sql
-- Users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  refresh_token VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_users_email ON users(email);

-- Posts
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_slug ON posts(slug);

-- Comments
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
```
