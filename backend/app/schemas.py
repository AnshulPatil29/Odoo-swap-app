from pydantic import BaseModel, EmailStr
from typing import List, Optional

class SkillBase(BaseModel):
    name: str
    skill_type: str  # 'offered' or 'wanted'

class SkillCreate(SkillBase):
    pass

class UserBase(BaseModel):
    email: EmailStr
    name: str
    location: Optional[str] = None
    is_public: bool = True

class UserCreate(UserBase):
    password: str

class SwapRequestCreate(BaseModel):
    provider_id: int
    offered_skill_id: int
    wanted_skill_id: int

class TokenData(BaseModel):
    email: Optional[str] = None


class Skill(SkillBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class User(UserBase):
    id: int
    skills: List[Skill] = []

    class Config:
        from_attributes = True

class SwapRequest(BaseModel):
    id: int
    status: str
    requester: User
    provider: User
    offered_skill: Skill
    wanted_skill: Skill

    class Config:
        from_attributes = True