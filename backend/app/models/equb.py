from pydantic import BaseModel
from typing import List, Optional

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