from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import uuid

app = FastAPI()

# CORS Middleware Setup (React ፊትኤንድ ከባክኤንድ ጋር ያለምንም ችግር እንዲገናኝ)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas for Members
class MemberSchema(BaseModel):
    id: str
    name: str
    phone: Optional[str] = None

# Pydantic Schema for Equb (Members ሊስትን የያዘ)
class EqubModel(BaseModel):
    id: Optional[str] = None
    name: str
    address: Optional[str] = ""
    memberPassword: Optional[str] = ""
    adminPassword: Optional[str] = ""
    startDate: str
    contributionAmount: float
    frequency: Optional[str] = "weekly"
    serviceFee: Optional[str] = "0"
    members: List[MemberSchema] = []

# Temporary database storage
db_equbs = []

# --- Equb Endpoints ---

@app.post("/api/equbs", response_model=EqubModel)
def create_equb(equb: EqubModel):
    equb.id = str(uuid.uuid4())
    equb_dict = equb.dict()
    if not equb_dict.get("members"):
        equb_dict["members"] = []
    db_equbs.append(equb_dict)
    return equb_dict

@app.get("/api/equbs", response_model=List[EqubModel])
def get_equbs():
    return db_equbs

@app.delete("/api/equbs/{equb_id}")
def delete_equb(equb_id: str):
    global db_equbs
    initial_len = len(db_equbs)
    db_equbs = [e for e in db_equbs if e.get("id") != equb_id]
    if len(db_equbs) == initial_len:
        raise HTTPException(status_code=404, detail="Equb not found")
    return {"message": "Deleted successfully", "id": equb_id}


# --- Member Management Endpoints ---

@app.post("/api/equbs/{equb_id}/members")
def add_member_to_equb(equb_id: str, member: MemberSchema):
    for equb in db_equbs:
        if equb["id"] == equb_id:
            equb["members"].append(member.dict())
            return {"message": "Member added successfully", "members": equb["members"]}
    raise HTTPException(status_code=404, detail="Equb not found")

@app.delete("/api/equbs/{equb_id}/members/{member_id}")
def delete_member_from_equb(equb_id: str, member_id: str):
    for equb in db_equbs:
        if equb["id"] == equb_id:
            equb["members"] = [m for m in equb["members"] if m["id"] != member_id]
            return {"message": "Member removed successfully", "members": equb["members"]}
    raise HTTPException(status_code=404, detail="Equb or Member not found")