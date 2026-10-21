import random
from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import require_admin, get_equb_or_404
from app.models.equb import Equb, MainSlot, DrawResult
from app.schemas.equb import DrawRequest, DrawResultOut

router = APIRouter(prefix="/api/equbs/{equb_id}/draws", tags=["Draws"])


def _eligible_slots(equb: Equb) -> List[MainSlot]:
    """
    Draw pool is strictly the Main Slots that have not already won —
    sub-members are irrelevant to this count, per the core business rule.
    """
    return [s for s in equb.main_slots if not s.has_won]


def _execute_draw(db: Session, equb: Equb, slot: MainSlot, draw_type: str) -> DrawResult:
    fee = round(slot.full_payout_amount * equb.service_fee_rate, 2)
    net_payout = round(slot.full_payout_amount - fee, 2)

    message = (
        f"Congratulations! You have won today's draw for {equb.name}. "
        f"Total Payout: {net_payout} Birr."
    )

    slot.has_won = True
    slot.won_at = datetime.utcnow()

    result = DrawResult(
        equb_id=equb.id,
        main_slot_id=slot.id,
        draw_type=draw_type,
        payout_amount=net_payout,
        service_fee_charged=fee,
        notification_message=message,
    )
    db.add(result)
    db.add(slot)
    db.commit()
    db.refresh(result)
    return result


@router.post("/run", response_model=DrawResultOut)
def run_draw(equb_id: str, payload: DrawRequest, equb: Equb = Depends(require_admin), db: Session = Depends(get_db)):
    """
    If `main_slot_id` is provided -> manual draw of that specific slot.
    Otherwise -> automatic random draw among slots that haven't won yet.
    """
    pool = _eligible_slots(equb)
    if not pool:
        raise HTTPException(status_code=400, detail="No eligible slots remain — all main slots have already won.")

    if payload.main_slot_id:
        slot = next((s for s in pool if s.id == payload.main_slot_id), None)
        if not slot:
            raise HTTPException(status_code=404, detail="Slot not found or already won")
        return _execute_draw(db, equb, slot, "manual")

    slot = random.choice(pool)
    return _execute_draw(db, equb, slot, "automatic")


@router.get("", response_model=List[DrawResultOut])
def list_draws(equb_id: str, equb: Equb = Depends(require_admin)):
    return sorted(equb.draw_results, key=lambda d: d.drawn_at, reverse=True)


@router.get("/public", response_model=List[DrawResultOut])
def list_draws_public(equb_id: str, db: Session = Depends(get_db)):
    """
    Public draw history — notification_message text is fine to show since it
    only ever contains the slot's nickname-safe congratulation copy, never a
    real name or phone number.
    """
    equb = get_equb_or_404(equb_id, db)
    return sorted(equb.draw_results, key=lambda d: d.drawn_at, reverse=True)
