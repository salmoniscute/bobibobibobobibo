from sqlalchemy.orm import Mapped, mapped_column
from typing import Optional
from sqlalchemy import ForeignKey

from models.base import Base, BaseType


class Diary(Base):
    __tablename__ = "Diary"
    id: Mapped[BaseType.diary_id]
    uid: Mapped[BaseType.str_10] = mapped_column(
        ForeignKey("User.uid", ondelete="CASCADE")
    )
    release_time: Mapped[BaseType.datetime]
    title: Mapped[BaseType.str_100]
    content: Mapped[BaseType.str_1000]
    ai_feedback: Mapped[BaseType.str_1000]
