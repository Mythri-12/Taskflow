# TaskFlow — Full Stack Internship Assignment

A production-ready full-stack task management application built with React, Node.js/Express, and MongoDB. Features real JWT authentication, full CRUD operations, and a polished dark UI.

---

## 🔗 Links

| | |
|---|---|
| **Live App** | `https://taskflow-your-name.vercel.app` |
| **API** | `https://taskflow-api-your-name.onrender.com` |

---

## ✨ Features

- **Real Authentication** — JWT-based signup/login with bcrypt password hashing
- **Protected Routes** — Frontend guards + backend middleware
- **Task Management** — Create, read, update, delete tasks with status & priority
- **Live Filtering** — Filter by status (To Do / In Progress / Done), full-text search
- **Progress Tracking** — Stats bar with animated completion percentage
- **Rate Limiting** — Brute-force protection on auth endpoints
- **Input Validation** — Server-side validation with express-validator
- **Responsive Design** — Works on mobile, tablet, and desktop

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, React Router v6, CSS Modules |
| **Backend** | Node.js, Express 4 |
| **Database** | MongoDB with Mongoose ODM |
| **Auth** | JSON Web Tokens (JWT) + bcryptjs |
| **Deployment** | Vercel (frontend) + Render (backend) + MongoDB Atlas (DB) |

---

## 📁 Project Structure

```
taskflow/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   └── auth.js            # JWT verify middleware
│   ├── models/
│   │   ├── User.js            # User schema + password hashing
│   │   └── Task.js            # Task schema
│   ├── routes/
│   │   ├── auth.js            # POST /signup, POST /login, GET /me
│   │   └── tasks.js           # GET, POST, PUT, DELETE /tasks
│   ├── server.js              # Express app entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx     # Top nav with user menu
    │   │   ├── StatsBar.jsx   # Task stats + progress bar
    │   │   ├── TaskCard.jsx   # Individual task card
    │   │   └── TaskModal.jsx  # Create / edit modal
    │   ├── context/
    │   │   └── AuthContext.jsx  # Global auth state
    │   ├── hooks/
    │   │   └── useApi.js      # Axios instance + interceptors
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   └── Dashboard.jsx
    │   ├── App.jsx            # Routes + route guards
    │   └── index.css          # Design tokens + global styles
    ├── index.html
    └── package.json
```

---

## 🚀 Running Locally

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/taskflow.git
cd taskflow
```

### 2. Set up the backend
```bash
cd backend
cp .env.example .env
# Fill in your values in .env
npm install
npm run dev       # runs on http://localhost:5000
```

### 3. Set up the frontend
```bash
cd frontend
npm install
npm run dev       # runs on http://localhost:5173
```

The Vite dev server proxies `/api` requests to `localhost:5000` automatically.

---

## 🌍 Deployment Guide

### Step 1 — MongoDB Atlas (Database)
1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → create a free cluster
2. **Database Access** → Add user (username + password)
3. **Network Access** → Add IP `0.0.0.0/0` (allow all)
4. **Connect** → Copy the connection string (replace `<password>`)

### Step 2 — Render (Backend)
1. Push code to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo
4. Configure:
   ```
   Root Directory:  backend
   Build Command:   npm install
   Start Command:   node server.js
   ```
5. Add **Environment Variables**:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/taskflow
   JWT_SECRET=<generate a random 32+ char string>
   JWT_EXPIRE=7d
   CLIENT_URL=https://your-app.vercel.app
   ```
6. Deploy — note the URL (e.g. `https://taskflow-api.onrender.com`)

### Step 3 — Vercel (Frontend)
1. Go to [vercel.com](https://vercel.com) → **New Project** → Import repo
2. Configure:
   ```
   Root Directory:  frontend
   Framework:       Vite
   ```
3. Add **Environment Variable**:
   ```
   VITE_API_URL=https://taskflow-api.onrender.com/api
   ```
4. Deploy → your site is live!

---

## 🔐 API Reference

### Auth Endpoints
| Method | Endpoint | Body | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | `{name, email, password}` | Register new user |
| POST | `/api/auth/login` | `{email, password}` | Login, returns JWT |
| GET | `/api/auth/me` | — | Get current user (auth required) |

### Task Endpoints (all require `Authorization: Bearer <token>`)
| Method | Endpoint | Body/Query | Description |
|---|---|---|---|
| GET | `/api/tasks` | `?status=todo&priority=high` | List user's tasks |
| POST | `/api/tasks` | `{title, description, status, priority, dueDate}` | Create task |
| PUT | `/api/tasks/:id` | any task fields | Update task |
| DELETE | `/api/tasks/:id` | — | Delete task |

---

## 🧑‍💻 Author

Built for the Full Stack Developer Internship — Round 2 Assignment.
