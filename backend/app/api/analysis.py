import json
import os
import uuid

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.agents.agents import TYPE_TO_MODULE, detect_document_type, get_agent
from app.core.config import settings
from app.core.security import get_current_user
from app.models.database import get_db
from app.models.models import Analysis, Document, Report, User
from app.schemas.schemas import AnalysisOut, DocumentOut
from app.services.activity import log_activity
from app.services.extraction import ALLOWED_TYPES, extract_text, get_file_type
from app.services.report_pdf import generate_pdf

router = APIRouter(prefix="/api/analysis", tags=["analysis"])

MODULES = {"tender", "contract", "compliance", "invoice", "comparator", "meeting", "auto"}


def _save_upload(file: UploadFile, user_id: int, db: Session, module: str) -> tuple[Document, str]:
    file_type = get_file_type(file.filename or "document.txt")
    if file_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '.{file_type}'. Allowed: {', '.join(sorted(ALLOWED_TYPES))}",
        )
    stored_name = f"{uuid.uuid4().hex}.{file_type}"
    stored_path = os.path.join(settings.UPLOAD_DIR, stored_name)
    content = file.file.read()
    if len(content) > 20 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File exceeds 20 MB limit")
    with open(stored_path, "wb") as f:
        f.write(content)
    try:
        text = extract_text(stored_path, file_type)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Could not extract text: {exc}")
    if not text.strip():
        raise HTTPException(status_code=400, detail="No readable text found in the document")
    document = Document(
        user_id=user_id,
        filename=file.filename,
        stored_path=stored_path,
        file_type=file_type,
        size_bytes=len(content),
        module=module,
    )
    db.add(document)
    db.commit()
    db.refresh(document)
    return document, text


def _to_out(analysis: Analysis) -> AnalysisOut:
    return AnalysisOut(
        id=analysis.id,
        module=analysis.module,
        status=analysis.status,
        result=json.loads(analysis.result_json),
        risk_score=analysis.risk_score,
        compliance_score=analysis.compliance_score,
        document=DocumentOut.model_validate(analysis.document) if analysis.document else None,
        second_document=DocumentOut.model_validate(analysis.second_document)
        if analysis.second_document
        else None,
        created_at=analysis.created_at,
        report_id=analysis.report.id if analysis.report else None,
    )


@router.post("/run", response_model=AnalysisOut)
def run_analysis(
    module: str = Form(...),
    file: UploadFile = File(...),
    second_file: UploadFile | None = File(None),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if module not in MODULES:
        raise HTTPException(status_code=400, detail=f"Unknown module '{module}'")

    document, text = _save_upload(file, user.id, db, module)

    if module == "auto":
        detected = detect_document_type(text)
        module = TYPE_TO_MODULE[detected]
        document.detected_type = detected
        document.module = module
        db.commit()

    second_document = None
    text_b = None
    if module == "comparator":
        if second_file is None:
            raise HTTPException(status_code=400, detail="Comparator requires two documents")
        second_document, text_b = _save_upload(second_file, user.id, db, module)

    agent = get_agent(module)
    try:
        output = agent.analyze(text, text_b)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"AI analysis failed: {exc}")

    analysis = Analysis(
        user_id=user.id,
        document_id=document.id,
        second_document_id=second_document.id if second_document else None,
        module=module,
        status="completed",
        result_json=json.dumps(output["result"]),
        risk_score=output["risk_score"],
        compliance_score=output["compliance_score"],
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    pdf_path = None
    try:
        pdf_path = generate_pdf(analysis, document.filename)
    except Exception:
        pdf_path = None
    report = Report(
        analysis_id=analysis.id,
        user_id=user.id,
        title=f"{module.title()} Report – {document.filename}",
        pdf_path=pdf_path,
    )
    db.add(report)
    db.commit()
    db.refresh(analysis)

    log_activity(db, user.id, "analysis_completed", f"{module} analysis of {document.filename}")
    return _to_out(analysis)


@router.get("/history", response_model=list[AnalysisOut])
def history(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    analyses = (
        db.query(Analysis)
        .filter(Analysis.user_id == user.id)
        .order_by(Analysis.created_at.desc())
        .all()
    )
    return [_to_out(a) for a in analyses]


@router.get("/{analysis_id}", response_model=AnalysisOut)
def get_analysis(analysis_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    analysis = (
        db.query(Analysis)
        .filter(Analysis.id == analysis_id, Analysis.user_id == user.id)
        .first()
    )
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return _to_out(analysis)
