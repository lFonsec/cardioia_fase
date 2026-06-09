from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from datetime import datetime

app = FastAPI(title="CardioIA Backend Integrador", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SensorPayload(BaseModel):
    patient_id: str = Field(default="paciente-demo")
    temperatura: float
    bpm: int
    spo2: int = 98
    origem: str = "micropython"

class Recommendation(BaseModel):
    risco: str
    probabilidade: float
    recomendacao: str
    timestamp: str

leituras = []

def motor_preditivo(payload: SensorPayload) -> tuple[str, float]:
    score = 0
    if payload.bpm > 140: score += 0.45
    if payload.spo2 < 92: score += 0.35
    if payload.temperatura > 38: score += 0.20
    prob = min(score, 0.95)
    if prob >= 0.70:
        return "Alto", prob
    if prob >= 0.35:
        return "Moderado", prob
    return "Baixo", max(prob, 0.08)

def agente_conversacional(risco: str, payload: SensorPayload) -> str:
    if risco == "Alto":
        return "Alerta crítico: encaminhar para avaliação clínica, verificar sinais vitais e acionar protocolo de emergência."
    if risco == "Moderado":
        return "Monitorar em tempo real, repetir leitura em 5 minutos e orientar repouso."
    return "Indicadores estáveis. Manter monitoramento preventivo e rotina de acompanhamento."

@app.get("/")
def healthcheck():
    return {"status": "online", "service": "CardioIA"}

@app.post("/api/sinais", response_model=Recommendation)
def receber_sinais(payload: SensorPayload):
    risco, prob = motor_preditivo(payload)
    rec = Recommendation(
        risco=risco,
        probabilidade=round(prob, 2),
        recomendacao=agente_conversacional(risco, payload),
        timestamp=datetime.utcnow().isoformat() + "Z"
    )
    leituras.append({"entrada": payload.model_dump(), "saida": rec.model_dump()})
    return rec

@app.get("/api/leituras")
def listar_leituras():
    return leituras[-20:]
