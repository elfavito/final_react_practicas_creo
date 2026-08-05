from datetime import datetime
from typing import Optional, List, Dict, Any, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship, Column, JSON

if TYPE_CHECKING:
    from app.models.order import OrderItem


class Product(SQLModel, table=True):
    __tablename__ = "product"

    id: Optional[int] = Field(default=None, primary_key=True)
    sku: str = Field(unique=True, index=True, nullable=False)
    nombre: str = Field(index=True, nullable=False)
    descripcion: Optional[str] = Field(default=None)
    precio: float = Field(nullable=False, ge=0.0)
    categoria: str = Field(index=True, nullable=False)
    rating: float = Field(default=0.0, ge=0.0, le=5.0)
    stock_actual: int = Field(default=0, ge=0)
    stock_minimo: int = Field(default=0, ge=0)
    opciones: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    order_items: List["OrderItem"] = Relationship(back_populates="product")
