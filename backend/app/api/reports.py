import os

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.models.database import get_db
from app.models.models import Report, User
from app.schemas.schemas import ReportOut
from app.services.activity import log_activity
from app.services.report_pdf import generate_pdf

router = APIRouter(prefix="/api/reports", tags=["reports"])


@router.get("", response_model=list[ReportOut])
def list_reports(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return (
        db.query(Report)
        .filter(Report.user_id == user.id)
        .order_by(Report.created_at.desc())
        .all()
    )


@router.get("/{report_id}/download")
def download_report(
    report_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    report = db.query(Report).filter(Report.id == report_id, Report.user_id == user.id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    if not report.pdf_path or not os.path.exists(report.pdf_path):
        document_name = report.analysis.document.filename if report.analysis.document else "document"
        report.pdf_path = generate_pdf(report.analysis, document_name)
        db.commit()
    log_activity(db, user.id, "report_downloaded", report.title)
    return FileResponse(
        report.pdf_path,
        media_type="application/pdf",
        filename=f"ComplyAI_Report_{report.id}.pdf",
    )
