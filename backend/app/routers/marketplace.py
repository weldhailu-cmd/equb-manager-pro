from typing import List, Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.marketplace import MarketplacePost
from app.schemas.marketplace import MarketplacePostCreate, MarketplacePostOut

router = APIRouter(prefix="/api/marketplace", tags=["Marketplace"])


@router.post("", response_model=MarketplacePostOut, status_code=201)
def create_post(payload: MarketplacePostCreate, db: Session = Depends(get_db)):
    post = MarketplacePost(**payload.model_dump())
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


@router.get("", response_model=List[MarketplacePostOut])
def list_posts(post_type: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(MarketplacePost)
    if post_type:
        q = q.filter(MarketplacePost.post_type == post_type)
    return q.order_by(MarketplacePost.created_at.desc()).all()


@router.delete("/{post_id}", status_code=204)
def delete_post(post_id: str, db: Session = Depends(get_db)):
    post = db.query(MarketplacePost).filter(MarketplacePost.id == post_id).first()
    if post:
        db.delete(post)
        db.commit()
    return None
