# Architecture

## Overview

Klyron ERP is a full-stack enterprise resource planning system built for modern office environments.

## Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** Shadcn/ui
- **State Management:** Zustand (client), TanStack Query (server)
- **Forms:** React Hook Form + Zod

### Backend
- **Framework:** FastAPI (Python 3.12+)
- **ORM:** SQLAlchemy 2.0 (async)
- **Database:** PostgreSQL (Neon)
- **Cache:** Redis
- **Queue:** Celery + Redis
- **Auth:** JWT (python-jose)

## Architecture Pattern

Modular monolith with logical separation:
- Each business domain has its own models, schemas, routers, and services
- Shared utilities and common schemas
- Event bus for module decoupling

## Directory Structure

```
erp-suite/
├── frontend/          # Next.js App Router
├── backend/           # FastAPI
├── docs/              # Documentation
└── docker-compose.yml # Local development
```

## API Convention

- RESTful endpoints under `/api/v1/`
- JWT authentication via Bearer tokens
- RBAC enforced at router level
- Consistent response format with `ResponseModel`
