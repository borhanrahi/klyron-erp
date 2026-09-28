from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.database import engine
from app.api import api_router
from app.middleware.logging import LoggingMiddleware

app = FastAPI(
    title="Klyron ERP API",
    description="Full-stack ERP System API",
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

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

@app.on_event("startup")
async def startup_event():
    pass

@app.on_event("shutdown")
async def shutdown_event():
    pass
