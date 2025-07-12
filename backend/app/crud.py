from sqlalchemy.orm import Session
from . import models, schemas
from .api.auth import get_password_hash 

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        name=user.name,
        hashed_password=hashed_password,
        location=user.location,
        is_public=user.is_public
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_skills_for_user(db: Session, user_id: int):
    return db.query(models.Skill).filter(models.Skill.user_id == user_id).all()

def create_user_skill(db: Session, skill: schemas.SkillCreate, user_id: int):
    db_skill = models.Skill(**skill.dict(), user_id=user_id)
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    return db_skill

