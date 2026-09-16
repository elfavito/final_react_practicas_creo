from typing import Dict, Any, List
from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.routers.deps import get_db, get_current_active_admin
from app.models.user import User
from app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/stats", response_model=Dict[str, Any])
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_admin)
) -> Dict[str, Any]:
    """Retorna los KPIs principales del negocio para administradores."""
    service = DashboardService(db)
    return service.get_stats()


@router.get("/top-products", response_model=List[Dict[str, Any]])
def get_top_products(
    limit: int = 5,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_admin)
) -> List[Dict[str, Any]]:
    """Retorna los productos más vendidos para el gráfico de barras del Dashboard."""
    service = DashboardService(db)
    return service.get_top_products(limit=limit)


@router.get("/category-distribution", response_model=List[Dict[str, Any]])
def get_category_distribution(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_admin)
) -> List[Dict[str, Any]]:
    """Retorna la distribución de productos por categoría para el gráfico de torta."""
    service = DashboardService(db)
    return service.get_category_distribution()
