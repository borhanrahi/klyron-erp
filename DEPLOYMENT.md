# Deployment Guide — Klyron ERP to a Server

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

- **CI/CD** — manual `git pull && docker compose up -d --build` is enough for now.
- **Celery worker** — `celery` is not in `requirements.txt`; `app/jobs/scheduler.py` is dead code. Redis is only referenced by that file. Add a worker service when scheduled jobs are actually needed.
- **`pgAdmin` on the server** — bound to `127.0.0.1`, so it is unreachable from outside. Use an SSH tunnel (`ssh -L 5050:127.0.0.1:5050 user@server`) or drop the service in production.
- **Seed scripts on the server** — `backend/scripts/seed_*.py` hardcode
  `localhost:5433` and a stale password, so they will not work inside a container.
  The DB dump replaces them.
