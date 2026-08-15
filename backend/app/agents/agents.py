"""AI agents — one per business module.

Each agent owns its prompt template and post-processing rules, and returns a
standardized dict: {"result": ..., "risk_score": ..., "compliance_score": ...}.
"""

from app.prompts.templates import (
    COMPARATOR_PROMPT,
    COMPLIANCE_PROMPT,
    CONTRACT_PROMPT,
    DOC_TYPE_PROMPT,
    INVOICE_PROMPT,
    MEETING_PROMPT,
    RAG_PROMPT,
    TENDER_PROMPT,
)
from app.services.groq_service import run_json_prompt, run_prompt


class BaseAgent:
    module = "base"
    prompt = ""

    def analyze(self, document: str, document_b: str | None = None) -> dict:
        kwargs = {"document": document}
        if "{document_b}" in self.prompt:
            kwargs["document_b"] = document_b or ""
        result = run_json_prompt(self.prompt, **kwargs)
        return {
            "result": result,
            "risk_score": _num(result.get("risk_score")),
            "compliance_score": _num(result.get("compliance_score")),
        }


def _num(value):
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


class TenderAgent(BaseAgent):
    module = "tender"
    prompt = TENDER_PROMPT


class ContractAgent(BaseAgent):
    module = "contract"
    prompt = CONTRACT_PROMPT


class ComplianceAgent(BaseAgent):
    module = "compliance"
    prompt = COMPLIANCE_PROMPT


class InvoiceAgent(BaseAgent):
    module = "invoice"
    prompt = INVOICE_PROMPT


class ComparatorAgent(BaseAgent):
    module = "comparator"
    prompt = COMPARATOR_PROMPT


class MeetingAgent(BaseAgent):
    module = "meeting"
    prompt = MEETING_PROMPT


class PolicyAssistantAgent:
    module = "policy_assistant"

    def answer(self, question: str, context_chunks: list[str]) -> str:
        context = "\n\n---\n\n".join(context_chunks) if context_chunks else "(no documents indexed yet)"
        return run_prompt(RAG_PROMPT, context=context, question=question)


AGENTS: dict[str, BaseAgent] = {
    "tender": TenderAgent(),
    "contract": ContractAgent(),
    "compliance": ComplianceAgent(),
    "invoice": InvoiceAgent(),
    "comparator": ComparatorAgent(),
    "meeting": MeetingAgent(),
}

TYPE_TO_MODULE = {
    "tender": "tender",
    "contract": "contract",
    "compliance_policy": "compliance",
    "invoice": "invoice",
    "meeting_notes": "meeting",
    "other": "contract",
}


def detect_document_type(document: str) -> str:
    label = run_prompt(DOC_TYPE_PROMPT, document=document[:4000]).strip().lower()
    for known in TYPE_TO_MODULE:
        if known in label:
            return known
    return "other"


def get_agent(module: str) -> BaseAgent:
    if module not in AGENTS:
        raise ValueError(f"Unknown module: {module}")
    return AGENTS[module]
