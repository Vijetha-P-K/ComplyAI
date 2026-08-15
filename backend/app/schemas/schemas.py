from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    company: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    company: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class DocumentOut(BaseModel):
    id: int
    filename: str
    file_type: str
    size_bytes: int
    detected_type: Optional[str] = None
    module: Optional[str] = None
    uploaded_at: datetime

    class Config:
        from_attributes = True


class AnalysisOut(BaseModel):
    id: int
    module: str
    status: str
    result: Any
    risk_score: Optional[float] = None
    compliance_score: Optional[float] = None
    document: Optional[DocumentOut] = None
    second_document: Optional[DocumentOut] = None
    created_at: datetime
    report_id: Optional[int] = None


class ReportOut(BaseModel):
    id: int
    analysis_id: int
    title: str
    created_at: datetime

    class Config:
        from_attributes = True


class RagQuestion(BaseModel):
    question: str


class RagAnswer(BaseModel):
    answer: str
    sources: list[str]


class ActivityOut(BaseModel):
    id: int
    action: str
    detail: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class DashboardStats(BaseModel):
    total_documents: int
    total_analyses: int
    total_reports: int
    avg_risk_score: Optional[float] = None
    avg_compliance_score: Optional[float] = None
    analyses_by_module: dict[str, int]
    recent_activity: list[ActivityOut]
