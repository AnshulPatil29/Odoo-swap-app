from sqlalchemy.orm import Session
from . import models, schemas
from .security import get_password_hash


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).filter(models.User.is_public == True).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(**user.model_dump(exclude={"password"}), hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: int, user_update: schemas.UserUpdate):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        return None
    
    update_data = user_update.model_dump(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(db_user, key, value)
        
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# --- Skill CRUD Functions ---

def get_skills_for_user(db: Session, user_id: int):
    return db.query(models.Skill).filter(models.Skill.user_id == user_id).all()

def create_user_skill(db: Session, skill: schemas.SkillCreate, user_id: int):
    db_skill = models.Skill(**skill.model_dump(), user_id=user_id)
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    return db_skill

def delete_skill(db: Session, skill_id: int, user_id: int):
    db_skill = db.query(models.Skill).filter(models.Skill.id == skill_id).first()
    if db_skill and db_skill.user_id == user_id:
        db.delete(db_skill)
        db.commit()
        return {"ok": True}
    return None

def create_swap_request(db: Session, request: schemas.SwapRequestCreate, requester_id: int):
    db_request = models.SwapRequest(**request.model_dump(), requester_id=requester_id, status="pending")
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request

def get_swap_requests_for_user(db: Session, user_id: int):
    return db.query(models.SwapRequest).filter(
        (models.SwapRequest.requester_id == user_id) | (models.SwapRequest.provider_id == user_id)
    ).all()

def get_swap_request(db: Session, swap_id: int):
    return db.query(models.SwapRequest).filter(models.SwapRequest.id == swap_id).first()

def update_swap_request_status(db: Session, swap_id: int, new_status: str):
    db_swap = get_swap_request(db, swap_id=swap_id)
    if db_swap:
        db_swap.status = new_status
        db.commit()
        db.refresh(db_swap)
    return db_swap