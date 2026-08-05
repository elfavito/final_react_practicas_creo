from datetime import datetime
from enum import Enum
from typing import Optional, List, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.product import Product


class OrderStatus(str, Enum):
    PENDING = "PENDING"
    PAID = "PAID"
    SHIPPED = "SHIPPED"
    DELIVERED = "DELIVERED"
    CANCELLED = "CANCELLED"


class Order(SQLModel, table=True):
    __tablename__ = "order"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", nullable=False, index=True)
    status: OrderStatus = Field(default=OrderStatus.PENDING, nullable=False)
    total_amount: float = Field(default=0.0, ge=0.0, nullable=False)
    shipping_address: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    user: Optional["User"] = Relationship(back_populates="orders")
    items: List["OrderItem"] = Relationship(back_populates="order", sa_relationship_kwargs={"cascade": "all, delete-orphan"})


class OrderItem(SQLModel, table=True):
    __tablename__ = "orderitem"

    id: Optional[int] = Field(default=None, primary_key=True)
    order_id: int = Field(foreign_key="order.id", nullable=False, index=True)
    product_id: int = Field(foreign_key="product.id", nullable=False, index=True)
    cantidad: int = Field(..., ge=1, nullable=False)
    precio_unitario: float = Field(..., ge=0.0, nullable=False)

    order: Optional[Order] = Relationship(back_populates="items")
    product: Optional["Product"] = Relationship(back_populates="order_items")
