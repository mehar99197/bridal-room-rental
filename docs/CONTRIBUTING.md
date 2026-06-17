# Contributing

Thanks for your interest in improving the **Bridal Room & Dress Rental System**. This guide covers how to set up, make changes, and submit them.

- [Getting Set Up](#getting-set-up)
- [Branching & Commits](#branching--commits)
- [Pull Requests](#pull-requests)
- [Coding Conventions](#coding-conventions)
- [Project Conventions to Respect](#project-conventions-to-respect)
- [Where Things Live](#where-things-live)

---

## Getting Set Up

Follow the [Setup Guide](SETUP.md) to get the backend and frontend running locally. In short:

```bash
# backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate && python manage.py runserver

# frontend (second terminal)
cd frontend && npm install && npm run dev
```

---

## Branching & Commits

- Branch off `main`; never commit directly to `main`.
- Use short, descriptive branch names with a type prefix:

  ```
  feature/booking-calendar
  fix/profile-avatar-upload
  docs/api-examples
  refactor/booking-serializer
  ```

- Write imperative, focused commit messages (e.g. *"Add date validation to booking serializer"*). Keep each commit to one logical change.

---

## Pull Requests

1. Make sure the app still runs and migrations are committed (`python manage.py makemigrations` if you changed models).
2. Run the linters/tests you touched (see below).
3. Open a PR against `main` with:
   - **What** changed and **why** (the rationale matters more than the diff).
   - Screenshots or a short clip for UI changes.
   - Any new environment variables or migration steps.
4. Keep PRs small and single‑purpose where possible — they're far easier to review.

---

## Coding Conventions

### Backend (Python / Django)

- Follow **PEP 8**; keep functions small and names descriptive.
- Put business rules in **serializers/views**, not in the React client (e.g. pricing lives in `BookingCreateSerializer`).
- Add `drf-spectacular` annotations (`@extend_schema`) to new endpoints so the API docs stay complete.
- Always generate and commit migrations when models change.
- Run the test suite:

  ```bash
  python manage.py test
  ```

### Frontend (React / JS)

- Functional components with hooks; one component per file.
- Use the shared Axios instance (`src/api/axios.js`) for **all** API calls — don't call `fetch`/`axios` directly, or you'll bypass the JWT and refresh logic.
- Read auth state via `useAuth()` rather than touching `sessionStorage` in components.
- Style with Tailwind utility classes and the shared component classes in `index.css`.
- Lint before pushing:

  ```bash
  cd frontend && npm run lint
  ```

---

## Project Conventions to Respect

These exist by design — please keep them consistent:

| Convention | Why |
|------------|-----|
| **Email is the login field** (not username) | `AUTH_USER_MODEL` uses `USERNAME_FIELD = "email"`. |
| **Server calculates `total_price`** | Prevents client‑side tampering; keep pricing in the serializer. |
| **Tokens in `sessionStorage`** | Per‑tab sessions; don't switch to `localStorage` without discussion. |
| **Public read / staff write** for rooms, dresses, categories | Enforced by `IsStaffOrReadOnly`; mirror it in any new inventory endpoint. |
| **Bookings reference a room *or* a dress** | Validated in `BookingCreateSerializer`; preserve the either/or rule. |
| **`SET_NULL` on inventory FKs** | Keeps historical bookings intact when items are deleted. |

---

## Where Things Live

| You want to change… | Look in… |
|---------------------|----------|
| User model / registration / profile | [`accounts/`](../accounts) |
| Rooms, dresses, categories | [`bridal/`](../bridal) |
| Booking logic, approval, pricing | [`bookings/`](../bookings) |
| Global settings, URLs, JWT, CORS | [`config/`](../config) |
| React pages & components | [`frontend/src/`](../frontend/src) |
| API auth / refresh behavior | [`frontend/src/api/axios.js`](../frontend/src/api/axios.js) |
| Container / proxy setup | `Dockerfile*`, `docker-compose*.yml`, `nginx.conf` |
| Documentation | [`docs/`](.) and the root `README.md` |

When in doubt, mirror the patterns in the surrounding code.

---

Happy building! For architecture context, start with [ARCHITECTURE.md](ARCHITECTURE.md).
