from typing import List, Optional
from fastapi import APIRouter, Depends, status
from sqlmodel import Session
from app.routers.deps import get_db, get_current_active_admin
from app.schemas.product import ProductCreate, ProductUpdate, ProductWithStatus
from app.models.user import User
from app.services.product_service import ProductService

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=List[ProductWithStatus])
def get_products(
    skip: int = 0,
    limit: int = 100,
    categoria: Optional[str] = None,
    search: Optional[str] = None,
    min_precio: Optional[float] = None,
    max_precio: Optional[float] = None,
    min_rating: Optional[float] = None,
    sort_by: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Retorna el catálogo de productos con soporte para búsqueda de texto,
    filtrado por categoría, rango de precios, rating mínimo y ordenamiento.
    """
    product_service = ProductService(db)
    return product_service.get_all(
        skip=skip,
        limit=limit,
        categoria=categoria,
        search=search,
        min_precio=min_precio,
        max_precio=max_precio,
        min_rating=min_rating,
        sort_by=sort_by
    )


@router.get("/alerts", response_model=List[ProductWithStatus])
def get_product_alerts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_admin)
):
    """Retorna productos con stock bajo o agotado. Restringido a ADMIN."""
    product_service = ProductService(db)
    return product_service.get_stock_alerts()


@router.get("/{id}", response_model=ProductWithStatus)
def get_product(
    id: int,
    db: Session = Depends(get_db)
):
    """Obtiene el detalle de un producto específico por ID."""
    product_service = ProductService(db)
    return product_service.get_by_id(id)


@router.post("", response_model=ProductWithStatus, status_code=status.HTTP_201_CREATED)
def create_product(
    product_in: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_admin)
):
    """Crea un nuevo producto en el catálogo. Restringido a ADMIN."""
    product_service = ProductService(db)
    return product_service.create(product_in)


@router.patch("/{id}", response_model=ProductWithStatus)
def update_product(
    id: int,
    product_in: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_admin)
):
    """Actualiza campos (stock, precio, etc.) de un producto existente. Restringido a ADMIN."""
    product_service = ProductService(db)
    return product_service.update(id, product_in)
