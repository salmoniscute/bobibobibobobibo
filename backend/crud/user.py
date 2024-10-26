from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from models.user import User as UserModel
from schemas import user as UserSchema
from database import crud_class_decorator

@crud_class_decorator
class UserCrudManager:
    async def create(self, newUser: UserSchema.UserCreate, db_session: AsyncSession):
        newUser_dict = newUser.model_dump()
        user = UserModel(**newUser_dict)
        db_session.add(user)
        await db_session.commit()
        return user

    async def get(self, uid: str, db_session: AsyncSession):
        stmt = select(UserModel).where(UserModel.uid == uid)
        result = await db_session.execute(stmt)
        user = result.first()
        
        return user[0] if user else None
    
    async def get_all(self, db_session: AsyncSession):
        stmt = select(UserModel)
        result = await db_session.execute(stmt)
        result = result.unique()

        return [user[0] for user in result.all()]
    
    async def delete(self, uid: int, db_session: AsyncSession):
        stmt = delete(UserModel).where(UserModel.uid == uid)
        await db_session.execute(stmt)
        await db_session.commit()
        return