import sys
from pathlib import Path

backend_dir = Path(__file__).resolve().parent.parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

# Services package
from app.services.auth_service import AuthService  # noqa: E402
from app.services.product_service import ProductService  # noqa: E402
from app.services.order_service import OrderService  # noqa: E402

__all__ = ["AuthService", "ProductService", "OrderService"]

