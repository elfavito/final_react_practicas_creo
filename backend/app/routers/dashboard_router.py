from typing import Dict, Any
from datetime import date
from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from sqlalchemy import func
from app.routers.deps import get_db, get_current_active_admin
from app.models.user import User
from app.models.order import Order, OrderStatus
from app.models.product import Product

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_admin)
) -> Dict[str, Any]:
    # Ventas del mes (suma de total_amount de ordenes completadas/pagadas)
    # Asumimos que podemos sumar las que no estan canceladas o las que estan completadas.
    # Por ahora sumamos PENDING o COMPLETED (si existiera). Asumimos todo lo no CANCELLED.
    current_month = date.today().replace(day=1)
    
    ventas_del_mes = db.exec(
        select(func.sum(Order.total_amount))
        .where(Order.status != OrderStatus.CANCELLED)
        .where(Order.created_at >= current_month)
    ).first() or 0.0

    # Órdenes pendientes
    ordenes_pendientes = db.exec(
        select(func.count(Order.id))
        .where(Order.status == OrderStatus.PENDING)
    ).first() or 0

    # Productos en alerta (stock <= stock_minimo)
    productos_en_alerta = db.exec(
        select(func.count(Product.id))
        .where(Product.stock_actual <= Product.stock_minimo)
    ).first() or 0

    # Valor total del inventario (sum(precio * stock_actual))
    valor_inventario = db.exec(
        select(func.sum(Product.precio * Product.stock_actual))
    ).first() or 0.0

    return {
        "ventas_del_mes": float(ventas_del_mes),
        "ordenes_pendientes": int(ordenes_pendientes),
        "productos_en_alerta": int(productos_en_alerta),
        "valor_total_inventario": float(valor_inventario)
    }
