from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import uuid
import shutil
import os
from typing import Dict, Any

app = FastAPI(title="AI Analyst Mock Backend")

# Allow your frontend origin; in production restrict origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "/tmp/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class AnalyzeResponse(BaseModel):
    thesis: str
    score: int
    strengths: list
    risks: list
    action_items: list
    evidence: Dict[str, Any]

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    """
    Accepts a file upload and returns an upload id.
    In production, you would save to Cloud Storage and return a storage path.
    """
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in {".pdf", ".pptx", ".txt", ".md"}:
        raise HTTPException(status_code=400, detail="Unsupported file type")
    uid = str(uuid.uuid4())
    path = os.path.join(UPLOAD_DIR, f"{uid}{ext}")
    with open(path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    return {"upload_id": uid, "filename": file.filename, "path": path}

@app.post("/analyze/{upload_id}", response_model=AnalyzeResponse)
async def analyze(upload_id: str):
    """
    Mock analysis endpoint - returns a pre-generated memo for the demo.
    Replace this with actual pipeline: Document AI -> embeddings -> vector search -> Vertex generative.
    """
    # In a real implementation you'd look up the uploaded file, parse it, call Document AI & Vertex.
    # For hackathon demo we return a static but realistic example.
    mock_response = {
        "thesis": "AI-driven B2B workflow automation that reduces manual ops costs by 30% for mid-market finance teams.",
        "score": 78,
        "strengths": [
            "Founders have prior exits and deep domain expertise in finance automation.",
            "Clear early revenue with 3 pilot customers and positive feedback.",
            "Product integrates with core accounting systems (reduces onboarding friction)."
        ],
        "risks": [
            "Narrow initial TAM unless upsell strategy expands beyond finance teams.",
            "No public independent security audit yet — potential compliance friction.",
            "Go-to-market currently reliant on channel partners with long sales cycles."
        ],
        "action_items": [
            "Request raw ARR and MRR data; validate churn and LTV:CAC.",
            "Ask for SOC2 or security docs; schedule a security checklist.",
            "Ask for pilot contract terms and typical onboarding time."
        ],
        "evidence": {
            "slide_refs": [
                {"chunk_id": "slide_3_metrics", "text": "Q3 ARR growth = 22%"},
                {"chunk_id": "founder_bio", "text": "Founders: ex-Y Combinator, 2x founder"}
            ]
        }
    }
    return mock_response

@app.get("/health")
def health():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8080)
