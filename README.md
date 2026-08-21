# 🤖 ComplyAI – AI Business Compliance & Document Intelligence Platform

**ComplyAI** is an AI-powered business compliance and document intelligence platform that helps organizations analyze important business documents, identify risks, verify information, compare document versions, and generate actionable insights through specialized AI agents.

The platform combines **AI-powered analysis, document extraction, RAG-based knowledge retrieval, database storage, and automated report generation** into one centralized application.

## 🚀 Features

* 📑 **AI Tender Analyzer** — Analyzes tenders for eligibility, requirements, deadlines, risks, and submission checklists.
* ⚖️ **AI Contract & Legal Analyzer** — Identifies important clauses, potential risks, and provides plain-language explanations.
* ✅ **AI Compliance Checker** — Detects compliance gaps and inconsistencies and provides a compliance score.
* 🧾 **AI Invoice & Purchase Verification** — Identifies mismatches and duplicates and provides payment recommendations.
* 🔄 **AI Business Document Comparator** — Compares two document versions section by section and highlights differences.
* 🧠 **AI Business Policy Assistant** — Uses RAG to answer questions from uploaded company documents.
* 📝 **AI Meeting Minutes Generator** — Extracts decisions, action items, owners, and deadlines from meeting content.
* 📊 **AI Report Center** — Generates downloadable PDF reports for completed analyses.

## 💻 Technology Stack 

| Layer                      | Technologies                   |
| -------------------------- | ------------------------------ |
| 🎨 **Frontend**            | React.js, Vite, Axios          |
| ⚙️ **Backend**             | Python, FastAPI                |
| 🧠 **AI**                  | Groq LLM, Llama 3.3, LangChain |
| 🗄️ **Database**           | PostgreSQL, SQLAlchemy         |
| 🔎 **Vector Database**     | ChromaDB                       |
| 📄 **Document Processing** | PDF, DOCX, TXT, MD, CSV, OCR   |
| 📊 **Reports**             | ReportLab                      |
| 🐳 **Containerization**    | Docker, Docker Compose         |

## 📁 Project Structure

```text
ComplyAI/
├── backend/
│   ├── app/
│   │   ├── api/             # API routes and endpoints
│   │   ├── core/            # Configuration and security
│   │   ├── models/          # Database models
│   │   └── services/        # AI, extraction, activity and report services
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Application pages
│   │   ├── api/             # API client
│   │   └── context/         # Authentication context
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

## 🔄 How It Works

The platform follows an AI-powered document intelligence workflow:

**📄 Document → ⚙️ FastAPI → 🧠 AI Agent → 🔎 Knowledge Retrieval → 📊 Analysis → 📑 Report**

1. 📤 The user uploads a supported business document.
2. 🔍 The system extracts the document content.
3. 🧠 The selected AI agent analyzes the extracted information using the Groq LLM.
4. 🔎 Relevant information is retrieved from the ChromaDB knowledge base when required.
5. 📊 The system generates structured analysis results, scores, risks, or recommendations.
6. 💾 Analysis history and related information are stored in PostgreSQL.
7. 📑 A downloadable PDF report can be generated from the analysis.

## 📄 Supported Documents

ComplyAI supports multiple document formats:

* 📕 **PDF**
* 📘 **DOCX**
* 📄 **TXT**
* 📝 **Markdown**
* 📊 **CSV**
* 🖼️ **PNG / JPG** with OCR support

## 🧩 Main Modules

### 📑 AI Tender Analyzer

Analyzes tender documents and extracts eligibility requirements, deadlines, risks, and submission requirements.

### ⚖️ AI Contract & Legal Analyzer

Reviews contracts and identifies important clauses, potential risks, and legal concerns.

### ✅ AI Compliance Checker

Checks documents for compliance gaps, missing requirements, and inconsistencies.

### 🧾 AI Invoice & Purchase Verification

Verifies invoices and purchase-related documents by detecting mismatches and duplicate information.

### 🔄 AI Business Document Comparator

Compares two versions of a document and highlights changes between them.

### 🧠 AI Business Policy Assistant

Uses **Retrieval-Augmented Generation (RAG)** with ChromaDB to answer questions based on uploaded company policies and documents.

### 📝 AI Meeting Minutes Generator

Converts meeting content into structured decisions, action items, responsible owners, and deadlines.

### 📊 AI Report Center

Provides access to generated analysis reports and downloadable PDF documents.

## 🏗️ System Architecture

```text
                    👤 User
                       │
                       ▼
                🎨 React + Vite
                       │
                    REST API
                       │
                       ▼
                 ⚙️ FastAPI
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
      🧠 Groq       🔎 ChromaDB   🗄️ PostgreSQL
       LLM             RAG
          │            │            │
          └────────────┼────────────┘
                       ▼
                 📊 AI Analysis
                       │
                       ▼
                  📑 PDF Report
```

## 🎯 Project Objective

The objective of **ComplyAI** is to simplify business compliance and document-related workflows by using specialized AI agents to transform complex business documents into clear, structured, and actionable insights.

Instead of manually reviewing every document, users can upload their documents and allow the appropriate AI agent to analyze the information, identify important findings, and generate useful reports.

## ▶️ Run with Docker

From the **ComplyAI project directory**, run:

```bash
docker compose up --build
```

Wait until all required containers are successfully started.

## 🌐 Open the Website

Once the application is running:

👉 **[Open ComplyAI](http://localhost:8080)**

**Local Website:** `http://localhost:8080`

## 🌟 Project Vision

ComplyAI brings **AI-powered document intelligence, compliance analysis, and business decision support** into one unified platform — making complex document workflows faster, smarter, and easier to manage.
