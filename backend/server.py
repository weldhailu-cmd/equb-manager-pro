import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="Yop Digital Equb API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

EQUBS_JSON_PATH = os.path.join(os.path.dirname(__file__), "equbs.json")

class EqubCreateModel(BaseModel):
    id: Optional[str] = None
    name: str
    amount: Optional[str] = "200 ETB"
    cycle: Optional[str] = "Daily"
    address: Optional[str] = "ሞላሌ"

def load_equbs():
    if os.path.exists(EQUBS_JSON_PATH):
        try:
            with open(EQUBS_JSON_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except:
            pass
    return []

def save_equbs(equbs):
    with open(EQUBS_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(equbs, f, ensure_ascii=False, indent=2)

@app.get("/api/equbs")
def get_equbs():
    return load_equbs()

@app.post("/api/equbs")
def create_equb(equb: EqubCreateModel):
    equbs = load_equbs()
    new_id = str(int(equbs[-1]["id"]) + 1) if equbs and "id" in equbs[-1] and str(equbs[-1]["id"]).isdigit() else str(len(equbs) + 1)
    
    new_equb_item = {
        "id": equb.id or new_id,
        "name": equb.name,
        "amount": equb.amount,
        "cycle": equb.cycle,
        "address": equb.address
    }
    
    equbs.append(new_equb_item)
    save_equbs(equbs)
    return {"status": "success", "message": "እቁቡ በተሳካ ሁኔታ ተመዝግቧል!", "equb": new_equb_item}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=5000)