from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.models.marketplace import PostType


class MarketplacePostCreate(BaseModel):
    equb_id: Optional[str] = None
    post_type: PostType = PostType.ANNOUNCEMENT
    title: str
    description: str
    contact_nickname: str
    contact_phone: Optional[str] = None
    price_or_share: Optional[float] = None


class MarketplacePostOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    equb_id: Optional[str]
    post_type: PostType
    title: str
    description: str
    contact_nickname: str
    contact_phone: Optional[str]
    price_or_share: Optional[float]
    created_at: datetime
