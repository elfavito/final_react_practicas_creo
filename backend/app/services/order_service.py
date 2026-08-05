from datetime import datetime
from typing import List

from fastapi import HTTPException, status
from sqlmodel import Session

from app.models.order import Order, OrderItem, OrderStatus
from app.repositories.order_repository import OrderRepository
from app.repositories.product_repository import ProductRepository
from app.repositories.user_repository import UserRepository
from app.schemas.order import OrderCreate, OrderUpdate


class OrderService:
    """
    Servicio de lógica de negocio para órdenes de compra.
    Gestiona la transacción atómica completa de creación de pedidos.
    """

    def __init__(self, session: Session) -> None:
        self.session = session
        self.order_repo = OrderRepository(session)
        self.product_repo = ProductRepository(session)
        self.user_repo = UserRepository(session)

    # ------------------------------------------------------------------
    # Creación con transacción atómica y ROLLBACK
    # ------------------------------------------------------------------

    def create_order(self, user_id: int, data: OrderCreate) -> Order:
        """
        Crea una orden completa de forma atómica.

        Pasos de la transacción:
        a) Abrir la transacción con session.begin().
        b) Verificar disponibilidad de stock_actual para cada ítem.
           Si alguno falla → ROLLBACK automático + HTTPException 400.
        c) Descontar stock_actual de cada producto.
        d) Crear el registro Order y sus OrderItems.
        e) COMMIT y retornar la orden creada.

        :raises HTTPException 404: Si el usuario no existe.
        :raises HTTPException 400: Si algún producto no existe o no tiene stock.
        """
        # Verificar que el usuario existe
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Usuario con id={user_id} no encontrado.",
            )

        # ---- INICIO DE TRANSACCIÓN ATÓMICA ----
        # La sesión de SQLModel/SQLAlchemy gestiona la transacción activa.
        # En caso de excepción dentro del bloque, se ejecuta ROLLBACK automático.
        try:
            # b) Verificar disponibilidad de stock para TODOS los ítems antes
            #    de realizar cualquier descuento (evita estados parciales).
            products_cache: dict[int, any] = {}
            for item_data in data.items:
                product = self.product_repo.get_by_id(item_data.product_id)

                if not product:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=(
                            f"Producto con id={item_data.product_id} no existe. "
                            "Pedido cancelado."
                        ),
                    )

                if product.stock_actual < item_data.cantidad:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=(
                            f"Stock insuficiente para '{product.nombre}' "
                            f"(disponible: {product.stock_actual}, "
                            f"solicitado: {item_data.cantidad}). "
                            "Pedido cancelado."
                        ),
                    )

                products_cache[item_data.product_id] = product

            # c) Descontar stock_actual de cada producto
            total_amount: float = 0.0
            for item_data in data.items:
                product = products_cache[item_data.product_id]
                product.stock_actual -= item_data.cantidad
                product.updated_at = datetime.utcnow()
                self.product_repo.flush_update(product)  # flush sin commit

            # d) Crear Order
            order = Order(
                user_id=user_id,
                status=OrderStatus.PENDING,
                shipping_address=data.shipping_address,
                total_amount=0.0,  # Se calcula a continuación
            )
            self.order_repo.add_order(order)
            self.order_repo.flush()  # Obtener order.id del DB

            # d) Crear OrderItems y calcular total
            for item_data in data.items:
                product = products_cache[item_data.product_id]
                order_item = OrderItem(
                    order_id=order.id,
                    product_id=item_data.product_id,
                    cantidad=item_data.cantidad,
                    precio_unitario=item_data.precio_unitario,
                )
                total_amount += item_data.cantidad * item_data.precio_unitario
                self.order_repo.add_order_item(order_item)

            # Actualizar total en la Order
            order.total_amount = round(total_amount, 2)
            self.order_repo.add_order(order)

            # e) COMMIT — confirma todos los cambios atómicamente
            self.session.commit()
            self.session.refresh(order)
            return order

        except HTTPException:
            # ROLLBACK explícito ante error de negocio
            self.session.rollback()
            raise

        except Exception as exc:
            # ROLLBACK explícito ante error inesperado
            self.session.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error inesperado al procesar el pedido: {str(exc)}",
            ) from exc

    # ------------------------------------------------------------------
    # Lectura
    # ------------------------------------------------------------------

    def get_by_id(self, order_id: int) -> Order:
        """
        Obtiene una orden por ID.

        :raises HTTPException 404: Si la orden no existe.
        """
        order = self.order_repo.get_by_id(order_id)
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Orden con id={order_id} no encontrada.",
            )
        return order

    def get_all(self, skip: int = 0, limit: int = 100) -> List[Order]:
        """Retorna todas las órdenes paginadas."""
        return self.order_repo.get_all(skip=skip, limit=limit)

    def get_by_user_id(
        self, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[Order]:
        """Retorna todas las órdenes de un usuario específico."""
        return self.order_repo.get_by_user_id(
            user_id=user_id, skip=skip, limit=limit
        )

    # ------------------------------------------------------------------
    # Actualización de estado
    # ------------------------------------------------------------------

    def update_status(self, order_id: int, data: OrderUpdate) -> Order:
        """
        Actualiza el estado y/o dirección de envío de una orden.

        Regla de negocio: No se puede modificar una orden CANCELADA.

        :raises HTTPException 404: Si la orden no existe.
        :raises HTTPException 400: Si la orden ya está cancelada.
        """
        order = self.get_by_id(order_id)

        if order.status == OrderStatus.CANCELLED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No se puede modificar una orden cancelada.",
            )

        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(order, field, value)

        order.updated_at = datetime.utcnow()
        return self.order_repo.update_order(order)

    # ------------------------------------------------------------------
    # Cancelación
    # ------------------------------------------------------------------

    def cancel_order(self, order_id: int) -> Order:
        """
        Cancela una orden y repone el stock de los productos.

        Regla de negocio: Solo se puede cancelar una orden en estado PENDING.

        :raises HTTPException 404: Si la orden no existe.
        :raises HTTPException 400: Si la orden no está en estado PENDING.
        """
        order = self.get_by_id(order_id)

        if order.status != OrderStatus.PENDING:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    f"Solo se pueden cancelar órdenes en estado PENDING. "
                    f"Estado actual: {order.status.value}."
                ),
            )

        try:
            # Reponer stock de cada ítem
            for item in order.items:
                product = self.product_repo.get_by_id(item.product_id)
                if product:
                    product.stock_actual += item.cantidad
                    product.updated_at = datetime.utcnow()
                    self.product_repo.flush_update(product)

            order.status = OrderStatus.CANCELLED
            order.updated_at = datetime.utcnow()
            self.order_repo.add_order(order)

            self.session.commit()
            self.session.refresh(order)
            return order

        except HTTPException:
            self.session.rollback()
            raise
        except Exception as exc:
            self.session.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error inesperado al cancelar la orden: {str(exc)}",
            ) from exc
