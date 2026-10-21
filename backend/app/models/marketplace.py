import enum
import uuid

from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


def gen_uuid() -> str:
    return str(uuid.uuid4())


class PostType(str, enum.Enum):
    NEW_EQUB = "new_equb"              # promoting an upcoming Equb
    SLOT_FOR_SALE = "slot_for_sale"    # buy/sell membership request
    ANNOUNCEMENT = "announcement"      # community announcement


class MarketplacePost(Base):
    __tablename__ = "marketplace_posts"

    id = Column(String, primary_key=True, default=gen_uuid)
    equb_id = Column(String, ForeignKey("equbs.id"), nullable=True)

    post_type = Column(Enum(PostType), default=PostType.ANNOUNCEMENT, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    contact_nickname = Column(String, nullable=False)
    contact_phone = Column(String, nullable=True)  # optional, poster's choice
    price_or_share = Column(Float, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    equb = relationship("Equb", back_populates="marketplace_posts")
