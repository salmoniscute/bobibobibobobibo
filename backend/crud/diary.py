from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from models.diary import Diary as DiaryModel
from schemas import diary as DiarySchema
from database import crud_class_decorator
from datetime import datetime


@crud_class_decorator
class DiaryCrudManager:
    async def create(
        self, uid: str, newDiary: DiarySchema.DiaryCreate, db_session: AsyncSession
    ):
        newDiary_dict = newDiary.model_dump()
        diary = DiaryModel(
            uid=uid,
            release_time=datetime.now().strftime("%Y-%m-%dT%H:%M:%S"),
            ai_feedback="",
            **newDiary_dict
        )
        db_session.add(diary)
        await db_session.commit()
        return diary

    async def get(self, diary_id: int, db_session: AsyncSession):
        stmt = select(DiaryModel).where(DiaryModel.id == diary_id)
        result = await db_session.execute(stmt)
        diary = result.first()
        return diary[0] if diary else None

    async def get_by_user_id(self, uid: str, db_session: AsyncSession):
        stmt = select(DiaryModel).where(DiaryModel.uid == uid)
        result = await db_session.execute(stmt)
        result = result.unique()
        return [diary[0] for diary in result.all()]

    async def delete(self, diary_id: int, db_session: AsyncSession):
        stmt = delete(DiaryModel).where(DiaryModel.id == diary_id)
        await db_session.execute(stmt)
        await db_session.commit()

        return

    async def update(
        self,
        diary_id: int,
        updateDiary: DiarySchema.DiaryUpdate,
        db_session: AsyncSession,
    ):
        updateDiary_dict = updateDiary.model_dump(exclude_none=True)
        if updateDiary_dict:
            stmt = (
                update(DiaryModel)
                .where(DiaryModel.id == diary_id)
                .values(updateDiary_dict)
            )
            await db_session.execute(stmt)
            await db_session.commit()
        return
