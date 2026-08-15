import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "ComplyAI"
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", "postgresql://complyai:complyai@localhost:5432/complyai"
    )
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "change-me-in-production")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "uploads")
    CHROMA_DIR: str = os.getenv("CHROMA_DIR", "chroma_data")
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "http://localhost:5173")

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.CHROMA_DIR, exist_ok=True)
