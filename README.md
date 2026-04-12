# Campus Payments Platform

This project is a secure, full-stack application built to facilitate campus payments. It currently features a robust authentication system using a Node.js/Express backend and a React/Vite frontend. The authentication layer is secured with bcrypt password hashing, PostgreSQL database interactions, and JWT-based session management.

---

## ✅ Work Completed (as of 12 April 2026)

### Phase 1: Core Authentication
1. **Backend Fundamentals**: 
   - Express server with CORS and JSON parsing.
   - Config helpers for database pool and salt rounds.
   - PostgreSQL connection established.
2. **Authentication Middleware**: 
   - Handlers for **Sign-In** (comparing hashed passwords) and **Sign-Up** (hashing new passwords, creating users).
   - Error handling and robust responses.
3. **Frontend Scaffold**: 
   - React/Vite application with animated background and custom cursors for polish.
   - `Login.jsx`, `Signup.jsx`, and `Dashboard.jsx`.
   - Resolving React imports to ensure steady frontend rendering.

### Phase 2: Session & JWT Token Implementation
4. **JWT Authentication**: 
   - Configured `authenticate_token` middleware for verifying Bearer tokens.
   - Secure token generation upon login/signup.
   - Refresh tokens logic (using `/refresh` with `cookievalidator`).
5. **Session Flow**: 
   - Stateless session management through frontend and httpOnly cookies for better security.
   - Secure logout endpoint `/logout` implemented.

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
REFRESH_TOKEN_SECRET=your_jwt_refresh_secret_here
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

## 🧱 Current API Endpoints

| Method | Route       | Auth Required | Description |
|--------|-------------|---------------|-------------|
| POST   | `/login`    | ❌ No         | Accepts JSON `{email,password,type}`. Handles sign-in/sign-up. |
| GET    | `/me`       | ✅ Yes        | Verifies JWT session token and returns decoded user data. |
| POST   | `/refresh`  | ✅ Yes (Cookie)| Issues new access token from httpOnly refresh token cookie. |
| GET    | `/logout`   | ✅ Yes        | Clears user session. |

---

## 📦 Tech Stack

**Backend**: Node.js v20, Express 5.2, PostgreSQL, bcrypt 6.0, JWT, ES6 Modules
**Frontend**: React 18, Vite 5.1, Framer Motion, TailwindCSS, CSS3

---

## 🚧 Next Steps / TODO
- Implement core payment modules (stripe integration).
- Design and integrate the user dashboard for transaction histories.
- Protect payment routes and establish schemas in PostgreSQL.
- Setup migrations for payment schema.

---

## 📈 Project Review

### Strengths
- **Solid Foundation:** The authentication system has been properly abstracted into manageable middleware (`middleware/middleware.js`) and routes.
- **Security-First Approach:** By leveraging `bcrypt` and separated `access` and `refresh` tokens (with cookies), the system handles sessions securely right out of the gate, essential for a financial app.
- **Modern UI:** Setup features modern tooling like Vite, Framer Motion, and TailwindCSS for a very responsive, aesthetically pleasing frontend.

### Areas for Improvement
- **Frontend State Management:** Currently, authentication state is handled explicitly by passing setter functions down the tree (e.g., `handle_session(setCurrentPage)` in `App.jsx`). Moving this to the React Context API or a state store (Zustand/Redux) would dramatically clean up component structures.
- **Error Handling Details:** The UI could provide more granular user feedback on failed login attempts or network timeouts, instead of silently failing.
- **Testing Structure:** Adding unit test frameworks (like Jest) and checking the backend algorithms (especially middleware handlers) and frontend validations is important given the application intent.

### Overall Assessment
The "Campus Payments Platform" is off to an incredibly strong start. The underlying authentication system is robust and well-segmented, establishing a highly secure baseline. The framework choices are great, creating an environment well-suited for adding upcoming payment and transaction endpoints securely and reliably.
