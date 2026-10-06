# Deployment Steps — Monorepo (API + Web) → Render + Netlify/Vercel

Reusable playbook for **any project with this folder structure**. Copy the three
config files, import the repo, paste the env vars — no server, no hassle.

Live reference implementation: this repo → API `https://klyron-erp.onrender.com`,
Web `https://klyron-erp.netlify.app`, DB Neon Postgres.

---

## 1. Required folder structure

```
your-repo/
├── backend/                 # FastAPI (or Flask/Django) app
│   ├── app/
│   │   ├── main.py          # must expose a GET /health route
│   │   └── ...
│   ├── requirements.txt     # pinned deps
│   └── .env                 # LOCAL only — gitignored, never copied to Render wholesale
├── frontend/                # Next.js app
│   ├── app/ (or pages/)
│   ├── package.json
│   └── lib/api.ts           # reads process.env.NEXT_PUBLIC_API_URL
├── Dockerfile               # ← root, builds BACKEND only  (file #1)
├── .dockerignore            # ← root                       (file #2)
├── netlify.toml             # ← root, builds FRONTEND only (file #3)
└── README.md
```

Rules that make this work:

- **Root `Dockerfile`** — Render's Docker path looks for `./Dockerfile` at repo
  root. It must `COPY backend/` only; the frontend is built by Netlify/Vercel.
- **Frontend never talks to localhost** — every API URL comes from
  `process.env.NEXT_PUBLIC_API_URL || "<dev-url>"`. Zero hardcoded hosts.
- **Backend has `/health`** — used as Render's health check and by the
  wake-up ping.
- **Auth via Bearer token (localStorage), not cookies** — then CORS can be a
  simple origin allow-list, no `credentials` dance.

---

## 2. The three files to copy into a new repo

### File #1 — `Dockerfile` (repo root)

```dockerfile
FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y gcc libpq-dev && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

EXPOSE 8000
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
```

- `${PORT}` is mandatory: Render assigns the port and its router follows it.
- For Django/Flicorn-style apps, swap the CMD; keep the `COPY backend/` shape.
- gunicorn behind a reverse proxy (nginx) also needs `--bind 0.0.0.0:$PORT`.

### File #2 — `.dockerignore` (repo root)

```
node_modules
.next
.git
.env
*.md
frontend
**/__pycache__
*.pyc
```

Keeps the image tiny (never ship `frontend/`, venvs, or local `.env`).

### File #3 — `netlify.toml` (repo root)

```toml
[build]
  base = "frontend"
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "22"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

---

## 3. Render — deploy the backend (API + DB)

**3.1 Create the service**

1. Push the repo to GitHub first.
2. Render → **New → Web Service** → connect the repo.
3. Settings:
   - **Runtime**: Docker (it picks up the root `Dockerfile` automatically)
   - **Instance type**: Free (spins down after ~15 min idle — see §6)
4. **Do not deploy yet** — add the environment variables first (3.2).

*Alternative:* `render.yaml` at the repo root can provision everything via
**New → Blueprint**, but a manual Docker service is simpler and is what this
repo runs on.

**3.2 Environment variables** (service → Environment → Add)

| Key | Value | Notes |
|-----|-------|-------|
| `DATABASE_URL` | `postgresql+asyncpg://USER:PASS@ep-xxx.aws.neon.tech/DB?ssl=require` | **Direct** Neon endpoint. See the 4 rules below. |
| `JWT_SECRET_KEY` | 64 random chars | `python -c "import secrets;print(secrets.token_hex(32))"` |
| `CORS_ORIGINS` | `["https://your-site.netlify.app"]` | **JSON array**, exact origin, no trailing slash |
| `DEBUG` | `false` | hides `/docs`, `/redoc` in production |

**`DATABASE_URL` — the 4 rules (every pasting mistake lives here):**

1. Scheme must be **`postgresql+asyncpg://`** — plain `postgresql://` loads the
   sync psycopg2 driver and the async app refuses to boot.
2. Host must be the **direct** endpoint — **no `-pooler`** (Neon's transaction
   pooler breaks asyncpg prepared statements).
3. Param is **`?ssl=require`** — not `sslmode=require` (libpq syntax, asyncpg
   rejects it), no `channel_binding=...` (asyncpg rejects that kwarg too).
4. Never copy your local `.env` wholesale — it contains `localhost` values
   (DB port, `CORS_ORIGINS=["http://localhost:3000",...]`) that silently break
   the deployed app.

Quick generate step:

```powershell
# paste value directly from local .env, then fix the scheme:
(Get-Content backend/.env | Select-String '^DATABASE_URL=').Line `
  -replace '^DATABASE_URL=postgresql://', 'DATABASE_URL=postgresql+asyncpg://' `
  -replace '-pooler', '' -replace 'sslmode=require', 'ssl=require'
```

5. **Save** → Render rebuilds + restarts (~30–60 s).

**3.3 Verify the backend**

```powershell
curl https://your-api.onrender.com/health
# → {"status":"healthy","version":"1.0.0"}
```

(Cold first hit after idle: ~50 s. That's the free tier, not an error.)

---

## 4. Netlify — deploy the frontend

1. Netlify → **Add new site → Import an existing project** → pick the repo.
   `netlify.toml` already sets `base = frontend` — accept the defaults.
2. **Before the first build**: Site settings → **Environment variables** →
   add:

   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_API_URL` | `https://your-api.onrender.com/api/v1` |

3. Deploy. Done — the URL appears in Site information.

> `NEXT_PUBLIC_*` is **inlined at build time**. Change it later →
> **Deploy → Trigger deploy → Clear cache and deploy site**. Editing the var
> without rebuilding does nothing.

**Verify the frontend talks to the real API:**

```powershell
# the built JS must contain the onrender URL and ZERO localhost:8000
$html = curl https://your-site.netlify.app/login
# grab /_next/static/*.js chunk URLs from $html, fetch them, search for "onrender.com"
```

Or just open the site → login → works = done.

---

## 5. Vercel — same project, alternative host

1. Vercel → **Add New → Project** → import the repo.
2. Set **Root Directory** = `frontend` (Vercel auto-detects Next.js).
3. **Settings → Environment Variables** → add `NEXT_PUBLIC_API_URL`
   (same value as Netlify) — **before** deploying.
4. Deploy.

Differences vs Netlify: no `netlify.toml` needed (Vercel reads
`root directory` + `package.json`), previews every PR branch automatically,
same build-time rule for `NEXT_PUBLIC_*`.

---

## 6. Free-tier realities (both platforms)

| Behavior | What to do |
|---|---|
| Render free **spins down** after ~15 min idle → first request ~50 s | Pinger component (below) on the frontend |
| Neon free **autosuspends** after ~5 min | Backend keep-alive task (below) |
| Cold DB connection ~1.5–4 s on first query | Covered by the keep-alive ping |

**Frontend wake-up** — drop into the root layout:

```tsx
// components/common/WakeBackend.tsx
"use client";
import { useEffect } from "react";
export default function WakeBackend() {
  useEffect(() => {
    const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/api\/v1$/, "");
    if (!base) return;
    const ping = () => fetch(`${base}/health`, { keepalive: true }).catch(() => {});
    ping();
    const id = setInterval(ping, 10 * 60 * 1000); // stay under the 15-min idle window
    return () => clearInterval(id);
  }, []);
  return null;
}
```

**Backend keep-alive** — in `app/main.py`:

```python
@app.on_event("startup")
async def startup_event():
    async def _ping():
        while True:
            await asyncio.sleep(240)  # < Neon's 5-min autosuspend
            try:
                async with engine.connect() as conn:
                    await conn.execute(sa_text("SELECT 1"))
            except Exception:
                pass
    asyncio.create_task(_ping())
```

Remove both once you move to paid tiers.

---

## 7. Go-live checklist

```
[ ] Repo pushed to GitHub (no .env committed — gitignored)
[ ] backend/app has GET /health
[ ] Root Dockerfile (COPY backend/, binds ${PORT})
[ ] Root .dockerignore (excludes frontend/, .env)
[ ] Root netlify.toml (base = frontend, NODE_VERSION 22, nextjs plugin)
[ ] No hardcoded localhost/127.0.0.1 in frontend source (env fallback only)
[ ] Render: Docker service created, 4 env vars set → /health 200
[ ] Netlify/Vercel: NEXT_PUBLIC_API_URL set BEFORE first build
[ ] Site loads, login works
[ ] CORS_ORIGINS = exact frontend origin (JSON array)
[ ] DEBUG=false on Render (hides /docs)
```

---

## 8. Troubleshooting — the exact failures this repo hit

| Symptom | Cause | Fix |
|---|---|---|
| API: login POST → **500 in 0.3 s** | `DATABASE_URL` unset → falls back to `localhost:5433` | Set it on Render (correct form, §3.2) |
| API: app **won't boot** after setting `DATABASE_URL` | plain `postgresql://` scheme, or `channel_binding`/`sslmode` params | `postgresql+asyncpg://...?ssl=require`, no pooler host |
| `prepared statement ... already exists` | Neon **`-pooler`** host with asyncpg | Use the direct endpoint |
| Browser: “Cannot connect to backend” though API `/health` is 200 | `NEXT_PUBLIC_API_URL` missing at build → bundle calls `localhost:8000` | Set env **before** build → clear cache + rebuild |
| Browser: CORS blocked | `CORS_ORIGINS` missing (defaults `*` is fine for Bearer auth) or wrong origin | `'["https://exact-origin"]'` as JSON array, no trailing slash |
| Testing CORS with a script and seeing “no headers” | CDN (Cloudflare) sends **lowercase** header names | Look up headers case-insensitively |
| Render: `./Dockerfile not found` | Dockerfile lives in `backend/` | Root-level Dockerfile that `COPY backend/` |
| Render build: `COPY failed: ... frontend` | `.dockerignore` missing | Add `frontend` to `.dockerignore` |
| Swagger `/docs` open in prod | `DEBUG` unset (defaults true) | `DEBUG=false` |
| First request after idle takes ~50 s | Free-tier spin-down | §6 pinger; or upgrade |
