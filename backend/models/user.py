from sqlalchemy.orm import Mapped
from typing import Optional

from models.base import Base, BaseType


class User(Base):
    __tablename__ = "User"
    uid: Mapped[BaseType.uid]
    mbti: Mapped[BaseType.str_10]
    password: Mapped[BaseType.hashed_password]
