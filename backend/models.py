from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base

class Member(Base):
    __tablename__ = "members"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    phone_number = Column(String, unique=True, index=True, nullable=False)
    shares_count = Column(Float, default=1.0)
    status = Column(String, default="Paid")  # Paid / Unpaid toggle üçün
    is_winner = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    payments = relationship("Payment", back_populates="member", cascade="all, delete-orphan")
    draws_won = relationship("EqubDraw", back_populates="winner")

class Equb(Base):
    __tablename__ = "equbs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    amount_per_slot = Column(Float, nullable=False, default=1000.0)
    total_slots = Column(Float, default=0.0)
    service_fee_rate = Column(Float, default=0.006)  # 0.6%
    created_at = Column(DateTime, default=datetime.utcnow)  # Əቁብ የተፈጠረበት ቀን እና ሰዓት

    payments = relationship("Payment", back_populates="equb")
    draws = relationship("EqubDraw", back_populates="equb")

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    member_id = Column(Integer, ForeignKey("members.id"), nullable=False)
    equb_id = Column(Integer, ForeignKey("equbs.id"), nullable=True)
    amount = Column(Float, nullable=False)
    slots_covered = Column(Float, default=1.0)
    status = Column(String, default="Paid")
    payment_date = Column(DateTime, default=datetime.utcnow)

    member = relationship("Member", back_populates="payments")
    equb = relationship("Equb", back_populates="payments")

class EqubDraw(Base):
    __tablename__ = "equb_draws"

    id = Column(Integer, primary_key=True, index=True)
    equb_id = Column(Integer, ForeignKey("equbs.id"), nullable=True)
    winner_id = Column(Integer, ForeignKey("members.id"), nullable=False)
    total_pool = Column(Float, nullable=False)
    service_fee = Column(Float, nullable=False)
    net_payout = Column(Float, nullable=False)
    drawn_at = Column(DateTime, default=datetime.utcnow)

    equb = relationship("Equb", back_populates="draws")
    winner = relationship("Member", back_populates="draws_won")