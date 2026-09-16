from typing import List
from fastapi import APIRouter, Depends, status, HTTPException
from sqlmodel import Session

from app.routers.deps import get_db, get_current_user, get_current_active_admin
from app.schemas.order import OrderCreate, OrderResponse, OrderUpdate
from app.models.user import User, UserRole
from app.services.order_service import OrderService

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    order_in: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Crea una orden con checkout atómico y descuento de stock."""
    if current_user.id is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="ID de usuario inválido")
    order_service = OrderService(db)
    return order_service.create_order(user_id=current_user.id, data=order_in)


@router.get("/my-orders", response_model=List[OrderResponse])
@router.get("/me", response_model=List[OrderResponse])
def get_my_orders(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retorna las órdenes del usuario actualmente autenticado."""
    if current_user.id is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="ID de usuario inválido")
    order_service = OrderService(db)
    return order_service.get_by_user_id(user_id=current_user.id, skip=skip, limit=limit)


@router.get("", response_model=List[OrderResponse])
def get_all_orders(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_admin)
):
    """Retorna todas las órdenes del sistema. Restringido a administradores."""
    order_service = OrderService(db)
    return order_service.get_all(skip=skip, limit=limit)


@router.get("/{id}", response_model=OrderResponse)
def get_order_by_id(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtiene el detalle de una orden si pertenece al usuario o si es administrador."""
    order_service = OrderService(db)
    order = order_service.get_by_id(id)
    if order.user_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permisos para ver esta orden."
        )
    return order


@router.patch("/{id}/status", response_model=OrderResponse)
def update_order_status(
    id: int,
    order_in: OrderUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_admin)
):
    """Actualiza el estado de una orden. Restringido a administradores."""
    order_service = OrderService(db)
    return order_service.update_status(id, order_in)
