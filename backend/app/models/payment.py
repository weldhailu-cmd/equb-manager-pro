import enum
import uuid

from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Enum, Boolean, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


def gen_uuid() -> str:
    return str(uuid.uuid4())


class PaymentMethod(str, enum.Enum):
    BANK_TRANSFER = "bank_transfer"
    CASH = "cash"


class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class BankAccount(Base):
    """A bank account linked under the Equb's official name for direct transfers."""
    __tablename__ = "bank_accounts"

    id = Column(String, primary_key=True, default=gen_uuid)
    bank_name = Column(String, nullable=False)
    account_name = Column(String, nullable=False)   # must match Equb's official name
    account_number = Column(String, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    equbs = relationship("Equb", back_populates="bank_account")


class PaymentRecord(Base):
    """
    A contribution payment, either an uploaded bank statement / transfer
    screenshot, or a manually logged cash payment. Requires admin approval
    before it counts toward the sub-member's contribution.
    """
    __tablename__ = "payment_records"

    id = Column(String, primary_key=True, default=gen_uuid)
    sub_member_id = Column(String, ForeignKey("sub_members.id"), nullable=False)

    method = Column(Enum(PaymentMethod), nullable=False)
    amount = Column(Float, nullable=False)
    status = Column(Enum(PaymentStatus), default=PaymentStatus.PENDING, nullable=False)

    proof_file_path = Column(String, nullable=True)   # uploaded statement / screenshot
    logged_by_admin = Column(Boolean, default=False)  # true for manually-logged cash payments
    admin_note = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    reviewed_at = Column(DateTime(timezone=True), nullable=True)

    sub_member = relationship("SubMember", back_populates="payments")
