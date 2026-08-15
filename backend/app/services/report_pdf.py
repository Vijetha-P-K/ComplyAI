import json
import os
from datetime import datetime

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    HRFlowable,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

from app.core.config import settings

NAVY = colors.HexColor("#0B1F3A")
TEAL = colors.HexColor("#0FB5A6")
AMBER = colors.HexColor("#F5A623")

MODULE_TITLES = {
    "tender": "Tender Analysis Report",
    "contract": "Contract & Legal Analysis Report",
    "compliance": "Compliance Review Report",
    "invoice": "Invoice & Purchase Verification Report",
    "comparator": "Document Comparison Report",
    "meeting": "Meeting Minutes Report",
}


def _styles():
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle("H1C", parent=styles["Title"], textColor=NAVY, fontSize=20))
    styles.add(ParagraphStyle("H2C", parent=styles["Heading2"], textColor=TEAL, spaceBefore=10))
    styles.add(ParagraphStyle("BodyC", parent=styles["BodyText"], fontSize=10, leading=14))
    return styles


def _humanize(key: str) -> str:
    return key.replace("_", " ").title()


def _render_value(value, styles, flow, level=0):
    indent = "&nbsp;" * 4 * level
    if isinstance(value, dict):
        for k, v in value.items():
            if isinstance(v, (dict, list)):
                flow.append(Paragraph(f"{indent}<b>{_humanize(k)}:</b>", styles["BodyC"]))
                _render_value(v, styles, flow, level + 1)
            else:
                flow.append(
                    Paragraph(f"{indent}<b>{_humanize(k)}:</b> {v if v is not None else '—'}", styles["BodyC"])
                )
    elif isinstance(value, list):
        if not value:
            flow.append(Paragraph(f"{indent}—", styles["BodyC"]))
        for item in value:
            if isinstance(item, (dict, list)):
                _render_value(item, styles, flow, level)
                flow.append(Spacer(1, 3))
            else:
                flow.append(Paragraph(f"{indent}• {item}", styles["BodyC"]))
    else:
        flow.append(Paragraph(f"{indent}{value}", styles["BodyC"]))


def generate_pdf(analysis, document_name: str) -> str:
    result = json.loads(analysis.result_json)
    styles = _styles()
    reports_dir = os.path.join(settings.UPLOAD_DIR, "reports")
    os.makedirs(reports_dir, exist_ok=True)
    path = os.path.join(reports_dir, f"report_{analysis.id}.pdf")

    doc = SimpleDocTemplate(path, pagesize=A4, topMargin=18 * mm, bottomMargin=18 * mm)
    flow = []
    title = MODULE_TITLES.get(analysis.module, "Analysis Report")
    flow.append(Paragraph("ComplyAI", styles["H2C"]))
    flow.append(Paragraph(title, styles["H1C"]))
    flow.append(Paragraph(
        f"Document: {document_name} &nbsp;|&nbsp; Generated: "
        f"{datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}",
        styles["BodyC"],
    ))
    flow.append(HRFlowable(width="100%", color=TEAL, thickness=2, spaceAfter=8))

    scores = []
    if analysis.risk_score is not None:
        scores.append(["Risk Score", f"{analysis.risk_score:.0f} / 100"])
    if analysis.compliance_score is not None:
        scores.append(["Compliance Score", f"{analysis.compliance_score:.0f} / 100"])
    if scores:
        table = Table(scores, colWidths=[60 * mm, 60 * mm])
        table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (0, -1), NAVY),
            ("TEXTCOLOR", (0, 0), (0, -1), colors.white),
            ("TEXTCOLOR", (1, 0), (1, -1), NAVY),
            ("GRID", (0, 0), (-1, -1), 0.5, TEAL),
            ("FONTSIZE", (0, 0), (-1, -1), 10),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ]))
        flow.append(table)
        flow.append(Spacer(1, 10))

    summary = result.get("executive_summary")
    if summary:
        flow.append(Paragraph("Executive Summary", styles["H2C"]))
        flow.append(Paragraph(str(summary), styles["BodyC"]))

    for key, value in result.items():
        if key in ("executive_summary", "risk_score", "compliance_score"):
            continue
        flow.append(Paragraph(_humanize(key), styles["H2C"]))
        _render_value(value, styles, flow)

    doc.build(flow)
    return path
