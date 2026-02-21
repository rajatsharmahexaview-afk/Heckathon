from sqlalchemy import Column, String, Integer, Numeric, Enum, ForeignKey, Boolean, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    role = Column(Enum("grandparent", "grandchild", "trustee", name="user_roles"), nullable=False)
    
    gifts_created = relationship("Gift", back_populates="grandparent", foreign_keys="Gift.grandparent_id")
    gifts_received = relationship("Gift", back_populates="grandchild", foreign_keys="Gift.grandchild_id")
    notifications = relationship("Notification", back_populates="recipient")

class Gift(Base):
    __tablename__ = "gifts"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    grandparent_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    grandchild_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    grandchild_name = Column(String, nullable=True) # Added grandchild_name
    message = Column(Text, nullable=True)
    corpus = Column(Numeric(15, 2), nullable=False)
    currency = Column(Enum("USD", "INR", name="currencies"), default="USD")
    status = Column(Enum("Draft", "Active", "Under Review", "Approved", "Rejected", "Redirected", "Completed", name="gift_statuses"), default="Draft")
    risk_profile = Column(Enum("Conservative", "Balanced", "Growth", name="risk_profiles"), default="Balanced")
    rule_type = Column(Enum("Time", "Milestone", "Behavior", name="rule_types"), default="Milestone")
    fallback_ngo_id = Column(String(50), nullable=True)
    
    grandparent = relationship("User", back_populates="gifts_created", foreign_keys=[grandparent_id])
    grandchild = relationship("User", back_populates="gifts_received", foreign_keys=[grandchild_id])
    milestones = relationship("Milestone", back_populates="gift", cascade="all, delete-orphan")
    media_messages = relationship("MediaMessage", back_populates="gift", cascade="all, delete-orphan")
    override_window = relationship("OverrideWindow", back_populates="gift", uselist=False, cascade="all, delete-orphan")

class Milestone(Base):
    __tablename__ = "milestones"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    gift_id = Column(UUID(as_uuid=True), ForeignKey("gifts.id"), nullable=False)
    type = Column(String(255), nullable=False) # e.g. Graduation
    percentage = Column(Integer, nullable=False)
    status = Column(Enum("Pending", "Submitted", "Approved", "Rejected", name="milestone_statuses"), default="Pending")
    
    gift = relationship("Gift", back_populates="milestones")

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    recipient_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    role = Column(Enum("grandparent", "grandchild", "trustee", name="user_roles_context"), nullable=False)
    event_type = Column(String(100), nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    action_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    recipient = relationship("User", back_populates="notifications")

class MediaMessage(Base):
    __tablename__ = "media_messages"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    gift_id = Column(UUID(as_uuid=True), ForeignKey("gifts.id"), nullable=False)
    uploader_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    type = Column(Enum("text", "photo", "audio", "video", name="media_types"), nullable=False)
    file_path = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    gift = relationship("Gift", back_populates="media_messages")

class OverrideWindow(Base):
    __tablename__ = "override_windows"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    gift_id = Column(UUID(as_uuid=True), ForeignKey("gifts.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    expires_at = Column(DateTime, nullable=False) # created_at + 7 days
    status = Column(Enum("Open", "Overridden", "Expired", name="override_statuses"), default="Open")
    
    gift = relationship("Gift", back_populates="override_window")
