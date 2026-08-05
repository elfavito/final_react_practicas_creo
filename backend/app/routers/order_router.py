from fastapi import APIRouter, Depends, status, HTTPException
from sqlmodel import Session
from app.routers.deps import get_db, get_current_user
from app.schemas.order import OrderCreate, OrderResponse
from app.models.user import User
from app.services.order_service import OrderService

router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    order_in: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.id is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="ID de usuario inválido")
    order_service = OrderService(db)
    # the user is passed from the token
    return order_service.create_order(user_id=current_user.id, data=order_in)
