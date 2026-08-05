from datetime import datetime
from enum import Enum
from typing import Optional, List, TYPE_CHECKING
from sqlmodel import SQLModel, Field
from sqlmodel.main import Relationship

if TYPE_CHECKING:
    from app.models.order import Order


class UserRole(str, Enum):
    CLIENT = "CLIENT"
    ADMIN = "ADMIN"


class User(SQLModel, table=True):
    __tablename__ = "user"

    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True, nullable=False)
    hashed_password: str = Field(nullable=False)
    full_name: Optional[str] = Field(default=None)
    role: UserRole = Field(default=UserRole.CLIENT, nullable=False)
    is_active: bool = Field(default=True, nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    orders: List["Order"] = Relationship(back_populates="user")
