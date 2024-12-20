from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from contextlib import asynccontextmanager
from sqlalchemy.schema import CreateTable, DropTable
from models.user import User
from models.diary import Diary

URL_DATABASE = "mysql+aiomysql://root:password@localhost:3306/diary"

engine = create_async_engine(url=URL_DATABASE, echo=True, pool_pre_ping=True)

SessionLocal = async_sessionmaker(bind=engine, expire_on_commit=False, autocommit=False)


@asynccontextmanager
async def get_db():
    async with SessionLocal() as db:
        yield db


async def init_db():
    async with SessionLocal() as db:
        async with db.begin():
            await db.execute(CreateTable(User.__table__, if_not_exists=True))
            await db.execute(CreateTable(Diary.__table__, if_not_exists=True))


async def close_db():
    async with SessionLocal() as db:
        async with db.begin():
            await db.execute(DropTable(User.__table__))
            await db.execute(DropTable(Diary.__table__))

    await engine.dispose()


def db_session_decorator(func):
    async def wrapper(*args, **kwargs):
        async with get_db() as db_session:
            kwargs["db_session"] = db_session
            result = await func(*args, **kwargs)
            return result

    return wrapper


def crud_class_decorator(cls):
    for name, method in cls.__dict__.items():
        if callable(method):
            setattr(cls, name, db_session_decorator(method))

    return cls
