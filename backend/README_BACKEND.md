# Backend Integrador CardioIA

Executar localmente:

```bash
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Endpoints:
- GET `/`
- POST `/api/sinais`
- GET `/api/leituras`
