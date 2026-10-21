from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict

# --- MEMBER SCHEMAS ---
class MemberBase(BaseModel):
    full_name: str
    phone_number: str

class MemberCreate(MemberBase):
    shares_count: float = 1.0
    status: str = "Paid"

class MemberResponse(MemberBase):
    id: int
    shares_count: float
    status: str
    is_winner: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# --- EQUB SCHEMAS ---
class EqubCreate(BaseModel):
    title: str
    amount_per_slot: float
    total_slots: float = 0.0
    service_fee_rate: float = 0.006

class EqubResponse(EqubCreate):
    id: int
    created_at: datetime  # Daşbordo və digər səhifələrdə göstərmək üçün

    model_config = ConfigDict(from_attributes=True)

# --- PAYMENT SCHEMAS ---
class PaymentCreate(BaseModel):
    member_id: int
    equb_id: Optional[int] = None
    amount: float
    slots_covered: float = 1.0
    status: str = "Paid"

class PaymentResponse(PaymentCreate):
    id: int
    payment_date: datetime

    model_config = ConfigDict(from_attributes=True)

# --- DRAW RESULT SCHEMAS ---
class DrawResult(BaseModel):
    winner_name: str
    winner_phone: str
    total_pool: float
    service_fee: float
    net_payout: float

    model_config = ConfigDict(from_attributes=True)