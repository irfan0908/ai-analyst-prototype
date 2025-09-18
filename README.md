# AI Analyst — Hackathon Prototype (mocked)
### Submission Links
- **MVP Live Demo**: https://ai-analyst-prototype-b4kf.vercel.app/
- **Demo Video**: https://youtu.be/DVsZ9bwumOY 
- **GitHub Repo**: https://github.com/irfan0908/ai-analyst-prototype/tree/main

### About  
This repo contains a simple prototype: React frontend + FastAPI mock backend.
It demonstrates the user flow: upload a pitch deck → analyze (mock) → receive a concise investment memo.

## What is included
- `backend/` FastAPI mock backend with `/upload` and `/analyze/{upload_id}` endpoints.
- `frontend/` React single-page app that uploads files and displays memo results.
- `docs/` Put your final deck, infographics and demo video here.

## How to run locally

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8080
