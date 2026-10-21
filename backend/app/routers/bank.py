from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.equb import Equb
from app.schemas import equb as schemas

router = APIRouter(prefix="/equbs", tags=["Equbs"])


@router.post("", response_model=schemas.EqubOut, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=schemas.EqubOut, status_code=status.HTTP_201_CREATED)
def create_equb(payload: schemas.EqubCreate, db: Session = Depends(get_db)):
    try:
        new_equb = Equb(**payload.model_dump())
        db.add(new_equb)
        db.commit()
        db.refresh(new_equb)
        return new_equb
    except Exception as e:
        db.rollback()
        raise e


@router.get("", response_model=List[schemas.EqubOut])
@router.get("/", response_model=List[schemas.EqubOut])
def list_equbs(db: Session = Depends(get_db)):
    return db.query(Equb).all()