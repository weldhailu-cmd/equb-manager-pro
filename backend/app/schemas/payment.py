from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.models.payment import PaymentMethod, PaymentStatus


class BankAccountCreate(BaseModel):
    bank_name: str
    account_name: str
    account_number: str


class BankAccountOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    bank_name: str
    account_name: str
    account_number: str


class PaymentRecordCreate(BaseModel):
    sub_member_id: str
    method: PaymentMethod
    amount: float
    admin_note: Optional[str] = None


class PaymentReviewRequest(BaseModel):
    status: PaymentStatus
    admin_note: Optional[str] = None


class PaymentRecordOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    sub_member_id: str
    method: PaymentMethod
    amount: float
    status: PaymentStatus
    proof_file_path: Optional[str]
    logged_by_admin: bool
    admin_note: Optional[str]
    created_at: datetime
    reviewed_at: Optional[datetime]
