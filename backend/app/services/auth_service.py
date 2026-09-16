from datetime import timedelta
from typing import Optional

from fastapi import HTTPException, status
from sqlmodel import Session

from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.config import settings
from app.models.user import User, UserRole
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate


class AuthService:
    """
    Servicio de autenticación y gestión de identidad.
    Orquesta la lógica de negocio delegando el acceso a datos al UserRepository.
    """

    def __init__(self, session: Session) -> None:
        self.repo = UserRepository(session)

    # ------------------------------------------------------------------
    # Registro
    # ------------------------------------------------------------------

    def register(self, data: UserCreate) -> User:
        """
        Registra un nuevo usuario en el sistema.

        Reglas de negocio:
        - El email debe ser único.
        - La contraseña se almacena hasheada con Bcrypt.
        - El primer usuario registrado recibe rol ADMIN automáticamente.

        :raises HTTPException 409: Si el email ya está en uso.
        """
        if self.repo.exists_by_email(data.email):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"El email '{data.email}' ya está registrado.",
            )

        # El primer usuario registrado se convierte en ADMIN si no existe ninguno, de lo contrario CLIENT
        all_users = self.repo.get_all(skip=0, limit=1)
        role = UserRole.ADMIN if not all_users else UserRole.CLIENT

        user = User(
            email=data.email,
            hashed_password=get_password_hash(data.password),
            full_name=data.full_name,
            role=role,
            is_active=True,
        )
        return self.repo.create(user)

    # ------------------------------------------------------------------
    # Autenticación / Login
    # ------------------------------------------------------------------

    def authenticate(self, identifier: str, password: str) -> Optional[User]:
        """
        Verifica las credenciales del usuario por email o username (ej. favo).

        :returns: El objeto User si las credenciales son válidas, None en caso contrario.
        """
        user = self.repo.get_by_email_or_username(identifier)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    def login(self, email: str, password: str) -> dict:
        """
        Realiza el proceso completo de login y devuelve el token JWT.

        Reglas de negocio:
        - Las credenciales deben ser correctas.
        - La cuenta debe estar activa.

        :raises HTTPException 401: Si las credenciales son incorrectas.
        :raises HTTPException 403: Si la cuenta está desactivada.
        :returns: Dict con access_token, token_type y datos básicos del usuario.
        """
        user = self.authenticate(email, password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales incorrectas.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="La cuenta de usuario está desactivada.",
            )

        access_token = create_access_token(
            subject=user.id,
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "email": user.email,
                "full_name": user.full_name,
                "role": user.role,
            },
        }
