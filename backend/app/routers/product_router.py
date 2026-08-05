from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.routers.deps import get_db, get_current_user
from app.schemas.product import ProductResponse, ProductUpdate
from app.models.user import User
from app.services.product_service import ProductService, ProductWithStatus

router = APIRouter(prefix="/products", tags=["products"])

@router.get("", response_model=List[ProductWithStatus])
def get_products(
    skip: int = 0,
    limit: int = 100,
    categoria: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    product_service = ProductService(db)
    return product_service.get_all(skip=skip, limit=limit, categoria=categoria)

@router.get("/alerts", response_model=List[ProductWithStatus])
def get_product_alerts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    product_service = ProductService(db)
    return product_service.get_stock_alerts()

@router.get("/{id}", response_model=ProductWithStatus)
def get_product(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    product_service = ProductService(db)
    return product_service.get_by_id(id)

@router.patch("/{id}", response_model=ProductWithStatus)
def update_product(
    id: int,
    product_in: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    product_service = ProductService(db)
    return product_service.update(id, product_in)
