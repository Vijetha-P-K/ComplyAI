# ComplyAI – AI Business Compliance & Document Intelligence Platform

Enterprise SaaS platform that analyzes tenders, contracts, invoices, policies and meeting
notes with specialized AI agents (Groq Llama 3.3 via LangChain), stores everything in
PostgreSQL, powers a RAG Policy Assistant with ChromaDB, and generates downloadable PDF reports.

## Architecture

```
React (Vite) ──REST/Axios──▶ FastAPI ──LangChain──▶ Groq LLM (Llama 3.3)
                               │
                               ├──SQLAlchemy──▶ PostgreSQL  (users, documents, analyses, reports, activity)
                               ├──────────────▶ ChromaDB    (embeddings, RAG knowledge base)
                               └──ReportLab───▶ PDF reports
```

## Modules

1. **AI Tender Analyzer** – eligibility, requirements, deadlines, risks, submission checklist
2. **AI Contract & Legal Analyzer** – plain-language clauses, risky clauses with legal references, risk score
3. **AI Compliance Checker** – gaps, inconsistencies, compliance score
4. **AI Invoice & Purchase Verification** – mismatches, duplicates, payment recommendation
5. **AI Business Document Comparator** – section-by-section version comparison
6. **AI Business Policy Assistant (RAG)** – ChromaDB-backed Q&A over company documents
7. **AI Meeting Minutes Generator** – decisions, action items, owners, deadlines
8. **AI Report Center** – auto-generated downloadable PDF reports for every analysis

Supported uploads: **PDF, DOCX, TXT, MD, CSV and images (PNG/JPG — via OCR)**.

## Local Development

### Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # set GROQ_API_KEY and DATABASE_URL
uvicorn app.main:app --reload --port 8000
```
Requires PostgreSQL (`createdb complyai`) and `tesseract-ocr` for image OCR.

### Frontend
```bash
cd frontend
npm install
npm run dev   # http://localhost:5173 (proxies /api to :8000)
```

### Docker (full stack)
```bash
GROQ_API_KEY=your-key docker compose up --build
# frontend: http://localhost:8080, API: http://localhost:8000/docs
```

## Deployment

- **Frontend → Vercel**: import the `frontend/` directory, set `VITE_API_URL` to the backend URL.
- **Backend → Render/AWS**: deploy `backend/Dockerfile`, set `DATABASE_URL` (cloud PostgreSQL),
  `GROQ_API_KEY`, `JWT_SECRET_KEY`, `CORS_ORIGINS` (your Vercel URL). Mount a persistent disk for
  `UPLOAD_DIR` and `CHROMA_DIR`.
- **CI**: GitHub Actions builds and lints both apps on every push/PR.

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `GROQ_API_KEY` | Groq API key |
| `GROQ_MODEL` | default `llama-3.3-70b-versatile` |
| `JWT_SECRET_KEY` | secret for JWT signing |
| `CORS_ORIGINS` | comma-separated allowed origins |
| `VITE_API_URL` | (frontend) backend base URL for production |
