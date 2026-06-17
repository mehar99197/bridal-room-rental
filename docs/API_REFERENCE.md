# API Reference

Complete reference for the Bridal Room & Dress Rental REST API.

- **Base URL (local):** `http://localhost:8000`
- **Base path:** `/api`
- **Format:** JSON (image uploads use `multipart/form-data`)
- **Auth scheme:** `Authorization: Bearer <access_token>`
- **Interactive docs:** [`/api/docs/`](http://localhost:8000/api/docs/) (Swagger) · [`/api/redoc/`](http://localhost:8000/api/redoc/) (ReDoc) · [`/api/schema/`](http://localhost:8000/api/schema/) (raw OpenAPI)

> The interactive Swagger/ReDoc pages are generated from the live code by `drf-spectacular`, so they always match the running server. This file is a hand‑written companion with end‑to‑end examples.

## Contents

- [Conventions](#conventions)
- [Authentication](#authentication)
- [Profile](#profile)
- [Categories](#categories)
- [Rooms](#rooms)
- [Dresses](#dresses)
- [Bookings](#bookings)
- [Errors](#errors)

---

## Conventions

### Authentication header

All protected endpoints expect the access token:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

### Pagination

List endpoints are paginated (20 per page) and wrap results:

```json
{
  "count": 42,
  "next": "http://localhost:8000/api/rooms/?page=2",
  "previous": null,
  "results": [ /* ... */ ]
}
```

Use `?page=N` to navigate.

### Permission legend

| Badge | Meaning |
|-------|---------|
| 🟢 **Public** | No authentication required |
| 🔵 **User** | Any authenticated user |
| 🟣 **Owner** | The authenticated user who owns the resource |
| 🔴 **Staff** | `is_staff` / admin only |

---

## Authentication

### Register

```http
POST /api/auth/register/
```

🟢 **Public** · Creates a new account. Password must be **at least 8 characters**.

**Request**

```json
{
  "username": "jane",
  "email": "jane@example.com",
  "password": "supersecret",
  "phone": "0300-1234567",
  "address": "123 Garden Road"
}
```

> `phone` and `address` are optional. `email` and `username` must be unique.

**Response** `201 Created`

```json
{
  "id": 5,
  "username": "jane",
  "email": "jane@example.com",
  "phone": "0300-1234567",
  "address": "123 Garden Road"
}
```

---

### Login (obtain tokens)

```http
POST /api/auth/login/
```

🟢 **Public** · Authenticates with **email + password** and returns a token pair.

**Request**

```json
{ "email": "jane@example.com", "password": "supersecret" }
```

**Response** `200 OK`

```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "access":  "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
```

| Token | Lifetime | Use |
|-------|----------|-----|
| `access` | 1 day | Sent as the Bearer token on every request |
| `refresh` | 7 days | Exchanged for a new access token |

---

### Refresh token

```http
POST /api/auth/token/refresh/
```

🟢 **Public** · Exchanges a valid refresh token for a new access token.

**Request**

```json
{ "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6..." }
```

**Response** `200 OK`

```json
{ "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6..." }
```

---

## Profile

### Get current user

```http
GET /api/auth/profile/
```

🔵 **User** · Returns the authenticated user's profile.

**Response** `200 OK`

```json
{
  "id": 5,
  "username": "jane",
  "email": "jane@example.com",
  "phone": "0300-1234567",
  "address": "123 Garden Road",
  "avatar": "/media/avatars/jane.webp",
  "is_verified": false,
  "is_staff": false
}
```

### Update profile

```http
PUT  /api/auth/profile/
PATCH /api/auth/profile/
```

🟣 **Owner** · Only **`phone`**, **`address`**, and **`avatar`** are editable. `id`, `username`, `email`, `is_verified`, and `is_staff` are read‑only. To upload an avatar, send `multipart/form-data`.

**Request (multipart)**

```
phone:   0300-7654321
address: 456 New Street
avatar:  <binary image file>
```

**Response** `200 OK` — the updated user object (same shape as above).

---

## Categories

Dress categories. Reads are public; writes require staff.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/categories/` | 🟢 Public | List categories |
| `POST` | `/api/categories/` | 🔴 Staff | Create a category |
| `GET` | `/api/categories/{id}/` | 🟢 Public | Retrieve one |
| `PUT` / `PATCH` | `/api/categories/{id}/` | 🔴 Staff | Update |
| `DELETE` | `/api/categories/{id}/` | 🔴 Staff | Delete |

**Object**

```json
{ "id": 1, "name": "Mermaid", "description": "Fitted through the bodice, flaring below the knee" }
```

---

## Rooms

Bridal rooms, priced **per hour**. Reads are public; writes require staff.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/rooms/` | 🟢 Public | List rooms |
| `POST` | `/api/rooms/` | 🔴 Staff | Create a room |
| `GET` | `/api/rooms/{id}/` | 🟢 Public | Retrieve one |
| `PUT` / `PATCH` | `/api/rooms/{id}/` | 🔴 Staff | Update |
| `DELETE` | `/api/rooms/{id}/` | 🔴 Staff | Delete |

**Query parameters** (list)

| Param | Example | Description |
|-------|---------|-------------|
| `status` | `?status=available` | Filter by `available`, `booked`, or `maintenance` |
| `page` | `?page=2` | Pagination |

**Object**

```json
{
  "id": 3,
  "room_number": "R-12",
  "name": "Rose Garden Suite",
  "description": "A bright suite overlooking the courtyard.",
  "capacity": 80,
  "price_per_hour": "150.00",
  "location": "2nd Floor, East Wing",
  "amenities": "AC, Stage, Sound System, Parking",
  "image": "/media/rooms/rose-garden.webp",
  "status": "available",
  "created_at": "2026-06-01T10:30:00Z"
}
```

> Creating/updating with an `image` requires `multipart/form-data`.

---

## Dresses

Bridal dresses, priced **per day** plus a refundable deposit. Reads are public; writes require staff.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/dresses/` | 🟢 Public | List dresses |
| `POST` | `/api/dresses/` | 🔴 Staff | Create a dress |
| `GET` | `/api/dresses/{id}/` | 🟢 Public | Retrieve one |
| `PUT` / `PATCH` | `/api/dresses/{id}/` | 🔴 Staff | Update |
| `DELETE` | `/api/dresses/{id}/` | 🔴 Staff | Delete |

**Query parameters** (list)

| Param | Example | Description |
|-------|---------|-------------|
| `status` | `?status=available` | Filter by `available`, `rented`, or `maintenance` |
| `category` | `?category=Mermaid` | Filter by category **name** |
| `page` | `?page=2` | Pagination |

**Object**

```json
{
  "id": 7,
  "dress_number": "D-07",
  "name": "Ivory Lace Gown",
  "description": "Hand-stitched lace with a chapel train.",
  "category": 1,
  "category_name": "Mermaid",
  "size": "8",
  "color": "Ivory",
  "rental_price_per_day": "200.00",
  "deposit_amount": "100.00",
  "image": "/media/dresses/ivory-lace.webp",
  "status": "available",
  "created_at": "2026-06-02T09:00:00Z"
}
```

> `category_name` is a read‑only convenience field. Sizes range from `2` to `15`.

---

## Bookings

A booking reserves **either a room or a dress** (not both) for a date range. All booking endpoints require authentication. Non‑staff users only ever see and act on **their own** bookings; staff see all.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/bookings/` | 🔵 User | List bookings (own, or all for staff) |
| `POST` | `/api/bookings/` | 🔵 User | Create a booking request |
| `GET` | `/api/bookings/{id}/` | 🟣 Owner | Retrieve one |
| `PUT` / `PATCH` | `/api/bookings/{id}/` | 🟣 Owner | Update |
| `DELETE` | `/api/bookings/{id}/` | 🟣 Owner | Delete |
| `POST` | `/api/bookings/{id}/cancel/` | 🟣 Owner | Cancel (if `pending`/`confirmed`) |
| `POST` | `/api/bookings/{id}/approve/` | 🔴 Staff | Approve a `pending` booking |
| `POST` | `/api/bookings/{id}/reject/` | 🔴 Staff | Reject a `pending` booking |

### Create a booking

```http
POST /api/bookings/
```

Provide a `room` **or** a `dress` id, plus a date range. `total_price` is computed on the server — any client‑supplied value is ignored.

**Request (room)**

```json
{
  "room": 3,
  "start_date": "2026-07-01T14:00:00Z",
  "end_date":   "2026-07-01T18:00:00Z",
  "notes": "Afternoon reception"
}
```

**Response** `201 Created`

```json
{
  "id": 21,
  "user": 5,
  "user_email": "jane@example.com",
  "room": 3,
  "room_name": "Rose Garden Suite",
  "dress": null,
  "dress_name": null,
  "start_date": "2026-07-01T14:00:00Z",
  "end_date": "2026-07-01T18:00:00Z",
  "total_price": "600.00",
  "status": "pending",
  "notes": "Afternoon reception",
  "created_at": "2026-06-17T12:00:00Z",
  "updated_at": "2026-06-17T12:00:00Z"
}
```

**Validation rules**

- You must specify **a `room` or a `dress`** → otherwise `400`: *"Must specify a room or a dress to book."*
- `end_date` must be **after** `start_date` → otherwise `400`: *"End date must be after the start date."*

**Price calculation**

| Item | Formula |
|------|---------|
| Room | `price_per_hour × max(1, hours)` |
| Dress | `rental_price_per_day × max(1, days) + deposit_amount` |

where `hours = (end_date − start_date)` in hours and `days = hours / 24`.

### Approve / Reject (staff)

```http
POST /api/bookings/{id}/approve/   → { "status": "confirmed" }
POST /api/bookings/{id}/reject/    → { "status": "cancelled" }
```

🔴 **Staff** · Only a `pending` booking can be approved or rejected; otherwise `400`: *"Only pending bookings can be approved/rejected."*

### Cancel (owner)

```http
POST /api/bookings/{id}/cancel/    → { "status": "cancelled" }
```

🟣 **Owner** · Allowed only when the booking is `pending` or `confirmed`; otherwise `400`: *"Cannot cancel this booking."*

### Booking status values

| Status | Meaning |
|--------|---------|
| `pending` | Submitted, awaiting staff review |
| `confirmed` | Approved by staff |
| `active` | Rental currently in progress |
| `completed` | Rental finished |
| `cancelled` | Rejected by staff or cancelled by the user |

---

## Errors

The API uses standard HTTP status codes and DRF's JSON error shapes.

| Code | Meaning | Example body |
|------|---------|--------------|
| `400 Bad Request` | Validation failed | `{ "end_date": ["End date must be after the start date."] }` |
| `401 Unauthorized` | Missing/expired/invalid token | `{ "detail": "Authentication credentials were not provided." }` |
| `403 Forbidden` | Authenticated but not permitted | `{ "detail": "You do not have permission to perform this action." }` |
| `404 Not Found` | Resource does not exist (or isn't yours) | `{ "detail": "No Booking matches the given query." }` |

> When an access token expires, the React client automatically refreshes it and retries the request once (see [ARCHITECTURE.md](ARCHITECTURE.md#authentication--tokens)). When calling the API directly, refresh via `/api/auth/token/refresh/`.

---

**See also:** [Architecture](ARCHITECTURE.md) · [Data Model](DATA_MODEL.md) · [Setup](SETUP.md)
