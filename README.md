# Klyron ERP

Full-stack ERP system built with Next.js 16 and FastAPI.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS v4, Shadcn/ui |
| Backend | FastAPI, SQLAlchemy 2.0 (async), Alembic |
| Database | PostgreSQL (Neon) |
| Cache | Redis |
| Queue | Celery + Redis |

## Prerequisites

- Node.js 18+
- Python 3.12+
- PostgreSQL 16+
- Redis 7+

## Quick Start (Docker)

```bash
docker-compose up
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Postgres: localhost:5432
- Redis: localhost:6379

## Manual Setup

### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Linux/Mac:
source venv/bin/activate
# Windows (Git Bash/MSYS2):
source venv/Scripts/activate
# Windows (CMD):
venv\Scripts\activate.bat
# Windows (PowerShell):
venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Copy environment file
# Linux/Mac:
cp .env.example .env
# Windows (CMD):
copy .env.example .env
# Windows (PowerShell):
Copy-Item .env.example .env
# Edit .env with your database credentials

# Run migrations
alembic upgrade head

# Start the server
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
# Linux/Mac:
cp .env.example .env.local
# Windows (CMD):
copy .env.example .env.local
# Windows (PowerShell):
Copy-Item .env.example .env.local
# Edit .env.local if needed

# Start development server
npm run dev
```

## Available Scripts

### Backend

| Command | Description |
|---------|-------------|
| `uvicorn app.main:app --reload` | Start dev server |
| `alembic upgrade head` | Run migrations |
| `alembic revision --autogenerate -m "msg"` | Create migration |
| `celery -A app.jobs.scheduler worker -l info` | Start Celery worker |

### Frontend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run linter |
| `npm run typecheck` | Type check |

## Project Structure

```
klyron-erp/
├── frontend/                  # Next.js App Router
│   ├── app/                   # App router pages
│   │   ├── (auth)/            # Auth routes (login, register)
│   │   ├── (dashboard)/       # Dashboard routes
│   │   └── api/               # API routes
│   ├── components/            # React components
│   ├── hooks/                 # Custom hooks
│   ├── lib/                   # Utilities
│   ├── services/              # API services
│   ├── stores/                # Zustand stores
│   └── types/                 # TypeScript types
│
├── backend/                   # FastAPI
│   ├── app/
│   │   ├── models/            # SQLAlchemy models
│   │   ├── schemas/           # Pydantic schemas
│   │   ├── routers/           # API routes
│   │   ├── services/          # Business logic
│   │   ├── jobs/              # Celery tasks
│   │   ├── dependencies/      # FastAPI dependencies
│   │   ├── utils/             # Utilities
│   │   └── middleware/         # Middleware
│   ├── alembic/               # Migrations
│   └── tests/                 # Tests
│
├── docs/                      # Documentation
└── docker-compose.yml         # Docker setup
```

## Environment Variables

### Backend (.env)

```env
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/erp_db
REDIS_URL=redis://localhost:6379/0
JWT_SECRET_KEY=your-secret-key
DEBUG=true
ALLOWED_ORIGINS=["http://localhost:3000"]
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
