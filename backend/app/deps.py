"""
Shared FastAPI dependencies.

Admin gating works per-Equb: the client sends the Equb's admin password in
the `X-Admin-Password` header (verified against that Equb's stored hash).
This keeps the privacy rule simple: no full names, phone numbers, or
payment-approval actions are returned/allowed unless this check passes.
"""
from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.core.security import verify_password
from app.models.equb import Equb


def get_equb_or_404(equb_id: str, db: Session = Depends(get_db)) -> Equb:
    equb = db.query(Equb).filter(Equb.id == equb_id).first()
    if not equb:
        raise HTTPException(status_code=404, detail="Equb not found")
    return equb


def require_admin(
    equb_id: str,
    x_admin_password: str = Header(..., alias="X-Admin-Password"),
    db: Session = Depends(get_db),
) -> Equb:
    equb = get_equb_or_404(equb_id, db)
    if not verify_password(x_admin_password, equb.admin_password_hash):
        raise HTTPException(status_code=403, detail="Invalid admin password")
    return equb


def require_member(
    equb_id: str,
    x_member_password: str = Header(..., alias="X-Member-Password"),
    db: Session = Depends(get_db),
) -> Equb:
    equb = get_equb_or_404(equb_id, db)
    if not verify_password(x_member_password, equb.member_password_hash) and not verify_password(
        x_member_password, equb.admin_password_hash
    ):
        raise HTTPException(status_code=403, detail="Invalid member password")
    return equb
