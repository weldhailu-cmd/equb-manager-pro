from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field

from app.models.equb import ServiceFeeTier

ETHIOPIAN_CITIES = [
    "Addis Ababa", "Adama", "Bahir Dar", "Mekelle", "Hawassa", "Harar",
    "Dire Dawa", "Gondar", "Jimma", "Jijiga", "Dessie", "Debre Birhan",
    "Shashamane", "Arba Minch", "Bishoftu", "Sodo", "Nekemte", "Asella",
    "Debre Markos", "Axum",
]


# ---------- Equb ----------

class EqubCreate(BaseModel):
    name: str = Field(..., min_length=2)
    address_city: str
    member_password: str = Field(..., min_length=4)
    admin_password: str = Field(..., min_length=4)
    start_date: str
    calendar_type: str
    service_fee_type: str


class EqubPublicOut(BaseModel):
    """What anyone can see without authenticating."""
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    address_city: str
    start_date_ethiopian: Optional[str]
    start_date_gregorian: Optional[datetime]
    service_fee_tier: ServiceFeeTier
    total_slots: int


class EqubAdminOut(EqubPublicOut):
    """Full detail — only returned after admin password verification."""
    bank_account_id: Optional[str]
    created_at: datetime


class PasswordCheck(BaseModel):
    password: str


# ---------- MainSlot ----------

class MainSlotCreate(BaseModel):
    slot_name: str
    slot_nickname: str
    full_payout_amount: float = Field(..., gt=0)
    order_index: int = 0


class MainSlotPublicOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    slot_nickname: str
    full_payout_amount: float
    has_won: bool
    won_at: Optional[datetime]
    sub_member_count: int = 0


class MainSlotAdminOut(MainSlotPublicOut):
    slot_name: str
    contribution_total: float = 0.0


# ---------- SubMember ----------

class SubMemberCreate(BaseModel):
    full_name: str
    nickname: str
    phone_number: str
    phone_is_public: bool = False
    contribution_share: float = Field(0.0, ge=0)


class SubMemberPublicOut(BaseModel):
    """Nickname only; phone shown only if the member opted in."""
    model_config = ConfigDict(from_attributes=True)
    id: str
    nickname: str
    phone_number: Optional[str] = None
    contribution_share: float


class SubMemberAdminOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    full_name: str
    nickname: str
    phone_number: str
    phone_is_public: bool
    contribution_share: float


# ---------- Draw ----------

class DrawRequest(BaseModel):
    main_slot_id: Optional[str] = None  # omit for automatic random draw


class DrawResultOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    main_slot_id: str
    draw_type: str
    payout_amount: float
    service_fee_charged: float
    notification_message: Optional[str]
    drawn_at: datetime