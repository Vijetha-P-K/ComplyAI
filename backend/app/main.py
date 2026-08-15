from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import analysis, auth, dashboard, rag, reports
from app.core.config import settings
from app.models import models  # noqa: F401  (register models with Base)
from app.models.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ComplyAI API",
    description="AI Business Compliance & Document Intelligence Platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.CORS_ORIGINS.split(",")],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(analysis.router)
app.include_router(rag.router)
app.include_router(reports.router)
app.include_router(dashboard.router)


@app.get("/api/health")
def health():
    return {"status": "ok", "service": settings.APP_NAME}
