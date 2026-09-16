from typing import Optional, List
from sqlmodel import Session, select

from app.models.user import User


class UserRepository:
    """
    Capa de acceso a datos para el modelo User.
    Toda interacción con la base de datos referida a usuarios pasa por aquí.
    """

    def __init__(self, session: Session) -> None:
        self.session = session

    # ------------------------------------------------------------------
    # Lecturas
    # ------------------------------------------------------------------

    def get_by_id(self, user_id: int) -> Optional[User]:
        """Obtiene un usuario por su ID primario."""
        return self.session.get(User, user_id)

    def get_by_email(self, email: str) -> Optional[User]:
        """Obtiene un usuario por su dirección de correo electrónico (único)."""
        statement = select(User).where(User.email == email)
        return self.session.exec(statement).first()

    def get_by_email_or_username(self, identifier: str) -> Optional[User]:
        """Obtiene un usuario por email o por nombre de usuario (ej. 'favo' o 'favo@educart.com')."""
        statement = select(User).where(
            (User.email == identifier) | 
            (User.email == f"{identifier}@educart.com")
        )
        return self.session.exec(statement).first()

    def get_all(self, skip: int = 0, limit: int = 100) -> List[User]:
        """Obtiene una lista paginada de todos los usuarios."""
        statement = select(User).offset(skip).limit(limit)
        return list(self.session.exec(statement).all())

    def exists_by_email(self, email: str) -> bool:
        """Comprueba si ya existe un usuario con el email dado."""
        statement = select(User.id).where(User.email == email)
        return self.session.exec(statement).first() is not None

    # ------------------------------------------------------------------
    # Escrituras
    # ------------------------------------------------------------------

    def create(self, user: User) -> User:
        """Persiste un nuevo usuario en la base de datos."""
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        return user

    def update(self, user: User) -> User:
        """Persiste los cambios de un usuario ya existente."""
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        return user

    def delete(self, user: User) -> None:
        """Elimina un usuario de la base de datos."""
        self.session.delete(user)
        self.session.commit()
