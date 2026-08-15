import json
import os
import uuid

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.agents.agents import PolicyAssistantAgent
from app.core.config import settings
from app.core.security import get_current_user
from app.models.database import get_db
from app.models.models import ChatMessage, Document, User
from app.schemas.schemas import DocumentOut, RagAnswer, RagQuestion
from app.services.activity import log_activity
from app.services.extraction import ALLOWED_TYPES, extract_text, get_file_type
from app.services.vector_store import (
    index_document,
    query_knowledge_base,
    remove_document,
)

router = APIRouter(prefix="/api/rag", tags=["policy-assistant"])
assistant = PolicyAssistantAgent()


@router.post("/upload", response_model=DocumentOut)
def upload_to_kb(
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    file_type = get_file_type(file.filename or "document.txt")
    if file_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail=f"Unsupported file type '.{file_type}'")
    stored_name = f"{uuid.uuid4().hex}.{file_type}"
    stored_path = os.path.join(settings.UPLOAD_DIR, stored_name)
    content = file.file.read()
    with open(stored_path, "wb") as f:
        f.write(content)
    try:
        text = extract_text(stored_path, file_type)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Could not extract text: {exc}")
    if not text.strip():
        raise HTTPException(status_code=400, detail="No readable text found in the document")
    document = Document(
        user_id=user.id,
        filename=file.filename,
        stored_path=stored_path,
        file_type=file_type,
        size_bytes=len(content),
        module="policy_assistant",
    )
    db.add(document)
    db.commit()
    db.refresh(document)
    index_document(user.id, document.id, document.filename, text)
    log_activity(db, user.id, "kb_document_added", f"Indexed {document.filename} into knowledge base")
    return document


@router.get("/documents", response_model=list[DocumentOut])
def kb_documents(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return (
        db.query(Document)
        .filter(Document.user_id == user.id, Document.module == "policy_assistant")
        .order_by(Document.uploaded_at.desc())
        .all()
    )


@router.delete("/documents/{document_id}")
def delete_kb_document(
    document_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    document = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.user_id == user.id,
            Document.module == "policy_assistant",
        )
        .first()
    )
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    remove_document(user.id, document.id)
    db.delete(document)
    db.commit()
    return {"deleted": document_id}


@router.post("/ask", response_model=RagAnswer)
def ask(
    payload: RagQuestion,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    chunks, sources = query_knowledge_base(user.id, payload.question)
    try:
        answer = assistant.answer(payload.question, chunks)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"AI answer failed: {exc}")
    db.add(ChatMessage(user_id=user.id, role="user", content=payload.question))
    db.add(
        ChatMessage(
            user_id=user.id, role="assistant", content=answer, sources=json.dumps(sources)
        )
    )
    db.commit()
    log_activity(db, user.id, "policy_question", payload.question[:200])
    return RagAnswer(answer=answer, sources=sources)


@router.get("/history")
def chat_history(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.user_id == user.id)
        .order_by(ChatMessage.created_at.asc())
        .all()
    )
    return [
        {
            "id": m.id,
            "role": m.role,
            "content": m.content,
            "sources": json.loads(m.sources) if m.sources else [],
            "created_at": m.created_at,
        }
        for m in messages
    ]
