from typing import Generator
from sqlmodel import SQLModel, Session, create_engine
from app.core.config import settings

# Engine Singleton de SQLModel/SQLAlchemy
engine = create_engine(
    settings.DB_URL,
    echo=False,
    pool_pre_ping=True
)


def init_db() -> None:
    """
    Crea las tablas en la base de datos basándose en los metadatos de SQLModel.
    Útil para inicializar la base de datos en entornos de desarrollo/pruebas.
    """
    import app.models  # noqa: F401 - Asegura el registro de todos los modelos SQLModel
    SQLModel.metadata.create_all(engine)


def get_db() -> Generator[Session, None, None]:
    """
    Función generadora de sesión de base de datos.
    Garantiza el cierre adecuado de la sesión tras finalizar la petición HTTP.
    Uso: `db: Session = Depends(get_db)`
    """
    with Session(engine) as session:
        yield session
