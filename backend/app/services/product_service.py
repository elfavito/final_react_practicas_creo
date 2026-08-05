from datetime import datetime
from enum import Enum
from typing import List, Optional

from fastapi import HTTPException, status
from sqlmodel import Session

from app.models.product import Product
from app.repositories.product_repository import ProductRepository
from app.schemas.product import ProductCreate, ProductUpdate


class StockStatus(str, Enum):
    """Estado de stock calculado para cada producto."""
    AGOTADO = "Agotado"       # stock_actual == 0
    ALERTA = "Alerta"         # 0 < stock_actual <= stock_minimo
    NORMAL = "Normal"         # stock_actual > stock_minimo


class ProductWithStatus(Product):
    """
    Producto enriquecido con el campo calculado stock_status.
    No es una tabla — es únicamente un modelo de respuesta de servicio.
    """
    stock_status: StockStatus

    class Config:
        from_attributes = True


class ProductService:
    """
    Servicio de lógica de negocio para productos.
    Delega toda persistencia al ProductRepository.
    """

    def __init__(self, session: Session) -> None:
        self.repo = ProductRepository(session)

    # ------------------------------------------------------------------
    # Cálculo de estado de stock (lógica de negocio pura)
    # ------------------------------------------------------------------

    @staticmethod
    def calculate_stock_status(product: Product) -> StockStatus:
        """
        Calcula el estado de stock de un producto sin acceder a la BD.

        Reglas:
        - stock_actual == 0                      → Agotado
        - 0 < stock_actual <= stock_minimo        → Alerta
        - stock_actual > stock_minimo             → Normal
        """
        if product.stock_actual == 0:
            return StockStatus.AGOTADO
        if product.stock_actual <= product.stock_minimo:
            return StockStatus.ALERTA
        return StockStatus.NORMAL

    # ------------------------------------------------------------------
    # CRUD
    # ------------------------------------------------------------------

    def get_all(
        self,
        skip: int = 0,
        limit: int = 100,
        categoria: Optional[str] = None,
    ) -> List[dict]:
        """
        Retorna todos los productos paginados, enriquecidos con stock_status.
        Permite filtrar por categoría.
        """
        products = self.repo.get_all(skip=skip, limit=limit, categoria=categoria)
        return [self._enrich(p) for p in products]

    def get_by_id(self, product_id: int) -> dict:
        """
        Obtiene un producto por ID enriquecido con stock_status.

        :raises HTTPException 404: Si el producto no existe.
        """
        product = self.repo.get_by_id(product_id)
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Producto con id={product_id} no encontrado.",
            )
        return self._enrich(product)

    def create(self, data: ProductCreate) -> dict:
        """
        Crea un nuevo producto.

        :raises HTTPException 409: Si ya existe un producto con el mismo SKU.
        """
        if self.repo.exists_by_sku(data.sku):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Ya existe un producto con SKU '{data.sku}'.",
            )

        product = Product(
            sku=data.sku,
            nombre=data.nombre,
            descripcion=data.descripcion,
            precio=data.precio,
            categoria=data.categoria,
            rating=data.rating,
            stock_actual=data.stock_actual,
            stock_minimo=data.stock_minimo,
            opciones=data.opciones,
        )
        created = self.repo.create(product)
        return self._enrich(created)

    def update(self, product_id: int, data: ProductUpdate) -> dict:
        """
        Actualiza parcialmente los campos de un producto existente.

        :raises HTTPException 404: Si el producto no existe.
        :raises HTTPException 409: Si el nuevo SKU ya pertenece a otro producto.
        """
        product = self.repo.get_by_id(product_id)
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Producto con id={product_id} no encontrado.",
            )

        # Validar unicidad del SKU si se está modificando
        if data.sku is not None and data.sku != product.sku:
            if self.repo.exists_by_sku(data.sku):
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Ya existe un producto con SKU '{data.sku}'.",
                )

        # Aplicar solo los campos enviados (PATCH semántico)
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(product, field, value)

        product.updated_at = datetime.utcnow()
        updated = self.repo.update(product)
        return self._enrich(updated)

    def delete(self, product_id: int) -> None:
        """
        Elimina un producto por ID.

        :raises HTTPException 404: Si el producto no existe.
        """
        product = self.repo.get_by_id(product_id)
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Producto con id={product_id} no encontrado.",
            )
        self.repo.delete(product)

    def get_stock_alerts(self) -> List[dict]:
        """
        Retorna todos los productos en estado Alerta o Agotado
        (stock_actual <= stock_minimo).
        """
        products = self.repo.get_low_stock_alerts()
        return [self._enrich(p) for p in products]

    # ------------------------------------------------------------------
    # Helper interno
    # ------------------------------------------------------------------

    def _enrich(self, product: Product) -> dict:
        """Convierte un Product ORM en un dict con el campo stock_status añadido."""
        data = product.model_dump()
        data["stock_status"] = self.calculate_stock_status(product).value
        return data
