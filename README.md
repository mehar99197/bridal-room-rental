# 💎 Bridal Room & Dress Rental System

A full-stack web application for managing bridal room and bridal dress rentals with a request-approval workflow. Built with **Django REST Framework** (backend) and **React + Vite + Tailwind CSS** (frontend).

---

## 📋 Table of Contents

1. [Features](#-features)
2. [Tech Stack](#-tech-stack)
3. [Project Structure](#-project-structure)
4. [Quick Start (Local)](#-quick-start-local)
5. [Docker Deployment](#-docker-deployment)
6. [API Documentation](#-api-documentation)
7. [Workflow](#-workflow)
8. [Admin Panel](#-admin-panel)

---

## ✨ Features

- **User Authentication** — Register, login, JWT token-based auth
- **Browse Rooms & Dresses** — Filter by status, category, paginated listings
- **Booking Requests** — Users request a room/dress → admin approves/rejects
- **Admin Dashboard** — Django admin panel with approve/reject actions
- **Auto Price Calculation** — Server-side total price from room/dress rates × duration
- **Custom Fields** — Room numbers, dress numbers for inventory tracking
- **Responsive UI** — Light & elegant bridal theme (ivory/blush/champagne‑gold), serif typography, live price estimates, and smooth animations
- **RESTful API** — Full CRUD for all entities

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Django 4.2+, Django REST Framework |
| **Auth** | SimpleJWT (access + refresh tokens) |
| **Frontend** | React 19, Vite 8, Tailwind CSS 4 |
| **Database** | SQLite (dev) / PostgreSQL (prod) |
| **Container** | Docker & Docker Compose |
| **Proxy** | Nginx |

---

## 📁 Project Structure

```
bridal-room-rental/
├── config/               # Django project settings
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── accounts/             # User auth app
│   ├── models.py         # Custom User model (email login)
│   ├── serializers.py
│   ├── views.py          # Register, Profile
│   └── admin.py          # Custom UserAdmin
├── bridal/               # Rooms & Dresses app
│   ├── models.py         # Category, BridalRoom, BridalDress
│   ├── serializers.py
│   ├── views.py          # ViewSets with filtering
│   └── admin.py          # Admin with room/dress number fields
├── bookings/             # Booking requests app
│   ├── models.py         # Booking (pending→confirmed→active→completed)
│   ├── serializers.py    # Auto price calculation
│   ├── views.py          # Approve/reject actions
│   └── admin.py          # Bulk approve/reject actions
├── frontend/             # React + Vite + Tailwind (and Django SPA template)
│   ├── src/
│   │   ├── api/          # Axios instance + JWT interceptors
│   │   ├── context/      # AuthContext (login/logout/register)
│   │   ├── components/   # Navbar, Footer, ProtectedRoute
│   │   └── pages/        # Landing, Login, Register, Dashboard,
│   │                     # RoomList, RoomDetail, DressList,
│   │                     # DressDetail, BookingList
│   ├── templates/        # react-index.html served by Django in prod
│   ├── vite.config.js    # Proxy /api → Django
│   └── package.json
├── static/               # Static assets (CSS, JS, admin theme)
├── templates/            # Django HTML templates
├── docker-compose.yml    # Full stack deployment
├── Dockerfile            # Django container
├── nginx.conf            # Nginx config
└── requirements.txt      # Python dependencies
```

---

## 🚀 Quick Start (Local)

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm

### 1. Backend Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start Django server
python manage.py runserver
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The React dev server runs on `http://localhost:5173` and proxies API calls to Django at `http://localhost:8000`.

To build the SPA so Django serves it in production (`DEBUG=False`):

```bash
cd frontend
npm run build:django   # outputs to ../static/react-assets + frontend/templates/react-index.html
```

### Environment Variables

The Django settings read these (sensible dev defaults apply if unset):

| Variable | Default | Purpose |
|----------|---------|---------|
| `DEBUG` | `True` | Set to `False` in production (enables the SPA catch-all route + WhiteNoise static serving) |
| `SECRET_KEY` | dev key | Override in production |
| `DJANGO_ALLOWED_HOSTS` | `*` | Comma-separated allowed hosts |

### 3. Access the App

| URL | Description |
|-----|-------------|
| `http://localhost:5173` | React frontend (dev) |
| `http://localhost:8000` | Django backend (API) |
| `http://localhost:8000/admin/` | Django admin panel |

---

## 🐳 Docker Deployment

### Build & Run

```bash
# Build all containers
docker compose build

# Start services
docker compose up -d

# Create superuser (first time)
docker compose exec backend python manage.py createsuperuser

# View logs
docker compose logs -f
```

### Services

| Service | Port | Description |
|---------|------|-------------|
| `backend` | 8000 | Django + DRF API |
| `frontend` | 5173 | React dev server |
| `nginx` | 80 | Production reverse proxy |

### Docker Compose Configuration

The `docker-compose.yml` sets up:
- **backend** — Django application with gunicorn
- **frontend** — Nginx serving built React app
- **nginx** — Reverse proxy routing `/api`, `/admin` → Django, `/` → React

---

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register/` | No | Create account |
| POST | `/api/auth/login/` | No | Get JWT tokens |
| POST | `/api/auth/token/refresh/` | No | Refresh access token |
| GET/PUT | `/api/auth/profile/` | Yes | View/update profile |

### Category Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/categories/` | No | List categories |
| POST | `/api/categories/` | Yes | Create category |
| GET/PUT/PATCH/DELETE | `/api/categories/{id}/` | Varies | CRUD single category |

### Room Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/rooms/` | No | List rooms (?status=available) |
| POST | `/api/rooms/` | Yes | Create room |
| GET/PUT/PATCH/DELETE | `/api/rooms/{id}/` | Varies | CRUD single room |

### Dress Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/dresses/` | No | List dresses (?status=&category=) |
| POST | `/api/dresses/` | Yes | Create dress |
| GET/PUT/PATCH/DELETE | `/api/dresses/{id}/` | Varies | CRUD single dress |

### Booking Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/bookings/` | Yes | List bookings (own or all for staff) |
| POST | `/api/bookings/` | Yes | Create booking request (status: pending) |
| GET/PUT/PATCH/DELETE | `/api/bookings/{id}/` | Yes | CRUD single booking |
| POST | `/api/bookings/{id}/cancel/` | Yes | Cancel pending/confirmed booking |
| POST | `/api/bookings/{id}/approve/` | Admin | Approve pending booking |
| POST | `/api/bookings/{id}/reject/` | Admin | Reject pending booking |

> **Note:** `total_price` is auto-calculated server-side when creating a booking.

---

## 🔄 Workflow

```
User                    Server                    Admin
  |                        |                        |
  |-- POST /bookings/ ---->|                        |
  |   (status: pending)    |                        |
  |                        |                        |
  |   "Waiting approval"   |                        |
  |                        |                        |
  |                        |  POST /bookings/1/approve/
  |                        |<-----------------------|
  |                        |  (status: confirmed)   |
  |   "Booking confirmed"  |                        |
  |                        |                        |
  |            OR          |                        |
  |                        |                        |
  |                        |  POST /bookings/1/reject/
  |                        |<-----------------------|
  |                        |  (status: cancelled)   |
  |   "Booking rejected"   |                        |
```

### Booking Statuses

| Status | Description |
|--------|-------------|
| **pending** | Awaiting admin approval |
| **confirmed** | Approved by admin |
| **active** | Currently in progress |
| **completed** | Finished |
| **cancelled** | Rejected by admin or cancelled by user |

---

## 🛡 Admin Panel

Access at `/admin/` with a superuser account.

### Features

- **User Management** — View/search users, set staff/superuser status
- **Room Management** — Add/edit rooms with `room_number`, status, pricing
- **Dress Management** — Add/edit dresses with `dress_number`, category, size
- **Booking Management** — View all bookings, approve/reject via dropdown or bulk actions
- **Bulk Actions** — Select multiple bookings → "Approve selected" / "Reject selected"
- **Custom Theming** — Dark gradient theme with glassmorphism and animations

### Default Admin Credentials

```
Email:    admin@example.com
Password: admin123
```

---

## 📄 License

This project is for educational/demonstration purposes.

---

## 👨‍💻 Author

Built with ❤️ using Django & React
