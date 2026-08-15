from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.models.database import get_db
from app.models.models import ActivityLog, Analysis, Document, Report, User
from app.schemas.schemas import ActivityOut, DashboardStats

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/stats", response_model=DashboardStats)
def stats(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    total_documents = db.query(Document).filter(Document.user_id == user.id).count()
    total_analyses = db.query(Analysis).filter(Analysis.user_id == user.id).count()
    total_reports = db.query(Report).filter(Report.user_id == user.id).count()
    avg_risk = (
        db.query(func.avg(Analysis.risk_score))
        .filter(Analysis.user_id == user.id, Analysis.risk_score.isnot(None))
        .scalar()
    )
    avg_compliance = (
        db.query(func.avg(Analysis.compliance_score))
        .filter(Analysis.user_id == user.id, Analysis.compliance_score.isnot(None))
        .scalar()
    )
    by_module = dict(
        db.query(Analysis.module, func.count(Analysis.id))
        .filter(Analysis.user_id == user.id)
        .group_by(Analysis.module)
        .all()
    )
    recent = (
        db.query(ActivityLog)
        .filter(ActivityLog.user_id == user.id)
        .order_by(ActivityLog.created_at.desc())
        .limit(10)
        .all()
    )
    return DashboardStats(
        total_documents=total_documents,
        total_analyses=total_analyses,
        total_reports=total_reports,
        avg_risk_score=round(avg_risk, 1) if avg_risk is not None else None,
        avg_compliance_score=round(avg_compliance, 1) if avg_compliance is not None else None,
        analyses_by_module=by_module,
        recent_activity=[ActivityOut.model_validate(a) for a in recent],
    )
