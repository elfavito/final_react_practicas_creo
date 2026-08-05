import sys
from pathlib import Path

# Garantizar que el directorio raíz del backend esté en sys.path para resolver 'app'
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from contextlib import asynccontextmanager  # noqa: E402
from fastapi import FastAPI  # noqa: E402
from fastapi.middleware.cors import CORSMiddleware  # noqa: E402
from app.core.config import settings  # noqa: E402
from app.core.database import init_db  # noqa: E402


from app.routers import auth_router, product_router, order_router, dashboard_router  # noqa: E402

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Evento de startup para la BD
    init_db()
    yield
    # Cleanup si es necesario

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Ajustar en producción a los dominios del frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusión de routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(product_router, prefix=settings.API_V1_STR)
app.include_router(order_router, prefix=settings.API_V1_STR)
app.include_router(dashboard_router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {
        "message": f"Bienvenido a la API de {settings.PROJECT_NAME}",
        "status": "online",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}
