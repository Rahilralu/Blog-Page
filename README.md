# JWT Authentication System

This project implements a full‑stack authentication system using a Node.js/Express backend and a React/Vite frontend. The system combines bcrypt password hashing, PostgreSQL database queries, and JWT-based session authentication for secure user login and registration.

---

## ✅ Work Completed (as of 12 March 2026)

### Phase 1: Core Authentication (7 March 2026)

1. **Backend fundamentals**
   - Created `index.js` to start the Express server with CORS and JSON parsing.
   - Added configuration helpers in `config/config.js` (database pool, salt rounds, etc.).
   - Established a PostgreSQL connection via `pg.Pool`.

2. **Authentication middleware (`middleware/middleware.js`)**
   - Developed `login_credential` handler covering both **Sign‑In** and **Sign‑Up** flows:
     - `Sign‑In`: look up user by email, compare submitted password using `bcrypt.compare`.
     - `Sign‑Up`: check for existing email, hash new password with configured `saltRounds`, insert user record.
   - Returns appropriate status codes and JSON responses (`success`, `output` flags).
   - Includes error catching and 500 responses on exceptions.

3. **Routing (`routes/routes.js`)**
   - Mapped endpoints such as `/login` to the authentication middleware.
   - Prepared for future additions like `/register`, `/logout`, and protected routes.

4. **Frontend scaffold**
   - Bootstrapped a Vite/React application under `Frontend/`.
   - Created `Login.jsx`, `Signup.jsx`, and `Dashboard.jsx` components.
   - Added animated background and custom cursor components for polish.
   - Implemented basic form UI and wiring to backend endpoints.

5. **Project organization & tooling**
   - Added environment variable handling with `dotenv`.
   - Configured `npm run dev` scripts using `nodemon` for backend and Vite for frontend.
   - Documented setup steps in README.

### Phase 2: JWT Token Implementation (12 March 2026)

6. **JWT authentication middleware**
   - Implemented `authenticate_token` middleware:
     - Extracts JWT from `Authorization` header (Bearer token format).
     - Verifies token signature using `process.env.ACCESS_TOKEN_SECRET`.
     - Returns 403 on invalid/expired tokens, 400 if token is missing.
     - Attaches decoded user info to `req.user` for downstream routes.
   - Implemented `json_web_token` function:
     - Generates JWT tokens after successful login/signup.
     - Encodes username in token payload.
     - Signs with `ACCESS_TOKEN_SECRET` from environment.

7. **Session authentication flow**
   - Tokens are now generated on successful authentication.
   - Protected routes can use `authenticate_token` middleware to verify sessions.
   - Stateless session management via JWT (no server-side session store needed).

---

## 🔧 Environment Setup

### Backend
```bash
cd Backend
npm install
npm run dev       # starts server on http://localhost:8000
```

Create a `.env` file in `Backend`:
```env
PORT=8000
ACCESS_TOKEN_SECRET=your_jwt_secret_key_here
BCRYPT_ROUNDS=10
DATABASE_URL=postgres://user:pass@host:port/dbname
```

### Frontend
```bash
cd Frontend
npm install
npm run dev       # runs on http://localhost:5173
```

---

## 🧱 Current API Endpoints (Implemented)

| Method | Route     | Auth Required | Description                     |
|--------|-----------|---------------|---------------------------------|
| POST   | `/login`  | ❌ No         | Accepts JSON `{email,password,type}`. Handles both sign‑in and sign‑up. Returns JWT token on success. |
| GET    | `/protected` | ✅ Yes (Bearer Token) | Example protected endpoint; requires valid JWT in Authorization header. |

### Login/Signup Flow

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "type": "Sign-In"
}
```

**Successful Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Protected Endpoint Request:**
```bash
GET /protected HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📦 Tech Stack

| Backend          | Frontend      |
|------------------|---------------|
| Node.js v20      | React 18      |
| Express 5.2      | Vite 5.1      |
| PostgreSQL       | Framer Motion |
| bcrypt 6.0       | CSS3          |
| JWT              | ES6 Modules   |
| ES6 modules      |               |

---

## 🚧 Next Steps / TODO

- Integrate token generation into `/login` endpoint response.
- Add `/register` endpoint with dedicated signup logic.
- Implement `/logout` endpoint (mark tokens as blacklisted or manage on frontend).
- Build token refresh mechanism (use refresh tokens for extended sessions).
- Validate input on both client and server sides (email format, password strength).
- Complete dashboard UI with protected data fetching.
- Deploy database and set up migrations.
- Add error handling and user feedback for token expiration.

---

## ⚠️ Security Notes

- Passwords are hashed using bcrypt with rounds from `.env`.
- JWT secret (`ACCESS_TOKEN_SECRET`) must be at least 32 characters and stored securely in `.env`.
- Keep `.env` out of source control; never commit secrets.
- CORS is enabled; ensure only allowed origins are used in production.
- Tokens are stateless; store them on the client (localStorage, sessionStorage, or httpOnly cookies).
- Consider adding token expiration times (exp claim) for additional security.
- In production, use HTTPS to prevent token interception.

---

## 🛠 Development Commands

```bash
# Backend
npm run dev

# Frontend (from Frontend folder)
npm run dev
```

---

This README will be updated as more features are completed.
