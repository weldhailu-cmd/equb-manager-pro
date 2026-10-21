from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_equb_or_404, require_admin
from app.models.equb import Equb, MainSlot
from app.schemas.equb import MainSlotCreate, MainSlotPublicOut, MainSlotAdminOut

router = APIRouter(prefix="/api/equbs/{equb_id}/slots", tags=["Main Slots"])


def _to_public(slot: MainSlot) -> MainSlotPublicOut:
    out = MainSlotPublicOut.model_validate(slot)
    out.sub_member_count = len(slot.sub_members)
    return out


def _to_admin(slot: MainSlot) -> MainSlotAdminOut:
    out = MainSlotAdminOut.model_validate(slot)
    out.sub_member_count = len(slot.sub_members)
    out.contribution_total = slot.contribution_total
    return out


@router.post("", response_model=MainSlotAdminOut, status_code=201)
def create_main_slot(equb_id: str, payload: MainSlotCreate, equb: Equb = Depends(require_admin), db: Session = Depends(get_db)):
    slot = MainSlot(equb_id=equb.id, **payload.model_dump())
    db.add(slot)
    db.commit()
    db.refresh(slot)
    return _to_admin(slot)


@router.get("", response_model=List[MainSlotPublicOut])
def list_main_slots_public(equb: Equb = Depends(get_equb_or_404)):
    """
    Public listing — used for the participant-facing view.
    total_slots for draw purposes = len(main_slots), never sub-member count.
    """
    slots = sorted(equb.main_slots, key=lambda s: s.order_index)
    return [_to_public(s) for s in slots]


@router.get("/admin", response_model=List[MainSlotAdminOut])
def list_main_slots_admin(equb: Equb = Depends(require_admin)):
    slots = sorted(equb.main_slots, key=lambda s: s.order_index)
    return [_to_admin(s) for s in slots]


@router.delete("/{slot_id}", status_code=204)
def delete_main_slot(equb_id: str, slot_id: str, equb: Equb = Depends(require_admin), db: Session = Depends(get_db)):
    slot = db.query(MainSlot).filter(MainSlot.id == slot_id, MainSlot.equb_id == equb.id).first()
    if not slot:
        raise HTTPException(status_code=404, detail="Slot not found")
    db.delete(slot)
    db.commit()
    return None
