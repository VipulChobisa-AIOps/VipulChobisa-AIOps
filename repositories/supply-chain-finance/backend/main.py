from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from core.finops_engine import analyze_working_capital

app = FastAPI(title="Supply Chain FinOps API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class InventoryCapitalRequest(BaseModel):
    sku: str
    annual_demand: float
    unit_cost: float
    holding_rate: float
    ordering_cost: float
    current_inventory_level: float
    market_yield_rate: float = 0.08

@app.get("/")
def health_check():
    return {"status": "ok", "message": "FinOps Engine API is running"}

@app.post("/api/analyze")
def analyze_inventory_capital(req: InventoryCapitalRequest):
    result = analyze_working_capital(
        sku=req.sku,
        annual_demand=req.annual_demand,
        unit_cost=req.unit_cost,
        holding_rate=req.holding_rate,
        ordering_cost=req.ordering_cost,
        current_inventory_level=req.current_inventory_level,
        market_yield_rate=req.market_yield_rate
    )
    return result
