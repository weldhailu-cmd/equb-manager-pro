from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import sqlite3
import os
import random

app = FastAPI(title="Yop Digital Equb API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EqubCreate(BaseModel):
    name: str
    address_city: str
    member_password: str
    admin_password: str
    start_date: str
    calendar_type: str = "ethiopian"
    service_fee_type: str = "free"
    contribution_amount: float = 1000.0

class MemberCreate(BaseModel):
    full_name: str
    phone_number: str
    shares_count: int = 1
    privacy_hidden: bool = True

class PaymentCreate(BaseModel):
    member_id: int
    amount: float
    round_number: int
    payment_date: str
    status: str = "paid"

class BatchPaymentItem(BaseModel):
    member_id: int
    amount: float
    status: str = "paid"

class BatchPaymentCreate(BaseModel):
    round_number: int
    payment_date: str
    payments: List[BatchPaymentItem]

class LotteryDraw(BaseModel):
    round_number: int
    draw_date: str

class PasswordVerify(BaseModel):
    password: str

class SubMember(BaseModel):
    fullName: Optional[str] = ""
    phone: Optional[str] = ""
    shareName: Optional[str] = ""
    amount: Optional[str] = ""

class SlotItem(BaseModel):
    id: Optional[int] = None
    slotName: Optional[str] = ""
    nickname: Optional[str] = ""
    totalAmount: Optional[str] = ""
    status: Optional[str] = "active"
    subMembers: List[SubMember] = []

class SlotsPayload(BaseModel):
    slots: List[SlotItem]

def get_db():
    db_path = os.path.join(os.path.dirname(__file__), "..", "equb.db")
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

@app.on_event("startup")
def startup():
    db = get_db()
    db.execute("""
        CREATE TABLE IF NOT EXISTS equbs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            address_city TEXT NOT NULL,
            member_password TEXT NOT NULL,
            admin_password TEXT NOT NULL,
            start_date TEXT NOT NULL,
            calendar_type TEXT,
            service_fee_type TEXT,
            contribution_amount REAL DEFAULT 1000.0
        )
    """)
    db.execute("""
        CREATE TABLE IF NOT EXISTS members (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            equb_id INTEGER NOT NULL,
            full_name TEXT NOT NULL,
            phone_number TEXT NOT NULL,
            shares_count INTEGER DEFAULT 1,
            privacy_hidden BOOLEAN DEFAULT 1,
            FOREIGN KEY (equb_id) REFERENCES equbs (id) ON DELETE CASCADE
        )
    """)
    db.execute("""
        CREATE TABLE IF NOT EXISTS payments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            equb_id INTEGER NOT NULL,
            member_id INTEGER NOT NULL,
            amount REAL NOT NULL,
            round_number INTEGER NOT NULL,
            payment_date TEXT NOT NULL,
            status TEXT DEFAULT 'paid',
            FOREIGN KEY (equb_id) REFERENCES equbs (id) ON DELETE CASCADE,
            FOREIGN KEY (member_id) REFERENCES members (id) ON DELETE CASCADE
        )
    """)
    db.execute("""
        CREATE TABLE IF NOT EXISTS winners (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            equb_id INTEGER NOT NULL,
            member_id INTEGER NOT NULL,
            round_number INTEGER NOT NULL,
            draw_date TEXT NOT NULL,
            net_payout REAL NOT NULL,
            service_fee_deducted REAL NOT NULL,
            FOREIGN KEY (equb_id) REFERENCES equbs (id) ON DELETE CASCADE,
            FOREIGN KEY (member_id) REFERENCES members (id) ON DELETE CASCADE
        )
    """)
    db.execute("""
        CREATE TABLE IF NOT EXISTS equb_slots (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            equb_id INTEGER NOT NULL,
            slot_name TEXT,
            nickname TEXT,
            total_amount TEXT,
            status TEXT,
            FOREIGN KEY (equb_id) REFERENCES equbs (id) ON DELETE CASCADE
        )
    """)
    db.execute("""
        CREATE TABLE IF NOT EXISTS equb_sub_members (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            slot_id INTEGER NOT NULL,
            full_name TEXT,
            phone TEXT,
            share_name TEXT,
            amount TEXT,
            FOREIGN KEY (slot_id) REFERENCES equb_slots (id) ON DELETE CASCADE
        )
    """)
    db.commit()
    db.close()

# --- የእቁብ ራውቶች ---
@app.post("/api/equbs/")
@app.post("/equbs/")
def create_equb(equb: EqubCreate):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("""
            INSERT INTO equbs (name, address_city, member_password, admin_password, start_date, calendar_type, service_fee_type, contribution_amount)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (equb.name, equb.address_city, equb.member_password, equb.admin_password, equb.start_date, equb.calendar_type, equb.service_fee_type, equb.contribution_amount))
        db.commit()
        equb_id = cursor.lastrowid
        db.close()
        return {"id": equb_id, "message": "እቁቡ በተሳካ ሁኔታ ተፈጥሯል!", **equb.dict()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/equbs/")
@app.get("/equbs/")
def get_equbs():
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM equbs ORDER BY id DESC")
        rows = cursor.fetchall()
        db.close()
        return [dict(row) for row in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/equbs/{equb_id}/")
@app.delete("/equbs/{equb_id}/")
def delete_equb(equb_id: int):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("DELETE FROM equbs WHERE id = ?", (equb_id,))
        db.commit()
        db.close()
        return {"message": "እቁቡ በተሳካ ሁኔታ ተሰርዟል!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/equbs/{equb_id}/verify")
@app.post("/api/equbs/{equb_id}/verify/")
@app.post("/equbs/{equb_id}/verify")
@app.post("/equbs/{equb_id}/verify/")
def verify_equb_password(equb_id: int, data: PasswordVerify):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT member_password, admin_password FROM equbs WHERE id = ?", (equb_id,))
    row = cursor.fetchone()
    db.close()

    if not row:
        raise HTTPException(status_code=404, detail="እቁቡ አልተገኘም")

    if data.password == row["member_password"] or data.password == row["admin_password"]:
        return {"success": True, "message": "መግቢያው ተፈቅዷል"}
    else:
        raise HTTPException(status_code=400, detail="የይለፍ ቃል ስህተት ነው!")

# --- የስሎት እና ንዑስ አባላት ራውቶች (Slots & Sub-members Endpoints) ---
@app.get("/api/equbs/{equb_id}/slots")
@app.get("/api/equbs/{equb_id}/slots/")
@app.get("/equbs/{equb_id}/slots")
@app.get("/equbs/{equb_id}/slots/")
def get_equb_slots(equb_id: int):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM equb_slots WHERE equb_id = ?", (equb_id,))
        slot_rows = cursor.fetchall()
        
        slots = []
        for s_row in slot_rows:
            slot_dict = {
                "id": s_row["id"],
                "slotName": s_row["slot_name"],
                "nickname": s_row["nickname"],
                "totalAmount": s_row["total_amount"],
                "status": s_row["status"],
                "subMembers": []
            }
            cursor.execute("SELECT * FROM equb_sub_members WHERE slot_id = ?", (s_row["id"],))
            sub_rows = cursor.fetchall()
            for sub in sub_rows:
                slot_dict["subMembers"].append({
                    "fullName": sub["full_name"],
                    "phone": sub["phone"],
                    "shareName": sub["share_name"],
                    "amount": sub["amount"]
                })
            slots.append(slot_dict)
            
        db.close()
        return {"slots": slots}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/equbs/{equb_id}/slots")
@app.post("/api/equbs/{equb_id}/slots/")
@app.post("/equbs/{equb_id}/slots")
@app.post("/equbs/{equb_id}/slots/")
def save_equb_slots(equb_id: int, payload: SlotsPayload):
    try:
        db = get_db()
        cursor = db.cursor()
        
        cursor.execute("SELECT id FROM equb_slots WHERE equb_id = ?", (equb_id,))
        old_slots = cursor.fetchall()
        for os_row in old_slots:
            cursor.execute("DELETE FROM equb_sub_members WHERE slot_id = ?", (os_row["id"],))
        cursor.execute("DELETE FROM equb_slots WHERE equb_id = ?", (equb_id,))
        
        for slot in payload.slots:
            cursor.execute("""
                INSERT INTO equb_slots (equb_id, slot_name, nickname, total_amount, status)
                VALUES (?, ?, ?, ?, ?)
            """, (equb_id, slot.slotName, slot.nickname, str(slot.totalAmount), slot.status))
            slot_id = cursor.lastrowid
            
            for sub in slot.subMembers:
                cursor.execute("""
                    INSERT INTO equb_sub_members (slot_id, full_name, phone, share_name, amount)
                    VALUES (?, ?, ?, ?, ?)
                """, (slot_id, sub.fullName, sub.phone, sub.shareName, str(sub.amount)))
        
        db.commit()
        db.close()
        return {"success": True, "message": "ስሎቶች እና ንዑስ አባላት በተሳካ ሁኔታ ተመዝግበዋል!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- የአባል ራውቶች ---
@app.post("/api/equbs/{equb_id}/members/")
@app.post("/equbs/{equb_id}/members/")
def add_member(equb_id: int, member: MemberCreate):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("""
            INSERT INTO members (equb_id, full_name, phone_number, shares_count, privacy_hidden)
            VALUES (?, ?, ?, ?, ?)
        """, (equb_id, member.full_name, member.phone_number, member.shares_count, member.privacy_hidden))
        db.commit()
        member_id = cursor.lastrowid
        db.close()
        return {"id": member_id, "message": "አባሉ በተሳካ ሁኔታ ተመዝግቧል!", **member.dict()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/equbs/{equb_id}/members/")
@app.get("/equbs/{equb_id}/members/")
def get_members(equb_id: int):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM members WHERE equb_id = ? ORDER BY id DESC", (equb_id,))
        rows = cursor.fetchall()
        db.close()
        return [dict(row) for row in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- የክፍያ ራውቶች ---
@app.post("/api/equbs/{equb_id}/payments/")
@app.post("/equbs/{equb_id}/payments/")
def record_payment(equb_id: int, payment: PaymentCreate):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("""
            INSERT INTO payments (equb_id, member_id, amount, round_number, payment_date, status)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (equb_id, payment.member_id, payment.amount, payment.round_number, payment.payment_date, payment.status))
        db.commit()
        payment_id = cursor.lastrowid
        db.close()
        return {"id": payment_id, "message": "ክፍያው በተሳካ ሁኔታ ተመዝግቧል!", **payment.dict()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/equbs/{equb_id}/payments/batch")
@app.post("/api/equbs/{equb_id}/payments/batch/")
def record_batch_payments(equb_id: int, payload: BatchPaymentCreate):
    try:
        db = get_db()
        cursor = db.cursor()
        for p in payload.payments:
            cursor.execute("""
                INSERT INTO payments (equb_id, member_id, amount, round_number, payment_date, status)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (equb_id, p.member_id, p.amount, payload.round_number, payload.payment_date, p.status))
        db.commit()
        db.close()
        return {"success": True, "message": "የክፍያ ዝርዝሩ በተሳካ ሁኔታ ተመዝግቧል!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/equbs/{equb_id}/payments/")
@app.get("/equbs/{equb_id}/payments/")
def get_payments(equb_id: int):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("""
            SELECT payments.*, members.full_name 
            FROM payments 
            JOIN members ON payments.member_id = members.id 
            WHERE payments.equb_id = ? 
            ORDER BY payments.id DESC
        """, (equb_id,))
        rows = cursor.fetchall()
        db.close()
        return [dict(row) for row in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- የዕጣ ማውጫ እና የሰርቪስ ፊ ሎጂክ ---
@app.post("/api/equbs/{equb_id}/draw/")
@app.post("/equbs/{equb_id}/draw/")
def draw_lottery(equb_id: int, draw: LotteryDraw):
    try:
        db = get_db()
        cursor = db.cursor()
        
        cursor.execute("SELECT * FROM equbs WHERE id = ?", (equb_id,))
        equb = cursor.fetchone()
        if not equb:
            db.close()
            raise HTTPException(status_code=404, detail="እቁቡ አልተገኘም")

        cursor.execute("SELECT member_id FROM winners WHERE equb_id = ?", (equb_id,))
        previous_winners = [row["member_id"] for row in cursor.fetchall()]

        cursor.execute("SELECT * FROM members WHERE equb_id = ?", (equb_id,))
        all_members = [dict(row) for row in cursor.fetchall()]

        available_members = [m for m in all_members if m["id"] not in previous_winners]

        if not available_members:
            db.close()
            raise HTTPException(status_code=400, detail="ሁሉም አባላት ዕጣ ደርሰዋቸዋል!")

        weighted_pool = []
        for m in available_members:
            shares = m.get("shares_count", 1) or 1
            for _ in range(shares):
                weighted_pool.append(m)

        winner = random.choice(weighted_pool)

        total_shares = sum(m.get("shares_count", 1) for m in all_members)
        total_pool_amount = total_shares * equb["contribution_amount"]

        fee_type = equb["service_fee_type"].lower()
        fee_rate = 0.0
        if "standard" in fee_type or "0.06" in fee_type:
            fee_rate = 0.0006 if "0.0006" in fee_rate else 0.06
        elif "premium" in fee_type or "0.12" in fee_type:
            fee_rate = 0.12

        service_fee = total_pool_amount * fee_rate
        net_payout = total_pool_amount - service_fee

        cursor.execute("""
            INSERT INTO winners (equb_id, member_id, round_number, draw_date, net_payout, service_fee_deducted)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (equb_id, winner["id"], draw.round_number, draw.draw_date, net_payout, service_fee))
        db.commit()
        db.close()

        sms_message = f"Congratulations! You have won today's draw for {equb['name']}. Total Payout: {net_payout:.2f} Birr."

        return {
            "message": "እጣው በተሳካ ሁኔታ ወጥቷል!",
            "winner": winner,
            "round_number": draw.round_number,
            "total_pool": total_pool_amount,
            "service_fee": service_fee,
            "net_payout": net_payout,
            "sms_alert": sms_message
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/equbs/{equb_id}/winners/")
@app.get("/api/equbs/{equb_id}/winners/")
def get_winners(equb_id: int):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("""
            SELECT winners.*, members.full_name, members.phone_number, members.privacy_hidden 
            FROM winners 
            JOIN members ON winners.member_id = members.id 
            WHERE winners.equb_id = ? 
            ORDER BY winners.round_number ASC
        """, (equb_id,))
        rows = cursor.fetchall()
        db.close()
        return [dict(row) for row in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))