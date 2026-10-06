from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import asyncio

from sqlalchemy import text as sa_text

from app.config import settings
from app.database import engine
from app.api import api_router
from app.middleware.logging import LoggingMiddleware
from app.middleware.cache import ResponseCacheMiddleware

app = FastAPI(
    title="Klyron ERP API",
    description="Full-stack ERP System API",
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

# Innermost: added before CORS so cached responses still pass through CORS headers.
app.add_middleware(ResponseCacheMiddleware)

# Auth is Bearer-token (localStorage), not cookies — origins come from CORS_ORIGINS.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(LoggingMiddleware)

app.include_router(api_router)

@app.get("/", tags=["Root"])
async def root():
    return JSONResponse(content={
        "message": "Welcome to Klyron ERP API",
        "version": app.version,
        "docs": "/docs",
        "health": "/health",
        "api_base": "/api/v1",
    })

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}

_keepalive_task = None

@app.on_event("startup")
async def startup_event():
    # ponytail: ping Neon every 4 min so free-tier autosuspend (5 min) never
    # cold-starts a user request (+1.5-4s). Drop this if DB moves to paid/close region.
    global _keepalive_task

    async def _ping():
        while True:
            await asyncio.sleep(240)
            try:
                async with engine.connect() as conn:
                    await conn.execute(sa_text("SELECT 1"))
            except Exception:
                pass

    _keepalive_task = asyncio.create_task(_ping())

@app.on_event("shutdown")
async def shutdown_event():
    if _keepalive_task:
        _keepalive_task.cancel()
