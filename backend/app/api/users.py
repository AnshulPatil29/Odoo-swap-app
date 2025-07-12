from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import crud, models, schemas, database
from .auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    return crud.get_users(db, skip=skip, limit=limit)

@router.get("/me", response_model=schemas.User)
async def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

# --- THIS IS A NEW ENDPOINT ---
@router.put("/me", response_model=schemas.User)
def update_current_user(
    user_update: schemas.UserUpdate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Allow the logged-in user to update their own profile details.
    """
    return crud.update_user(db=db, user_id=current_user.id, user_update=user_update)

@router.get("/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(database.get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    if not db_user.is_public:
        raise HTTPException(status_code=403, detail="This profile is private")
    return db_user

@router.post("/me/skills", response_model=schemas.Skill)
def create_skill_for_current_user(
    skill: schemas.SkillCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.create_user_skill(db=db, skill=skill, user_id=current_user.id)

@router.delete("/me/skills/{skill_id}", status_code=204)
def delete_skill_for_current_user(
    skill_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    result = crud.delete_skill(db=db, skill_id=skill_id, user_id=current_user.id)
    if not result:
        raise HTTPException(
            status_code=404,
            detail="Skill not found or you do not have permission to delete it.",
        )
    return