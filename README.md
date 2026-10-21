# Yop Digital Equb — Equb Manager Pro

የልብ አድርስ አንጀት አርስ

A FastAPI backend + React/Tailwind web dashboard for running a digital Equb
(rotating community savings group). No Telegram bot, no webhook
notifications — the web dashboard is the only interface.

```
equb-manager-pro/
├── backend/     FastAPI + SQLAlchemy API
└── frontend/    React + Tailwind CSS dashboard (Vite)
```

## Feature summary

- **Bilingual UI** — English / Amharic toggle across the whole dashboard.
- **Equb identity** — Name, Address/City (major Ethiopian cities), Member
  Password, Admin Password, Start Date (Ethiopian or Gregorian).
- **Main Slots → Sub-Members** — Equbs are organized by Main Slot (e.g.
  "9th Grade"), each expandable to show its Sub-Members. Draws are always
  calculated from the Main Slot count, never the sub-member count.
- **Marketplace / Promotion page** — post new Equbs, buy/sell slot requests,
  or community announcements.
- **Bank integration & payment approvals** — link a bank account under the
  Equb's name, upload transfer proof, log cash payments, admin-approve
  before contributions count.
- **Privacy rules** — public views show nicknames only; a member can opt
  in to show their phone number; full names, phone numbers, and payment
  actions require the Equb's admin password.
- **Service fee tiers** — Free (0%), Standard (0.06%), Premium (0.12%),
  charged only from the winner's payout on draw day.
- **Draw simulation** — manual or automatic draw generates an instant
  congratulation alert: *"Congratulations! You have won today's draw for
  [Equb Name]. Total Payout: [Amount] Birr."*

## Backend setup

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env        # edit SECRET_KEY at minimum
uvicorn app.main:app --reload --port 8000
```

The API is now at `http://localhost:8000`, docs at `http://localhost:8000/docs`.
SQLite is the default (`equb.db`, created automatically on first run). Swap
`DATABASE_URL` in `.env` for Postgres/MySQL in production — SQLAlchemy
handles both without code changes.

Uploaded payment proofs are written to `UPLOAD_DIR` (default `./uploads`)
and served back at `/uploads/<filename>`.

### Admin vs. member access

There's no login system with sessions/JWT cookies — each Equb has its own
two passwords, checked per-request:

- `X-Member-Password` header → read access to that Equb's dashboard.
- `X-Admin-Password` header → read/write access to full names, phone
  numbers, slot/member management, draws, and payment approvals.

The frontend asks for the admin password once per Equb view and keeps it
in memory (not persisted) to attach to subsequent admin requests.

## Frontend setup

```bash
cd frontend
npm install
cp .env.example .env.local   # defaults work for local dev against localhost:8000
npm run dev
```

Opens at `http://localhost:5173`. The Vite dev server proxies `/api` and
`/uploads` to `VITE_API_PROXY_TARGET` (defaults to `http://localhost:8000`),
so you don't need CORS configured for local development.

### Production build

```bash
npm run build      # outputs to frontend/dist
npm run preview    # sanity-check the production build locally
```

## Deploying

**Backend** — deploy `backend/` to any ASGI-friendly host (Render, Railway,
Fly.io, a VM with `uvicorn`/`gunicorn`). Set `DATABASE_URL`, `SECRET_KEY`,
and `CORS_ORIGINS` (comma-separated list including your frontend's deployed
URL) as environment variables.

**Frontend (Vercel)** — the included `vercel.json` handles SPA routing.
Deploy `frontend/` as a Vercel project (Framework preset: Vite) and set:

```
VITE_API_BASE_URL=https://your-backend-host.example.com/api
```

as a Vercel environment variable, since Vercel only serves the static
frontend — it can't proxy `/api` to a separate backend host the way the
local Vite dev server does.

## Notes on the draw rule

`Equb.total_slots` and the draw pool in `app/routers/draws.py` both count
`MainSlot` rows only. A Main Slot with five Sub-Members splitting its
contribution is still exactly one entry in the draw — this is enforced in
one place (`_eligible_slots`) so it can't drift out of sync between the
slot list and the draw logic.
