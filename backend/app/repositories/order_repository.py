from typing import Optional, List
from sqlmodel import Session, select

from app.models.order import Order, OrderItem


class OrderRepository:
    """
    Capa de acceso a datos para los modelos Order y OrderItem.
    Toda interacción con la base de datos referida a órdenes pasa por aquí.
    """

    def __init__(self, session: Session) -> None:
        self.session = session

    # ------------------------------------------------------------------
    # Lecturas — Order
    # ------------------------------------------------------------------

    def get_by_id(self, order_id: int) -> Optional[Order]:
        """Obtiene una orden por su ID primario (incluye items via lazy load)."""
        return self.session.get(Order, order_id)

    def get_all(self, skip: int = 0, limit: int = 100) -> List[Order]:
        """Obtiene una lista paginada de todas las órdenes."""
        statement = select(Order).offset(skip).limit(limit)
        return list(self.session.exec(statement).all())

    def get_by_user_id(
        self,
        user_id: int,
        skip: int = 0,
        limit: int = 100,
    ) -> List[Order]:
        """Obtiene todas las órdenes pertenecientes a un usuario específico."""
        statement = (
            select(Order)
            .where(Order.user_id == user_id)
            .offset(skip)
            .limit(limit)
        )
        return list(self.session.exec(statement).all())

    # ------------------------------------------------------------------
    # Lecturas — OrderItem
    # ------------------------------------------------------------------

    def get_items_by_order_id(self, order_id: int) -> List[OrderItem]:
        """Obtiene todos los ítems de una orden concreta."""
        statement = select(OrderItem).where(OrderItem.order_id == order_id)
        return list(self.session.exec(statement).all())

    # ------------------------------------------------------------------
    # Escrituras dentro de transacción (sin commit propio)
    # Son usadas exclusivamente por OrderService dentro de una transacción atómica.
    # ------------------------------------------------------------------

    def add_order(self, order: Order) -> None:
        """Añade una Order a la sesión sin hacer commit."""
        self.session.add(order)

    def add_order_item(self, item: OrderItem) -> None:
        """Añade un OrderItem a la sesión sin hacer commit."""
        self.session.add(item)

    def flush(self) -> None:
        """Sincroniza los objetos en memoria con la BD sin hacer commit."""
        self.session.flush()

    # ------------------------------------------------------------------
    # Escrituras independientes (con commit propio)
    # ------------------------------------------------------------------

    def update_order(self, order: Order) -> Order:
        """Persiste los cambios de una Order ya existente."""
        self.session.add(order)
        self.session.commit()
        self.session.refresh(order)
        return order

    def delete_order(self, order: Order) -> None:
        """Elimina una Order (y sus ítems en cascada) de la base de datos."""
        self.session.delete(order)
        self.session.commit()
