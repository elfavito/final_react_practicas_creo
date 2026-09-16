from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict


class ProductBase(BaseModel):
    sku: str
    nombre: str
    descripcion: Optional[str] = None
    precio: float = Field(..., ge=0.0)
    categoria: str
    rating: float = Field(default=0.0, ge=0.0, le=5.0)
    stock_actual: int = Field(default=0, ge=0)
    stock_minimo: int = Field(default=0, ge=0)
    opciones: Dict[str, Any] = Field(default_factory=dict)


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    sku: Optional[str] = None
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    precio: Optional[float] = Field(None, ge=0.0)
    categoria: Optional[str] = None
    rating: Optional[float] = Field(None, ge=0.0, le=5.0)
    stock_actual: Optional[int] = Field(None, ge=0)
    stock_minimo: Optional[int] = Field(None, ge=0)
    opciones: Optional[Dict[str, Any]] = None


class ProductResponse(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProductWithStatus(ProductResponse):
    """
    Respuesta de producto enriquecida con el campo calculado stock_status.
    Extiende ProductResponse (Pydantic puro, no tabla SQLModel).
    """
    stock_status: Optional[str] = None
