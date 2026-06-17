# Setup Guide

How to get the Bridal Room & Dress Rental System running on your machine for development.

- [Prerequisites](#prerequisites)
- [1. Clone the repository](#1-clone-the-repository)
- [2. Backend setup (Django)](#2-backend-setup-django)
- [3. Frontend setup (React)](#3-frontend-setup-react)
- [4. Verify the install](#4-verify-the-install)
- [Common Commands](#common-commands)
- [Seeding Sample Data](#seeding-sample-data)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| Python | 3.11+ | `python --version` |
| pip | latest | `pip --version` |
| Node.js | 18+ | `node --version` |
| npm | 9+ | `npm --version` |
| Git | any | `git --version` |

> Docker is **not** required for local development — only for the containerized stack ([DEPLOYMENT.md](DEPLOYMENT.md)).

---

## 1. Clone the repository

```bash
git clone https://github.com/mehar99197/bridal-room-rental.git
cd bridal-room-rental
```

---

## 2. Backend setup (Django)

### Create and activate a virtual environment

```bash
python -m venv venv

# macOS / Linux
source venv/bin/activate

# Windows (PowerShell)
venv\Scripts\Activate.ps1
```

### Install dependencies

```bash
pip install -r requirements.txt
```

This installs Django, Django REST Framework, SimpleJWT, drf‑spectacular, django‑cors‑headers, Gunicorn, Pillow, and WhiteNoise.

### Apply migrations

```bash
python manage.py migrate
```

This creates the SQLite database (`db.sqlite3`) with the `accounts`, `bridal`, and `bookings` tables.

### Create an admin user

```bash
python manage.py createsuperuser
```

You'll be prompted for an **email** (the login field), username, and password. Use this account to sign in to the Django admin and to the React admin panel.

### Run the API

```bash
python manage.py runserver
```

The API is now live at **http://localhost:8000**.

---

## 3. Frontend setup (React)

In a **second terminal** (keep Django running):

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server starts at **http://localhost:5173** and proxies `/api`, `/admin`, and `/media` to Django on port `8000` (configured in [`frontend/vite.config.js`](../frontend/vite.config.js)). You only need to open the Vite URL.

---

## 4. Verify the install

| URL | Expected |
|-----|----------|
| http://localhost:5173 | The landing page with featured rooms & dresses |
| http://localhost:8000/admin/ | Django admin login |
| http://localhost:8000/api/docs/ | Swagger UI listing every endpoint |
| http://localhost:8000/api/rooms/ | `{"count": 0, "results": []}` (until you add rooms) |

A quick smoke test from the command line:

```bash
# Register a user
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","email":"demo@example.com","password":"demopass123"}'

# Log in
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"demopass123"}'
```

---

## Common Commands

### Backend

| Command | Purpose |
|---------|---------|
| `python manage.py runserver` | Start the dev server |
| `python manage.py makemigrations` | Generate migrations after model changes |
| `python manage.py migrate` | Apply migrations |
| `python manage.py createsuperuser` | Create an admin account |
| `python manage.py shell` | Interactive Django shell |
| `python manage.py collectstatic` | Gather static files (for production) |
| `python manage.py test` | Run the test suite |

### Frontend

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Vite dev server (hot reload) |
| `npm run build` | Production build → `frontend/dist/` |
| `npm run build:django` | Build into Django static + SPA template (single‑server mode) |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build locally |

---

## Seeding Sample Data

The project doesn't ship a seed script. The quickest way to populate inventory is the Django admin:

1. Go to http://localhost:8000/admin/ and log in with your superuser.
2. Add a few **Categories** (e.g. *Mermaid*, *A‑Line*).
3. Add **Bridal Rooms** and **Bridal Dresses**, setting `status = available` so they appear on the landing page.

Alternatively, create them via the API (`POST /api/rooms/`, `POST /api/dresses/`) using a staff account's access token — see the [API Reference](API_REFERENCE.md).

---

## Troubleshooting

| Symptom | Likely cause & fix |
|---------|--------------------|
| `npm run dev` page can't reach the API | Django isn't running on port `8000`, or you opened `:8000` instead of `:5173`. Start Django and use the Vite URL. |
| `401` on every request | Access token missing/expired. Log in again; the client auto‑refreshes, but a 7‑day‑old refresh token requires a fresh login. |
| Login fails with correct password | Remember the login field is **email**, not username. |
| Images don't load (`404` on `/media/...`) | In local dev, media is proxied to Django; ensure Django is running and `DEBUG=True` (media is served only in debug). |
| `Pillow` install error | Install OS image libraries (e.g. `libjpeg`, `zlib`) or upgrade pip, then reinstall. |
| Port already in use | Another process holds `8000`/`5173`. Stop it or change the port (`runserver 8001`, `npm run dev -- --port 5174`). |
| Migrations out of sync | Run `python manage.py makemigrations` then `migrate`. |

---

**Next:** [Deployment Guide](DEPLOYMENT.md) · [Frontend Guide](FRONTEND.md) · [API Reference](API_REFERENCE.md)
