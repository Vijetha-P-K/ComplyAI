import json
import re

from langchain_core.prompts import PromptTemplate
from langchain_groq import ChatGroq

from app.core.config import settings


def get_llm(temperature: float = 0.1) -> ChatGroq:
    return ChatGroq(
        api_key=settings.GROQ_API_KEY,
        model=settings.GROQ_MODEL,
        temperature=temperature,
        max_tokens=4096,
    )


def run_prompt(template: str, **kwargs) -> str:
    prompt = PromptTemplate.from_template(template)
    chain = prompt | get_llm()
    result = chain.invoke(kwargs)
    return result.content


def run_json_prompt(template: str, **kwargs) -> dict:
    raw = run_prompt(template, **kwargs)
    return parse_json_response(raw)


def parse_json_response(raw: str) -> dict:
    text = raw.strip()
    fence = re.search(r"```(?:json)?\s*(.*?)```", text, re.DOTALL)
    if fence:
        text = fence.group(1).strip()
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1:
        text = text[start : end + 1]
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        text = re.sub(r",\s*([}\]])", r"\1", text)
        return json.loads(text)
