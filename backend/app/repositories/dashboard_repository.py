from datetime import date, datetime, timezone
from typing import Dict, Any, List
from sqlmodel import Session, select, col
from sqlalchemy import func, desc

from app.models.order import Order, OrderItem, OrderStatus
from app.models.product import Product


class DashboardRepository:
    """
    Capa de acceso a datos para métricas, agregaciones y estadísticas del negocio.
    """

    def __init__(self, session: Session) -> None:
        self.session = session

    def get_monthly_sales(self) -> float:
        """Suma el monto total de órdenes no canceladas del mes actual."""
        first_day_of_month = date.today().replace(day=1)
        month_start_dt = datetime(first_day_of_month.year, first_day_of_month.month, 1, tzinfo=timezone.utc)
        
        statement = (
            select(func.sum(col(Order.total_amount)))
            .where(Order.status != OrderStatus.CANCELLED)
            .where(Order.created_at >= month_start_dt)
        )
        result = self.session.exec(statement).first()
        return float(result) if result else 0.0

    def get_pending_orders_count(self) -> int:
        """Conteo de órdenes con estado PENDING."""
        statement = (
            select(func.count(col(Order.id)))
            .where(Order.status == OrderStatus.PENDING)
        )
        result = self.session.exec(statement).first()
        return int(result) if result else 0

    def get_low_stock_products_count(self) -> int:
        """Conteo de productos cuyo stock actual es menor o igual al stock mínimo."""
        statement = (
            select(func.count(col(Product.id)))
            .where(Product.stock_actual <= Product.stock_minimo)
        )
        result = self.session.exec(statement).first()
        return int(result) if result else 0

    def get_total_inventory_value(self) -> float:
        """Suma de (precio * stock_actual) de todos los productos."""
        statement = select(func.sum(col(Product.precio) * col(Product.stock_actual)))
        result = self.session.exec(statement).first()
        return float(result) if result else 0.0

    def get_top_products(self, limit: int = 5) -> List[Dict[str, Any]]:
        """
        Retorna el Top N de productos más vendidos en base a los OrderItems.
        Si no hay ventas suficientes, completa con los productos con mejor rating.
        """
        statement = (
            select(
                OrderItem.product_id,
                Product.nombre,
                func.sum(OrderItem.cantidad).label("total_vendido")
            )
            .join(Product, OrderItem.product_id == Product.id)
            .group_by(OrderItem.product_id, Product.nombre)
            .order_by(desc("total_vendido"))
            .limit(limit)
        )
        rows = self.session.exec(statement).all()

        results = [
            {
                "product_id": row[0],
                "nombre": row[1],
                "total_vendido": int(row[2])
            }
            for row in rows
        ]

        # Si hay menos de limit productos vendidos, completar con productos del catálogo
        if len(results) < limit:
            existing_ids = {r["product_id"] for r in results}
            fallback_stmt = (
                select(Product.id, Product.nombre)
                .where(~col(Product.id).in_(existing_ids) if existing_ids else True)
                .order_by(col(Product.rating).desc())
                .limit(limit - len(results))
            )
            fallback_rows = self.session.exec(fallback_stmt).all()
            for p_id, p_name in fallback_rows:
                results.append({
                    "product_id": p_id,
                    "nombre": p_name,
                    "total_vendido": 0
                })

        return results

    def get_category_distribution(self) -> List[Dict[str, Any]]:
        """Retorna la cantidad de productos por categoría."""
        statement = (
            select(
                Product.categoria,
                func.count(col(Product.id)).label("total")
            )
            .group_by(Product.categoria)
            .order_by(desc("total"))
        )
        rows = self.session.exec(statement).all()
        return [
            {
                "categoria": row[0],
                "total": int(row[1])
            }
            for row in rows
        ]
