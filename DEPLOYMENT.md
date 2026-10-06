# Deployment Guide — Klyron ERP to a Server

## Quick go-live: Render (API) + Netlify (web) + Neon (DB)

The repo is configured so both platforms build from a plain import — no localhost anywhere.

**1. Render → New → Blueprint → pick this repo**
- `render.yaml` provisions the API (`rootDir: backend`, Python 3.12, `/health` check).
- It prompts for one secret: **`DATABASE_URL`** — paste the Neon *direct* endpoint in asyncpg form:
  `postgresql+asyncpg://USER:PASS@ep-xxx.aws.neon.tech/DB?ssl=require`
  (must end in `?ssl=require`, NOT `-pooler` host).
- `JWT_SECRET_KEY` is generated automatically. Service URL: `https://klyron-erp.onrender.com`.

**2. Netlify → Add new site → import this repo**
- `netlify.toml` handles build (`base = frontend`) + Next.js runtime; set `NODE_VERSION = 22`.
- Set env var **before the first build** (Site settings → Environment variables):

  | Key | Value |
  |-----|-------|
  | `NEXT_PUBLIC_API_URL` | `https://klyron-erp.onrender.com/api/v1` |

  (Netlify site: `https://klyron-erp.netlify.app`)

- `NEXT_PUBLIC_*` is inlined at build time — changing it later requires a rebuild (Deploy → Retry deploy).

**3. Done.** CORS defaults to `*` (Bearer-token auth, no cookies) so the Netlify site works immediately.
Backend in-process cache (30s) + write-through invalidation + Neon keep-alive ping are already in the code.

Notes:
- Render free + Neon free both suspend when idle: first request after idle takes ~5-50s, then warm.
- To hard-lock CORS later, set `CORS_ORIGINS` on Render to a JSON array: `'["https://site.netlify.app"]'`.
- Latency: DB in Ohio costs ~241ms/round-trip from Asia. Moving Neon to `aws-ap-southeast-1` (Singapore) is the big speed lever; also pick Render region `singapore`.

---

## Legacy: self-hosted Docker runbook (original)

Full runbook: local prep → Ubuntu server install → Docker deploy → HTTPS.

Stack runs entirely in Docker. **No Node/Python/Postgres needed on the server.**

| Container | Image | Internal port | Host binding |
|-----------|-------|---------------|--------------|
| `klyron_postgres` | postgres:16-alpine | 5432 | `127.0.0.1:5433` |
| `klyron_redis` | redis:7-alpine | 6379 | `127.0.0.1:6379` |
| `klyron_pgadmin` | dpage/pgadmin4 | 80 | `127.0.0.1:5050` |
| `klyron_backend` | built from `backend/Dockerfile` | 8000 | `127.0.0.1:8000` |
| `klyron_frontend` | built from `frontend/Dockerfile` | 3000 | `127.0.0.1:3000` |

Caddy (host) terminates HTTPS and routes `/api/*` → backend, everything else → frontend.

---

## 0. What had to change to be deployable

| File | Why |
|------|-----|
| `frontend/next.config.ts` | added `output: "standalone"` — the Dockerfile copies `.next/standalone`, which was never generated |
| `frontend/Dockerfile` | `ARG`/`ENV NEXT_PUBLIC_API_URL` so the API URL is baked at build time (Next.js inlines `NEXT_PUBLIC_*` during build, runtime env is too late) |
| `backend/app/main.py` | CORS was a localhost-only regex → would block a real domain |
| `docker-compose.yml` | added `backend` + `frontend` services (only DB/Redis/pgAdmin existed); DB/Redis/pgAdmin ports bound to `127.0.0.1` so they are not exposed publicly |

---

## A. Local machine (PowerShell)

```powershell
cd C:\Users\Triangle\OneDrive\Desktop\Work\klyron-erp

# 1. start docker + DB, dump current schema + seed data
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
Start-Sleep 30
docker compose up -d postgres
Start-Sleep 10
docker exec klyron_postgres pg_dump -U klyron_borhan -d klyron_erp --clean --if-exists -f /tmp/klyron.sql
docker cp klyron_postgres:/tmp/klyron.sql .\klyron_dump.sql
docker compose down

# 2. push code
git add -A
git commit -m "deploy: standalone build, env-driven CORS, compose app services"
git push origin main
```

> Always use `--clean --if-exists`. A plain dump errors against `init.sql`, which already creates the extensions and enum types.

**Why dump instead of `alembic upgrade head`:** your first revision only runs
`op.add_column("employees", ...)` — the base tables are never created by a migration
(`Base.metadata.create_all` did that). On an empty DB, migrations fail immediately.
The dump carries `alembic_version`, so schema and migrations stay consistent.

---

## B. Server — what to install (Ubuntu 22.04 / 24.04)

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y ca-certificates curl git gnupg ufw

# --- Docker Engine + Compose plugin ---
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# run docker without sudo
sudo usermod -aG docker $USER
newgrp docker

# --- firewall ---
sudo ufw allow OpenSSH
sudo ufw allow 80,443/tcp
sudo ufw enable

# --- Caddy: reverse proxy + free auto-HTTPS ---
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list > /dev/null
sudo apt update && sudo apt install -y caddy

# --- verify ---
docker --version && docker compose version && caddy version
```

---

## C. Server — configure

```bash
git clone https://github.com/borhanrahi/klyron-erp.git
cd klyron-erp

PW='PUT_A_LONG_RANDOM_PASSWORD_HERE'   # rotate this — the old one is in git history

# backend env (note: host is "postgres", not localhost)
cat > backend/.env <<EOF
DATABASE_URL=postgresql+asyncpg://klyron_borhan:${PW}@postgres:5432/klyron_erp
REDIS_URL=redis://redis:6379/0
JWT_SECRET_KEY=$(openssl rand -hex 32)
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
JWT_REFRESH_TOKEN_EXPIRE_DAYS=7
APP_NAME=Klyron ERP
APP_VERSION=1.0.0
APP_DEBUG=false
DEBUG=false
CORS_ORIGINS=["https://YOURDOMAIN.COM","http://YOURDOMAIN.COM"]
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@YOURDOMAIN.COM
SUPER_ADMIN_EMAIL=borhanuddin.bd2026@gmail.com
SUPER_ADMIN_PASSWORD=Admin@123456
EOF

# build-time API URL (root .env, read by docker compose for interpolation)
cat > .env <<EOF
NEXT_PUBLIC_API_URL=https://YOURDOMAIN.COM/api/v1
EOF

# same password in compose — the postgres container and the backend must match
sed -i "s|pOA521453269!@@|${PW}|g" docker-compose.yml
grep -c "$PW" docker-compose.yml   # expect 2 (postgres + pgadmin)
```

Set `DEBUG=true` temporarily if you want Swagger UI at `/docs` in production —
with `false`, `/docs` and `/redoc` are disabled and SQL echo is off.

Neither `.env` file is committed (both gitignored), so they must be created on
every server by hand.

---

## D. Server — run + load the database

```bash
docker compose up -d --build          # builds backend + frontend, starts postgres + redis
docker compose ps                     # everything should be Up / running

# restore your local DB (schema + alembic version + seed data)
# run this from LOCAL first:  scp klyron_dump.sql root@YOURSERVER:/tmp/
docker compose exec -T -e PGPASSWORD="$PW" postgres psql -U klyron_borhan -d klyron_erp < /tmp/klyron_dump.sql

# health check (backend container is slim — no curl, but httpx is installed)
docker compose exec backend python -c "import httpx;print(httpx.get('http://localhost:8000/health').text)"
```

---

## E. HTTPS / domain

Point the `A` record for `YOURDOMAIN.COM` at the server IP, then:

```bash
sudo tee /etc/caddy/Caddyfile <<'EOF'
YOURDOMAIN.COM {
	encode gzip
	handle /api/*        { reverse_proxy localhost:8000 }
	handle /docs*        { reverse_proxy localhost:8000 }
	handle /redoc*       { reverse_proxy localhost:8000 }
	handle /health       { reverse_proxy localhost:8000 }
	handle /openapi.json { reverse_proxy localhost:8000 }
	handle               { reverse_proxy localhost:3000 }
}
EOF
sudo systemctl reload caddy
```

### No domain yet

Skip Caddy entirely and reach the app at `http://SERVER_IP:3000`:

```bash
sudo ufw allow 3000/tcp
```

Then change the frontend port binding in `docker-compose.yml` from
`127.0.0.1:3000:3000` to `3000:3000`, and set
`NEXT_PUBLIC_API_URL=http://SERVER_IP:8000/api/v1` in the root `.env`
(bind the backend to `0.0.0.0:8000:8000` as well). Remember to rebind both to
`127.0.0.1` once a domain + Caddy are in place.

---

## F. Verify

```bash
curl -I https://YOURDOMAIN.COM                 # 200
curl https://YOURDOMAIN.COM/health              # {"status":"healthy","version":"1.0.0"}
```

Then open `https://YOURDOMAIN.COM/login` and sign in with the Admin account
(`borhanuddin.bd2026@gmail.com` / `Admin@123456`). See README for the full list
of demo users.

Browser console showing CORS errors? Check `CORS_ORIGINS` in `backend/.env`
(exact scheme + host, no trailing slash) and restart: `docker compose restart backend`.

---

## G. Daily operations

```bash
git pull
docker compose up -d --build       # rebuild + restart changed services
docker compose logs -f backend     # tail API logs
docker compose logs -f frontend

docker compose ps                  # container status
docker compose restart backend     # quick restart, no rebuild
docker compose down                # stop everything (keeps DB volume)
```

DB data lives in the named volume `postgres_data` and survives `docker compose
down`. To wipe it: `docker compose down -v`.

### Rotating secrets

```bash
PW='NEW_PASSWORD'
sed -i "s|OLD_PASSWORD|${PW}|g" docker-compose.yml
sed -i "s|OLD_PASSWORD|${PW}|g" backend/.env
docker compose up -d postgres backend   # recreate with new creds
```

Changing `JWT_SECRET_KEY` logs everyone out (all tokens become invalid).

---

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| `COPY failed: file not found .next/standalone` | `output: "standalone"` missing in `frontend/next.config.ts` |
| Frontend loads but every API call hits `localhost:8000` | `NEXT_PUBLIC_API_URL` not set in root `.env` — it is baked at **build** time, so rerun `docker compose build frontend` |
| Browser console: CORS blocked | `CORS_ORIGINS` in `backend/.env` doesn't match the origin exactly |
| `relation "employees" does not exist` on migrate | DB not restored — run the dump restore in step D, do not run `alembic upgrade head` on an empty DB |
| `password authentication failed` | `docker-compose.yml` and `backend/.env` passwords differ |
| Backend exits immediately | `docker compose logs backend` — usually a bad `DATABASE_URL` (host must be `postgres`) |
| Frontend 404 on all routes | `.next/static` not copied — check the `frontend/Dockerfile` `COPY` steps ran in the `runner` stage |

---

## Deliberately skipped

- **Celery worker** — `celery` is not in `requirements.txt`; `app/jobs/scheduler.py` is dead code. Redis is only referenced by that file. Add a worker service when scheduled jobs are actually needed. (Classic PM2 mode skips installing Redis entirely.)
- **`pgAdmin` on the server** — bound to `127.0.0.1`, so it is unreachable from outside. Use an SSH tunnel (`ssh -L 5050:127.0.0.1:5050 user@server`) or drop the service in production.
- **Seed scripts on the server** — `backend/scripts/seed_*.py` hardcode
  `localhost:5433` and a stale password, so they will not work inside a container.
  The DB dump replaces them.

---

## H. Classic deployment (PM2 + Node, no Docker) — test this first

Sections A–G run everything in containers. This section runs the same stack
**raw on the host**: Postgres from apt, Python venv + uvicorn under PM2, Next.js
under PM2, Nginx in front. It is the classic shape — every process visible in
`pm2 list`, logs in `~/.pm2/logs`, no container layer between you and the code.

Same DB dump from step A applies. Do **not** install Redis — it is only used by
the dead Celery code.

### H.1 Install

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y ca-certificates curl git gnupg ufw build-essential

# --- Node.js + PM2 ---
# Ubuntu 24.04+ ships Node 22, which is fine for Next.js 16. Use it and skip
# NodeSource: its setup script can leave dpkg half-broken (node-corepack).
sudo apt install -y nodejs npm
sudo npm install -g pm2

# Only if you specifically need Node 20 (and nothing is broken yet):
# curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
# sudo apt install -y nodejs

# Already in a broken NodeSource state? Repair first:
# sudo dpkg --configure -a
# sudo apt --fix-broken install -y
# sudo rm -f /etc/apt/sources.list.d/nodesource.list*
# sudo apt update

# --- Python 3.12 (Ubuntu 24.04 ships it; 22.04 needs deadsnakes) ---
sudo apt install -y python3.12 python3.12-venv python3.12-dev
# 22.04 only:
# sudo add-apt-repository -y ppa:deadsnakes/ppa && sudo apt update
# sudo apt install -y python3.12 python3.12-venv python3.12-dev

# --- PostgreSQL ---
sudo apt install -y postgresql
sudo systemctl enable --now postgresql

# --- Nginx ---
sudo apt install -y nginx
sudo systemctl enable --now nginx

# --- firewall ---
sudo ufw allow OpenSSH
sudo ufw allow 80,443/tcp
sudo ufw enable

# --- verify ---
node -v && npm -v && pm2 -v && python3.12 --version && psql --version && nginx -v
```

### H.2 Database

```bash
PW='PUT_A_LONG_RANDOM_PASSWORD_HERE'

sudo -u postgres psql -c "CREATE USER klyron_borhan WITH PASSWORD '${PW}';"
sudo -u postgres createdb -O klyron_borhan klyron_erp
sudo -u postgres psql -d klyron_erp -c 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; CREATE EXTENSION IF NOT EXISTS "pgcrypto";'

# restore the local dump (schema + alembic_version + seed data)
# from LOCAL:  scp klyron_dump.sql root@YOURSERVER:/tmp/
PGPASSWORD="$PW" psql -h 127.0.0.1 -U klyron_borhan -d klyron_erp < /tmp/klyron_dump.sql
```

Postgres only listens on `127.0.0.1` by default — no firewall change needed.

### H.3 Backend (venv + uvicorn)

```bash
git clone https://github.com/borhanrahi/klyron-erp.git
cd klyron-erp/backend

python3.12 -m venv .venv
.venv/bin/pip install --upgrade pip
.venv/bin/pip install -r requirements.txt

cat > .env <<EOF
DATABASE_URL=postgresql+asyncpg://klyron_borhan:${PW}@127.0.0.1:5432/klyron_erp
REDIS_URL=redis://127.0.0.1:6379/0
JWT_SECRET_KEY=$(openssl rand -hex 32)
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
JWT_REFRESH_TOKEN_EXPIRE_DAYS=7
APP_NAME=Klyron ERP
APP_VERSION=1.0.0
APP_DEBUG=false
DEBUG=false
CORS_ORIGINS=["https://YOURDOMAIN.COM","http://YOURDOMAIN.COM"]
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@YOURDOMAIN.COM
SUPER_ADMIN_EMAIL=borhanuddin.bd2026@gmail.com
SUPER_ADMIN_PASSWORD=Admin@123456
EOF

cd ..
```

> Host is `127.0.0.1:5432` here, not `postgres:5432` (that only resolves inside
> the Docker network). Port is `5432`, not `5433` — `5433` was the Docker
> host mapping.

Smoke test before wiring PM2:

```bash
cd backend && .venv/bin/python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 &
sleep 5
curl http://127.0.0.1:8000/health     # {"status":"healthy"}
kill %1
```

### H.4 Frontend (build + Node server)

```bash
cd frontend
npm ci

printf 'NEXT_PUBLIC_API_URL=%s\n' 'https://YOURDOMAIN.COM/api/v1' > .env.local

npm run build        # bakes NEXT_PUBLIC_API_URL into the bundle
cd ..
```

`NEXT_PUBLIC_API_URL` is inlined at **build** time. Change the domain later →
edit `.env.local` and rebuild, editing the running server does nothing.

### H.5 PM2

`ecosystem.config.js` at the repo root already defines both apps:

| name | process | binds |
|------|---------|-------|
| `klyron-api` | `.venv/bin/python -m uvicorn app.main:app` | `127.0.0.1:8000` |
| `klyron-web` | `next start -p 3000 -H 127.0.0.1` | `127.0.0.1:3000` |

```bash
cd klyron-erp
pm2 start ecosystem.config.js
pm2 status                       # both should be online
pm2 logs                         # Ctrl+C to exit, processes keep running
pm2 save                         # snapshot the process list

# survive a reboot
pm2 startup                      # prints a sudo systemd command — run it
```

Useful commands:

```bash
pm2 restart klyron-api
pm2 reload klyron-web             # zero-downtime reload
pm2 describe klyron-api
pm2 logs klyron-api --lines 100
pm2 delete klyron-web             # stop + remove
pm2 restart all
```

### H.6 Nginx + HTTPS (Let's Encrypt)

```bash
sudo tee /etc/nginx/sites-available/klyron <<'EOF'
server {
    listen 80;
    server_name YOURDOMAIN.COM;
    client_max_body_size 50M;

    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";

    location /api/        { proxy_pass http://127.0.0.1:8000; }
    location /docs        { proxy_pass http://127.0.0.1:8000; }
    location /redoc       { proxy_pass http://127.0.0.1:8000; }
    location /openapi.json { proxy_pass http://127.0.0.1:8000; }
    location /health      { proxy_pass http://127.0.0.1:8000; }

    location /            { proxy_pass http://127.0.0.1:3000; }
}
EOF

sudo ln -sf /etc/nginx/sites-available/klyron /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

# free HTTPS certificate + auto-renewal
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d YOURDOMAIN.COM --redirect --non-interactive --agree-tos -m you@email.com
sudo systemctl status certbot.timer     # renewal timer
```

No domain yet: skip certbot and hit `http://SERVER_IP` directly (Nginx's
`server_name` is then ignored for the default server).

### H.7 Verify + update

```bash
curl -I https://YOURDOMAIN.COM            # 200
curl https://YOURDOMAIN.COM/health         # {"status":"healthy"}
pm2 list                                  # klyron-api + klyron-web online
```

Manual update:

```bash
cd klyron-erp
git pull --ff-only
cd frontend && npm ci && npm run build && cd ..
cd backend && .venv/bin/pip install -r requirements.txt && cd ..
pm2 reload ecosystem.config.js --update-env
pm2 save
```

Fresh empty database (instead of a dump) — creates every table, then marks
migrations as already applied:

```bash
cd backend
.venv/bin/python - <<'PY'
import asyncio
from app.database import engine, Base
import app.models.base  # noqa: F401  (registers every model)

async def main():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

asyncio.run(main)
PY
.venv/bin/alembic stamp head
cd ..
```

Then seed. The seed scripts hardcode `localhost:5433` + a stale password, so
point them at the real DB first:

```bash
sed -i 's|postgresql+asyncpg://[^"]*|postgresql+asyncpg://klyron_borhan:'"$PW"'@127.0.0.1:5432/klyron_erp|' backend/scripts/seed_*.py
cd backend
.venv/bin/python scripts/seed_data.py
.venv/bin/python scripts/seed_all_modules.py
.venv/bin/python scripts/seed_activity.py
cd ..
```

---

## I. CI/CD (GitHub Actions)

Workflow lives at `.github/workflows/deploy.yml`.

```
push to main  ──►  test job  ──►  deploy_pm2   (classic, default)
workflow_dispatch(target=docker) ──► test ──► deploy_docker
```

The **test** job always runs: frontend `npm ci` + `typecheck` + `next build`,
backend `pip install` + `compileall`. Nothing deploys if it fails.

The **deploy** job SSHes into the server, pulls, rebuilds, and reloads PM2 —
or runs `docker compose up -d --build` when you pick the Docker target from the
Actions tab.

### I.1 One-time setup

**Repository secrets** (Settings → Secrets and variables → Actions → Secrets):

| Secret | Value |
|--------|-------|
| `SSH_HOST` | server IP or hostname |
| `SSH_USER` | e.g. `root` or `deploy` |
| `SSH_PRIVATE_KEY` | private key whose public half is in `~/.ssh/authorized_keys` on the server |

**Repository variables** (same page, Variables tab):

| Variable | Value |
|----------|-------|
| `APP_DIR` | absolute path to the clone, e.g. `/root/klyron-erp` |
| `NEXT_PUBLIC_API_URL` | e.g. `https://YOURDOMAIN.COM/api/v1` |

Generate a deploy key locally:

```powershell
ssh-keygen -t ed25519 -f klyron_deploy -N '""'
type klyron_deploy.pub        # paste into server ~/.ssh/authorized_keys
type klyron_deploy            # paste into the SSH_PRIVATE_KEY secret
```

Server user needs passwordless sudo for the PM2 reload, or run the deploy job
as a user that owns `~/.pm2`. Easiest: deploy as the same user you ran
`pm2 startup` for.

### I.2 GitHub-side checks that matter

- `NEXT_PUBLIC_API_URL` must be set as a **variable**, not a secret — the test
  job's build reads it, and an empty value silently bakes in `localhost:8000`.
- The workflow writes `frontend/.env.local` on the server from that same
  variable before building, so server builds and CI builds agree.
- `pm2 save` in the deploy step keeps the process list current for
  `pm2 startup`, so a reboot brings the new processes back.

### I.3 Run it

```bash
# automatic: push to main
git push origin main

# manual: Actions → CI/CD → Run workflow → pick target (pm2 | docker)
```

Watch it: **Actions** tab → workflow run → `test` → `deploy_pm2`.

### I.4 Switching from PM2 to Docker

Nothing in the pipeline changes — the Docker artifacts (compose file,
Dockerfiles) stay. Once the Docker path is proven by hand (steps A–G), flip the
default: set the `deploy_docker` job's `if:` to run on push and drop
`deploy_pm2`. Both targets are already wired, so it is a two-line edit.
