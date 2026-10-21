import os
import uuid
from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session

from app.database import get_db
from app.core.config import settings
from app.deps import require_admin
from app.models.equb import Equb, SubMember
from app.models.payment import PaymentRecord, PaymentMethod, PaymentStatus
from app.schemas.payment import PaymentRecordOut, PaymentReviewRequest

router = APIRouter(prefix="/api/equbs/{equb_id}/payments", tags=["Payments"])

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)


@router.post("/upload", response_model=PaymentRecordOut, status_code=201)
async def submit_payment_with_proof(
    equb_id: str,
    sub_member_id: str = Form(...),
    method: PaymentMethod = Form(...),
    amount: float = Form(...),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    """
    Members submit a bank transfer screenshot / statement here. Cash payments
    logged by an admin directly should use POST /log-cash instead.
    """
    member = db.query(SubMember).filter(SubMember.id == sub_member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Sub-member not found")

    proof_path = None
    if file is not None:
        ext = os.path.splitext(file.filename or "")[1]
        fname = f"{uuid.uuid4()}{ext}"
        dest = os.path.join(settings.UPLOAD_DIR, fname)
        with open(dest, "wb") as f:
            f.write(await file.read())
        proof_path = dest

    record = PaymentRecord(
        sub_member_id=sub_member_id,
        method=method,
        amount=amount,
        proof_file_path=proof_path,
        logged_by_admin=False,
        status=PaymentStatus.PENDING,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.post("/log-cash", response_model=PaymentRecordOut, status_code=201)
def log_cash_payment(
    equb_id: str,
    sub_member_id: str = Form(...),
    amount: float = Form(...),
    admin_note: Optional[str] = Form(None),
    equb: Equb = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Admin logs a cash payment brought physically by a member — auto-approved."""
    member = db.query(SubMember).filter(SubMember.id == sub_member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Sub-member not found")

    record = PaymentRecord(
        sub_member_id=sub_member_id,
        method=PaymentMethod.CASH,
        amount=amount,
        logged_by_admin=True,
        status=PaymentStatus.APPROVED,
        admin_note=admin_note,
        reviewed_at=datetime.utcnow(),
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("/pending", response_model=List[PaymentRecordOut])
def list_pending_payments(equb_id: str, equb: Equb = Depends(require_admin), db: Session = Depends(get_db)):
    member_ids = [m.id for slot in equb.main_slots for m in slot.sub_members]
    return (
        db.query(PaymentRecord)
        .filter(PaymentRecord.sub_member_id.in_(member_ids), PaymentRecord.status == PaymentStatus.PENDING)
        .order_by(PaymentRecord.created_at.desc())
        .all()
    )


@router.post("/{payment_id}/review", response_model=PaymentRecordOut)
def review_payment(
    equb_id: str, payment_id: str, payload: PaymentReviewRequest,
    equb: Equb = Depends(require_admin), db: Session = Depends(get_db),
):
    record = db.query(PaymentRecord).filter(PaymentRecord.id == payment_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Payment record not found")

    record.status = payload.status
    record.admin_note = payload.admin_note or record.admin_note
    record.reviewed_at = datetime.utcnow()

    if payload.status == PaymentStatus.APPROVED:
        record.sub_member.contribution_share += record.amount

    db.add(record)
    db.commit()
    db.refresh(record)
    return record
