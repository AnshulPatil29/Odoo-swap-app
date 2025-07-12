from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import crud, models, schemas, database
from .auth import get_current_user

router = APIRouter()

@router.post("/", response_model=schemas.SwapRequest)
def create_swap(
    request: schemas.SwapRequestCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.create_swap_request(db=db, request=request, requester_id=current_user.id)

@router.get("/me", response_model=List[schemas.SwapRequest])
def read_my_swaps(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.get_swap_requests_for_user(db=db, user_id=current_user.id)

@router.put("/{swap_id}/respond", response_model=schemas.SwapRequest)
def respond_to_swap(
    swap_id: int,
    response: str,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_swap = crud.get_swap_request(db, swap_id=swap_id)
    if not db_swap:
        raise HTTPException(status_code=404, detail="Swap request not found")

    if db_swap.provider_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to respond to this request")

    if response.lower() not in ["accepted", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid response. Must be 'accepted' or 'rejected'.")

    return crud.update_swap_request_status(db=db, swap_id=swap_id, new_status=response.lower())