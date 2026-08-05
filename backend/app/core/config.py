from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Configuración global de la aplicación utilizando Pydantic Settings.
    Carga variables de entorno desde un archivo .env o el entorno del sistema.
    """
    PROJECT_NAME: str = "EduCart API"
    API_V1_STR: str = "/api/v1"

    # Configuración de Base de Datos (PostgreSQL o MariaDB)
    DB_URL: str = "postgresql://educart_user:educart_password@localhost:5432/educart_db"

    # Configuración de Seguridad y JWT
    SECRET_KEY: str = "educart_super_secret_jwt_key_change_in_production_2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


# Instancia Singleton de configuración
settings = Settings()
