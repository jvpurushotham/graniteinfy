# GraniteInfy

AI-ready digital catalog & dealer management platform for a granite manufacturing
factory — replaces physical sample crates with a searchable, filterable online
catalog, dealer wholesale pricing, and a factory admin back office.

This is a **working MVP**: real Flask + PostgreSQL/SQLite backend with JWT auth
and role-based access control, and a React + Tailwind frontend with a fully
functional Factory Admin dashboard (product, inquiry, and dealer management),
plus Retailer and Customer dashboards (wishlist + inquiry history).

Not yet built (intentionally out of scope for this pass — see "Roadmap" below):
AI recommendation engine, AR preview, 360° image viewer, PWA offline mode,
multi-language UI, live chat.

---

## Stack

| Layer      | Tech |
|------------|------|
| Frontend   | React 19, Vite, Tailwind CSS v4, React Router, Axios, Framer Motion, Recharts, lucide-react |
| Backend    | Flask 3, Flask-SQLAlchemy, Flask-JWT-Extended, Flask-CORS |
| Database   | SQLite (dev) / PostgreSQL (production, e.g. Neon) |
| Auth       | JWT (access + refresh tokens), role-based route protection |

---

## Project Structure

```
graniteinfy/
├── backend/
│   ├── app.py              # Flask app factory + entrypoint
│   ├── config.py           # Env-driven config (dev/prod)
│   ├── extensions.py       # db, jwt, cors singletons
│   ├── seed.py             # Seeds sample users/products/projects
│   ├── models/              # User, Product, Category, Inquiry, Wishlist...
│   ├── routes/               # auth, products, categories, inquiries, dealers, dashboard, wishlist, content
│   ├── middleware/auth.py  # roles_required() decorator
│   ├── utils/helpers.py    # slugify, product code generation
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # Home, Catalog, ProductDetail, About, Contact, FAQ, Blog, Login, Register...
│   │   ├── dashboard/
│   │   │   ├── factory/     # Overview, Products, Inquiries, Dealers, Reports
│   │   │   ├── retailer/    # RetailerDashboard
│   │   │   └── customer/    # CustomerDashboard
│   │   ├── components/      # Navbar, Footer, ProductCard, InquiryModal, ProtectedRoute
│   │   ├── context/AuthContext.jsx
│   │   └── services/api.js  # Axios client with auto token refresh
│   └── package.json
│
└── README.md (this file)
```

---

## Local Setup

### Backend

```bash
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # edit as needed; SQLite works out of the box
python seed.py                # creates + seeds graniteinfy.db with sample data
python app.py                 # runs on http://localhost:5000
```

**Seeded demo logins** (also printed by `seed.py`):

| Role            | Email                          | Password       |
|-----------------|---------------------------------|----------------|
| Factory Owner   | owner@graniteinfy.com          | Owner@123      |
| Factory Manager | manager@graniteinfy.com        | Manager@123    |
| Sales Manager   | sales@graniteinfy.com          | Sales@123      |
| Retailer (approved) | retailer@graniteinfy.com  | Retailer@123   |
| Retailer (pending)  | pending.retailer@graniteinfy.com | Retailer@123 |
| Customer        | customer@graniteinfy.com       | Customer@123   |

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local    # set VITE_API_URL to your backend URL
npm run dev                   # runs on http://localhost:5173
```

Open `http://localhost:5173`. The catalog, product pages, and factory admin
dashboard (`/factory/dashboard`, log in as the factory owner above) are fully wired
to the live backend.

---

## Deployment

| Piece      | Suggested host | Notes |
|------------|-----------------|-------|
| Frontend   | Vercel / Netlify | `npm run build` outputs to `frontend/dist`. Set `VITE_API_URL` env var to your backend's public URL. |
| Backend    | Render | Use `gunicorn app:app` as the start command (already in `requirements.txt`). Set `FLASK_ENV=production`, `SECRET_KEY`, `JWT_SECRET_KEY`, `DATABASE_URL`, `CORS_ORIGINS` env vars. |
| Database   | Neon PostgreSQL | Copy the connection string into `DATABASE_URL`. Run `python seed.py` once against it to seed sample data (optional — remove destructive `db.drop_all()` first if seeding a live DB). |
| Images     | Cloudinary | Not yet wired into the upload flow — `ProductImage.url` currently accepts any external URL (used for seed data via Unsplash). Swap in the Cloudinary SDK in `routes/products.py` when ready for real uploads. |

`backend/.env.example` and `frontend/.env.example` list every variable you need
to set.

---

## What's implemented vs. roadmap

**Implemented (this MVP):**
- Three role families: Factory (owner/manager/sales), Retailer, Customer — JWT auth, role-gated routes on both API and frontend
- Public catalog with search, color/finish/application filters, sort, pagination
- Product detail page: gallery, technical specs table, related products, quote/callback/visit/question inquiry form, WhatsApp/call/email links
- Factory Admin dashboard: live stats cards, most-viewed/most-inquired charts, low-stock alerts, full product CRUD, inquiry status/notes management, dealer approval + wholesale discount workflow, CSV export
- Retailer & Customer dashboards: wishlist, inquiry history, dealer discount display, pending-approval state
- Dealer registration with admin approval gate before wholesale pricing unlocks
- Seed script with realistic sample products, projects, and testimonials

**Roadmap (not built yet, flagged in the original brief as optional/future-ready):**
- AI granite recommendation engine & AI chatbot
- AR preview / AI image search
- 360° product image viewer
- Cloudinary upload integration (currently accepts direct image URLs)
- CSV bulk import UI (API endpoint exists at `POST /api/products/bulk-import`, no frontend yet)
- PWA offline support, multi-language UI
- Email delivery for password reset (endpoint exists, currently a no-op — wire up Flask-Mail or a transactional email provider)
- Employee/salesperson sub-accounts and granular permissions

---

## API Overview

All endpoints are under `/api`. Auth endpoints: `/auth/register`, `/auth/login`,
`/auth/refresh`, `/auth/me`, `/auth/forgot-password`, `/auth/reset-password`.
Full route list is in `backend/routes/`. Protected routes use `roles_required(...)`
from `backend/middleware/auth.py`.
