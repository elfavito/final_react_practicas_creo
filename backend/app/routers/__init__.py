from app.routers.auth_router import router as auth_router
from app.routers.product_router import router as product_router
from app.routers.order_router import router as order_router
from app.routers.dashboard_router import router as dashboard_router

__all__ = [
    "auth_router",
    "product_router",
    "order_router",
    "dashboard_router",
]
