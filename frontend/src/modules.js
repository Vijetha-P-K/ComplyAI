import {
  FileSearch,
  Scale,
  ShieldCheck,
  Receipt,
  GitCompare,
  MessageSquareText,
  ClipboardList,
  FileBarChart,
} from 'lucide-react'

export const MODULES = [
  {
    key: 'tender',
    name: 'AI Tender Analyzer',
    description:
      'Extract eligibility criteria, technical & financial requirements, deadlines, risks, and a submission checklist from tender documents.',
    icon: FileSearch,
    color: '#0fb5a6',
    path: '/modules/tender',
  },
  {
    key: 'contract',
    name: 'AI Contract & Legal Analyzer',
    description:
      'Simplify legal language, highlight risky clauses with legal references, calculate a legal risk score, and get safer-contract recommendations.',
    icon: Scale,
    color: '#f5a623',
    path: '/modules/contract',
  },
  {
    key: 'compliance',
    name: 'AI Compliance Checker',
    description:
      'Review policies, ISO documents, SOPs and audit reports for missing requirements, regulatory gaps and get a compliance score.',
    icon: ShieldCheck,
    color: '#3b82f6',
    path: '/modules/compliance',
  },
  {
    key: 'invoice',
    name: 'AI Invoice & Purchase Verification',
    description:
      'Verify invoices, POs and receipts — detect mismatches, duplicates, tax issues and financial inconsistencies before payment.',
    icon: Receipt,
    color: '#8b5cf6',
    path: '/modules/invoice',
  },
  {
    key: 'comparator',
    name: 'AI Document Comparator',
    description:
      'Compare two versions of a document to find added, removed and modified clauses, financial and timeline changes with business impact.',
    icon: GitCompare,
    color: '#ec4899',
    path: '/modules/comparator',
  },
  {
    key: 'policy_assistant',
    name: 'AI Business Policy Assistant',
    description:
      'RAG-powered assistant: upload company documents to a knowledge base and ask natural-language questions answered from your documents.',
    icon: MessageSquareText,
    color: '#22a06b',
    path: '/assistant',
  },
  {
    key: 'meeting',
    name: 'AI Meeting Minutes Generator',
    description:
      'Turn transcripts and notes into professional minutes with decisions, action items, owners and deadlines.',
    icon: ClipboardList,
    color: '#f97316',
    path: '/modules/meeting',
  },
  {
    key: 'reports',
    name: 'AI Report Center',
    description:
      'Every analysis auto-generates a professional PDF report with summaries, risks, scores and recommendations — all downloadable.',
    icon: FileBarChart,
    color: '#0b1f3a',
    path: '/reports',
  },
]

export const UPLOAD_MODULES = {
  tender: {
    title: 'AI Tender Analyzer',
    subtitle: 'Upload a tender document (PDF, DOCX, TXT or image) for full AI analysis.',
  },
  contract: {
    title: 'AI Contract & Legal Analyzer',
    subtitle: 'Upload a contract, NDA or agreement to simplify and assess legal risk.',
  },
  compliance: {
    title: 'AI Compliance Checker',
    subtitle: 'Upload a policy, ISO document, SOP or audit report for compliance review.',
  },
  invoice: {
    title: 'AI Invoice & Purchase Verification',
    subtitle: 'Upload an invoice, purchase order, quotation or delivery receipt.',
  },
  comparator: {
    title: 'AI Business Document Comparator',
    subtitle: 'Upload two versions of the same document to compare every section.',
    twoFiles: true,
  },
  meeting: {
    title: 'AI Meeting Minutes Generator',
    subtitle: 'Upload a meeting transcript or notes to generate professional minutes.',
  },
}
