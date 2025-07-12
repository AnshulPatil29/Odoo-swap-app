from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Enum
from sqlalchemy.orm import relationship

from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    location = Column(String, nullable=True)
    is_public = Column(Boolean, default=True)

    skills = relationship("Skill", back_populates="owner")
    requests_sent = relationship("SwapRequest", foreign_keys="[SwapRequest.requester_id]", back_populates="requester")
    requests_received = relationship("SwapRequest", foreign_keys="[SwapRequest.provider_id]", back_populates="provider")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    skill_type = Column(Enum("offered", "wanted", name="skill_type_enum"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="skills")


class SwapRequest(Base):
    __tablename__ = "swap_requests"

    id = Column(Integer, primary_key=True, index=True)
    status = Column(Enum("pending", "accepted", "rejected", name="status_enum"), default="pending")
    
    requester_id = Column(Integer, ForeignKey("users.id"))
    provider_id = Column(Integer, ForeignKey("users.id"))
    offered_skill_id = Column(Integer, ForeignKey("skills.id"))
    wanted_skill_id = Column(Integer, ForeignKey("skills.id"))

    requester = relationship("User", foreign_keys=[requester_id], back_populates="requests_sent")
    provider = relationship("User", foreign_keys=[provider_id], back_populates="requests_received")
    offered_skill = relationship("Skill", foreign_keys=[offered_skill_id])
    wanted_skill = relationship("Skill", foreign_keys=[wanted_skill_id])