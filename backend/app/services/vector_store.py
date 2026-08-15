import chromadb
from chromadb.utils.embedding_functions import DefaultEmbeddingFunction
from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.core.config import settings

_client = chromadb.PersistentClient(path=settings.CHROMA_DIR)
_embedding_fn = DefaultEmbeddingFunction()

splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=150)


def _collection(user_id: int):
    return _client.get_or_create_collection(
        name=f"kb_user_{user_id}", embedding_function=_embedding_fn
    )


def index_document(user_id: int, document_id: int, filename: str, text: str) -> int:
    chunks = splitter.split_text(text)
    if not chunks:
        return 0
    collection = _collection(user_id)
    collection.add(
        ids=[f"doc{document_id}_chunk{i}" for i in range(len(chunks))],
        documents=chunks,
        metadatas=[
            {"document_id": document_id, "filename": filename, "chunk": i}
            for i in range(len(chunks))
        ],
    )
    return len(chunks)


def query_knowledge_base(user_id: int, question: str, k: int = 5):
    collection = _collection(user_id)
    if collection.count() == 0:
        return [], []
    results = collection.query(query_texts=[question], n_results=min(k, collection.count()))
    docs = results["documents"][0]
    metas = results["metadatas"][0]
    sources = sorted({m["filename"] for m in metas})
    return docs, sources


def remove_document(user_id: int, document_id: int):
    collection = _collection(user_id)
    collection.delete(where={"document_id": document_id})


def kb_document_count(user_id: int) -> int:
    return _collection(user_id).count()
