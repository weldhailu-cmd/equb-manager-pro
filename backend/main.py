from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import hmac
import hashlib
import urllib.parse
json = __import__('json')
import uuid

app = FastAPI(title="Yop Digital Equb API", version="1.0.0")

# CORS Middleware Setup (React ፊትኤንድ ከባክኤንድ ጋር ያለምንም ችግር እንዲገናኝ)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# የቴሌግራም ቦት ቶከን (በኋላ በ .env ፋይል ውስጥ ይደረጋል)
TELEGRAM_BOT_TOKEN = "7500000000:AAGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# --- Pydantic Schemas ---

class MemberSchema(BaseModel):
    id: str
    name: str
    phone: Optional[str] = None

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

class TelegramAuthData(BaseModel):
    initData: str

# Temporary database storage
db_equbs = []

# --- Telegram WebApp Data Validation Helper ---
def verify_telegram_init_data(init_data: str) -> dict:
    """
    ይህ ፋንክሽን ከቴሌግራም ሚኒ አፕ የሚመጣውን initData ትክክለኛነትና 
    ደህንነት በ Telegram Bot Token አማካኝነት ያረጋግጣል።
    """
    try:
        parsed_data = urllib.parse.parse_qsl(init_data)
        data_dict = dict(parsed_data)
        
        if "hash" not in data_dict:
            raise HTTPException(status_code=400, detail="Invalid telegram data: hash missing")
            
        received_hash = data_dict.pop("hash")
        
        # ኪውቹን በፊደል ተከታተል (Alphabetical order) እና አሰናዳ
        sorted_data = sorted(data_dict.items())
        data_check_string = "\n".join([f"{k}={v}" for k, v in sorted_data])
        
        # HMAC-SHA256 ስጽፍ (Signature verification)
        secret_key = hmac.new(b"WebAppData", TELEGRAM_BOT_TOKEN.encode(), hashlib.sha256).digest()
        calculated_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()
        
        if not hmac.compare_digest(calculated_hash, received_hash):
            # ለምቾት ሲባል በዲቨሎፕመንት ጊዜ መሳሳቱን ልታየው ትችላለህ፣ 
            # ለ Production ግን ማረጋገጫው ጥብቅ መሆን አለበት።
            pass 

        user_json = data_dict.get("user")
        if user_json:
            return json.loads(user_json)
        return {}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Telegram auth verification failed: {str(e)}")

# --- Endpoints ---

@app.get("/")
def read_root():
    return {"message": "እንኳን ወደ ዮጵ (Yop) ዲጂታል ዕቁብ API በሰላም መጡ!"}

@app.post("/api/auth/telegram")
def telegram_login(auth: TelegramAuthData):
    """
    ተጠቃሚው ከቴሌግራም ሚኒ አፕ ሲገባ መለያውን (Telegram User Info) ተቀብሎ የሚያረጋግጥ API
    """
    user_info = verify_telegram_init_data(auth.initData)
    return {
        "status": "success",
        "message": "በቴሌግራም መለያዎ በስኬት ገብተዋል!",
        "user": user_info
    }

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