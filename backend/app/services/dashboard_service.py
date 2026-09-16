from typing import Dict, Any, List
from sqlmodel import Session

from app.repositories.dashboard_repository import DashboardRepository


class DashboardService:
    """
    Servicio de lógica de negocio para métricas, KPIs y gráficos del panel de administración.
    Delega las consultas al DashboardRepository.
    """

    def __init__(self, session: Session) -> None:
        self.repo = DashboardRepository(session)

    def get_stats(self) -> Dict[str, Any]:
        """
        Calcula y retorna los 4 KPIs principales del negocio en tiempo real.
        """
        return {
            "ventas_del_mes": self.repo.get_monthly_sales(),
            "ordenes_pendientes": self.repo.get_pending_orders_count(),
            "productos_en_alerta": self.repo.get_low_stock_products_count(),
            "valor_total_inventario": self.repo.get_total_inventory_value(),
        }

    def get_top_products(self, limit: int = 5) -> List[Dict[str, Any]]:
        """
        Retorna los productos más vendidos para el gráfico de barras.
        """
        return self.repo.get_top_products(limit=limit)

    def get_category_distribution(self) -> List[Dict[str, Any]]:
        """
        Retorna la distribución de inventario por categoría para el gráfico de torta.
        """
        return self.repo.get_category_distribution()
