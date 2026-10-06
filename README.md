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

## Demo Credentials

The seed script populates the database with **25 users across 7 roles**.

> **All non-admin users use password:** `password123`
>
> The sidebar dynamically shows/hides modules based on your role & permissions.

### Single Admin

| Email | Password | Name | Role | Employee |
|-------|----------|------|------|----------|
| borhanuddin.bd2026@gmail.com | `Admin@123456` | Borhan Uddin | **Admin** | Rahim Uddin (EMP001) |

Demo:
Email	demo.admin.f3bd9cc0@klyron.demo.com
Password	Demo-cdcSKxqSwgii

### Department Managers

These users see **Dashboard, HR management (employees/attendance/leaves/performance), Employee approvals, and Reports**.

| Email | Password | Name | Department |
|-------|----------|------|------------|
| sumaiya@klyron.com | `password123` | Sumaiya Rahman | Product (Product Manager) |
| sabrina@klyron.com | `password123` | Sabrina Islam | Design (Senior Designer / Design Lead) |
| karim@klyron.com | `password123` | Md Karim | Marketing (Marketing Manager) |
| jubayer@klyron.com | `password123` | Jubayer Hossain | Sales (Sales Manager) |
| zahid@klyron.com | `password123` | Zahid Hassan | Operations (Operations Manager) |
| sohel@klyron.com | `password123` | Sohel Rana | QA (QA Manager) |

### Supervisors

These users see **Dashboard, My Team (approve requests), Employee ESS (leave/loans/attendance)**.

| Email | Password | Name | Department |
|-------|----------|------|------------|
| kamal@klyron.com | `password123` | Kamal Hossain | Engineering (Tech Lead) |
| ruma@klyron.com | `password123` | Ruma Akhter | Customer Support (Support Lead) |

### HR Manager

Full **HR module + ESS** access.

| Email | Password | Name |
|-------|----------|------|
| anisur@klyron.com | `password123` | Anisur Rahman |

### Finance Manager

Full **Finance module + Payroll + Loans** access.

| Email | Password | Name |
|-------|----------|------|
| imran@klyron.com | `password123` | Imran Khan |

### Regular Employees

These users see only **Employee Self-Service (ESS)** modules — their own profile, attendance, leave, payroll, loans, benefits, documents, and support tickets.

| Email | Password | Name | Department |
|-------|----------|------|------------|
| rahim@klyron.com | `password123` | Rahim Uddin | Engineering (SWE) |
| fatima@klyron.com | `password123` | Fatima Akter | Engineering (SWE) |
| nusrat@klyron.com | `password123` | Nusrat Jahan | Engineering (DevOps) |
| arif@klyron.com | `password123` | Arif Hasan | Engineering (QA) |
| tanvir@klyron.com | `password123` | Tanvir Ahmed | Design (UI/UX Designer) |
| tasnim@klyron.com | `password123` | Tasnim Fahmida | Marketing (Content Writer) |
| farhana@klyron.com | `password123` | Farhana Parveen | Sales (Account Executive) |
| nadia@klyron.com | `password123` | Nadia Sultana | Finance (Accountant) |
| mst@klyron.com | `password123` | Mst Khatun | HR (HR Executive) |
| ayesha@klyron.com | `password123` | Ayesha Khanam | Engineering (SWE) |
| badrul@klyron.com | `password123` | Badrul Alam | Engineering (SWE) |
| shirin@klyron.com | `password123` | Shirin Sultana | Product (Product Analyst) |
| rakibul@klyron.com | `password123` | Rakibul Islam | Sales (Sales Executive) |
| jahanara@klyron.com | `password123` | Jahanara Begum | Finance (Sr. Accountant) |

### Role Permissions Summary

| Role | Groups Visible in Sidebar | Key Actions |
|------|--------------------------|-------------|
| **Admin** | All modules | Full CRUD + approve on everything |
| **Manager** | Dashboard, HR, Employee, Reports | Manage team, approve leaves/loans, view reports |
| **Supervisor** | Dashboard, HR → My Team, Employee | Approve team requests, ESS self-service |
| **HR Manager** | Dashboard, HR, Employee | Full HR management (employees, payroll, training) |
| **Finance Manager** | Dashboard, Finance, HR → Payroll/Loans | Full finance operations + approvals |
| **Employee** | Dashboard, Employee | ESS self-service (own profile, leave, loans) |
| **Viewer** | Dashboard, Reports | Read-only |

## Seeding the Database

```bash
cd backend

# Seed HR data + roles (25 users, 7 roles, permissions, payroll, etc.)
uv run python scripts/seed_data.py

# Seed all other modules (sales, finance, inventory, procurement, etc.)
uv run python scripts/seed_all_modules.py

# Seed activity logs and notifications
uv run python scripts/seed_activity.py
```

## Available Scripts

### Backend

| Command | Description |
|---------|-------------|
| `uvicorn app.main:app --reload` | Start dev server |
| `alembic upgrade head` | Run migrations |
| `alembic revision --autogenerate -m "msg"` | Create migration |
| `celery -A app.jobs.scheduler worker -l info` | Start Celery worker |
| `uv run python scripts/seed_data.py` | Seed HR + roles data |

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
DATABASE_URL=postgresql+asyncpg://klyron_borhan:klyron123@localhost:5433/klyron_erp
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
