from typing import Optional, List
from sqlmodel import Session, select

from app.models.product import Product


class ProductRepository:
    """
    Capa de acceso a datos para el modelo Product.
    Toda interacción con la base de datos referida a productos pasa por aquí.
    """

    def __init__(self, session: Session) -> None:
        self.session = session

    # ------------------------------------------------------------------
    # Lecturas
    # ------------------------------------------------------------------

    def get_by_id(self, product_id: int) -> Optional[Product]:
        """Obtiene un producto por su ID primario."""
        return self.session.get(Product, product_id)

    def get_by_sku(self, sku: str) -> Optional[Product]:
        """Obtiene un producto por su SKU único."""
        statement = select(Product).where(Product.sku == sku)
        return self.session.exec(statement).first()

    def get_all(
        self,
        skip: int = 0,
        limit: int = 100,
        categoria: Optional[str] = None,
    ) -> List[Product]:
        """
        Obtiene una lista paginada de productos.
        Permite filtrar opcionalmente por categoría.
        """
        statement = select(Product)
        if categoria:
            statement = statement.where(Product.categoria == categoria)
        statement = statement.offset(skip).limit(limit)
        return list(self.session.exec(statement).all())

    def get_low_stock_alerts(self) -> List[Product]:
        """
        Retorna todos los productos cuyo stock_actual es menor o igual
        a su stock_minimo. Incluye productos con stock_actual == 0 (agotados).
        """
        statement = select(Product).where(
            Product.stock_actual <= Product.stock_minimo
        )
        return list(self.session.exec(statement).all())

    def exists_by_sku(self, sku: str) -> bool:
        """Comprueba si ya existe un producto con el SKU dado."""
        statement = select(Product.id).where(Product.sku == sku)
        return self.session.exec(statement).first() is not None

    # ------------------------------------------------------------------
    # Escrituras (sin commit — el commit lo gestiona el servicio/transacción)
    # ------------------------------------------------------------------

    def create(self, product: Product) -> Product:
        """Persiste un nuevo producto en la base de datos."""
        self.session.add(product)
        self.session.commit()
        self.session.refresh(product)
        return product

    def update(self, product: Product) -> Product:
        """Persiste los cambios de un producto ya existente."""
        self.session.add(product)
        self.session.commit()
        self.session.refresh(product)
        return product

    def delete(self, product: Product) -> None:
        """Elimina un producto de la base de datos."""
        self.session.delete(product)
        self.session.commit()

    # ------------------------------------------------------------------
    # Escrituras dentro de transacción (sin commit propio)
    # ------------------------------------------------------------------

    def flush_update(self, product: Product) -> None:
        """
        Añade el producto a la sesión y hace flush sin commit.
        Usar dentro de una transacción atómica gestionada externamente
        (p.ej. en OrderService.create_order).
        """
        self.session.add(product)
        self.session.flush()
