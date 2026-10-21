from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_equb_or_404, require_admin
from app.models.equb import Equb, MainSlot, SubMember
from app.schemas.equb import SubMemberCreate, SubMemberPublicOut, SubMemberAdminOut

router = APIRouter(prefix="/api/equbs/{equb_id}/slots/{slot_id}/members", tags=["Sub-Members"])


def _get_slot(db: Session, equb: Equb, slot_id: str) -> MainSlot:
    slot = db.query(MainSlot).filter(MainSlot.id == slot_id, MainSlot.equb_id == equb.id).first()
    if not slot:
        raise HTTPException(status_code=404, detail="Main slot not found")
    return slot


@router.post("", response_model=SubMemberAdminOut, status_code=201)
def add_sub_member(
    equb_id: str, slot_id: str, payload: SubMemberCreate,
    equb: Equb = Depends(require_admin), db: Session = Depends(get_db),
):
    slot = _get_slot(db, equb, slot_id)
    member = SubMember(main_slot_id=slot.id, **payload.model_dump())
    db.add(member)
    db.commit()
    db.refresh(member)
    return member


@router.get("", response_model=List[SubMemberPublicOut])
def list_sub_members_public(equb_id: str, slot_id: str, equb: Equb = Depends(get_equb_or_404), db: Session = Depends(get_db)):
    """Public view: nickname always, phone number ONLY if the member opted in."""
    slot = _get_slot(db, equb, slot_id)
    result = []
    for m in slot.sub_members:
        result.append(SubMemberPublicOut(
            id=m.id,
            nickname=m.nickname,
            phone_number=m.phone_number if m.phone_is_public else None,
            contribution_share=m.contribution_share,
        ))
    return result


@router.get("/admin", response_model=List[SubMemberAdminOut])
def list_sub_members_admin(equb_id: str, slot_id: str, equb: Equb = Depends(require_admin), db: Session = Depends(get_db)):
    slot = _get_slot(db, equb, slot_id)
    return slot.sub_members


@router.delete("/{member_id}", status_code=204)
def delete_sub_member(
    equb_id: str, slot_id: str, member_id: str,
    equb: Equb = Depends(require_admin), db: Session = Depends(get_db),
):
    slot = _get_slot(db, equb, slot_id)
    member = db.query(SubMember).filter(SubMember.id == member_id, SubMember.main_slot_id == slot.id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Sub-member not found")
    db.delete(member)
    db.commit()
    return None
