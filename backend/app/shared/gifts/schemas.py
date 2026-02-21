from pydantic import BaseModel, Field
import uuid
from typing import List, Optional
from decimal import Decimal
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    grandparent = "grandparent"
    grandchild = "grandchild"
    trustee = "trustee"

class GiftStatus(str, Enum):
    Draft = "Draft"
    Active = "Active"
    Under_Review = "Under Review"
    Approved = "Approved"
    Rejected = "Rejected"
    Redirected = "Redirected"
    Completed = "Completed"

class RiskProfile(str, Enum):
    Conservative = "Conservative"
    Balanced = "Balanced"
    Growth = "Growth"

class Currency(str, Enum):
    USD = "USD"
    INR = "INR"

class RuleType(str, Enum):
    Time = "Time"
    Milestone = "Milestone"
    Behavior = "Behavior"

class MilestoneStatus(str, Enum):
    Pending = "Pending"
    Submitted = "Submitted"
    Approved = "Approved"
    Rejected = "Rejected"

class MediaType(str, Enum):
    text = "text"
    photo = "photo"
    audio = "audio"
    video = "video"

# User schemas
class UserBase(BaseModel):
    name: str
    role: UserRole

class UserCreate(UserBase):
    pass

class UserSchema(UserBase):
    id: uuid.UUID

    class Config:
        from_attributes = True

# Milestone schemas
class MilestoneBase(BaseModel):
    type: str
    percentage: int
    status: MilestoneStatus = MilestoneStatus.Pending

class MilestoneCreate(MilestoneBase):
    pass

class MilestoneSchema(MilestoneBase):
    id: uuid.UUID
    gift_id: uuid.UUID

    class Config:
        from_attributes = True

# Gift schemas
class GiftBase(BaseModel):
    grandchild_id: uuid.UUID
    grandchild_name: Optional[str] = None
    corpus: Decimal
    currency: Currency = Currency.USD
    risk_profile: RiskProfile = RiskProfile.Balanced
    rule_type: RuleType = RuleType.Milestone
    fallback_ngo_id: Optional[str] = None

class GiftCreate(GiftBase):
    milestones: List[MilestoneCreate]

class GiftSchema(GiftBase):
    id: uuid.UUID
    grandparent_id: uuid.UUID
    status: GiftStatus
    milestones: List[MilestoneSchema]

    class Config:
        from_attributes = True

# Notification schemas
class NotificationSchema(BaseModel):
    id: uuid.UUID
    recipient_id: uuid.UUID
    role: UserRole
    event_type: str
    message: str
    is_read: bool
    action_url: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

# Voice parsing schemas
class VoiceParseResponse(BaseModel):
    grandchild_name: Optional[str]
    corpus: Optional[Decimal]
    currency: Optional[Currency]
    risk_profile: Optional[RiskProfile]
    release_condition: Optional[str]
    confidence: float
