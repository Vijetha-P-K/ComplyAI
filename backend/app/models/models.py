from datetime import datetime, timezone

from sqlalchemy import (
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship

from app.models.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    company = Column(String(120), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    documents = relationship("Document", back_populates="owner")
    analyses = relationship("Analysis", back_populates="user")
    activities = relationship("ActivityLog", back_populates="user")


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    filename = Column(String(255), nullable=False)
    stored_path = Column(String(500), nullable=False)
    file_type = Column(String(20), nullable=False)
    size_bytes = Column(Integer, default=0)
    detected_type = Column(String(60), nullable=True)
    module = Column(String(60), nullable=True)
    uploaded_at = Column(DateTime(timezone=True), default=utcnow)

    owner = relationship("User", back_populates="documents")


class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=True)
    second_document_id = Column(Integer, ForeignKey("documents.id"), nullable=True)
    module = Column(String(60), nullable=False)
    status = Column(String(20), default="completed")
    result_json = Column(Text, nullable=False)
    risk_score = Column(Float, nullable=True)
    compliance_score = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    user = relationship("User", back_populates="analyses")
    document = relationship("Document", foreign_keys=[document_id])
    second_document = relationship("Document", foreign_keys=[second_document_id])
    report = relationship("Report", back_populates="analysis", uselist=False)


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    analysis_id = Column(Integer, ForeignKey("analyses.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    pdf_path = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    analysis = relationship("Analysis", back_populates="report")


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    action = Column(String(120), nullable=False)
    detail = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    user = relationship("User", back_populates="activities")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    role = Column(String(20), nullable=False)
    content = Column(Text, nullable=False)
    sources = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)
