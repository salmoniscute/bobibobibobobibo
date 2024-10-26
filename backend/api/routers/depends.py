from fastapi import HTTPException, status

from crud.user import UserCrudManager
from crud.diary import DiaryCrudManager

UserCrud = UserCrudManager()
DiaryCrud = DiaryCrudManager()

async def check_user_id(uid: str):
    user = await UserCrud.get(uid)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User does not exist")

    return uid

async def check_diary_id(diary_id: str):
    diary = await DiaryCrud.get(diary_id)
    if not diary:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Diary does not exist")

    return diary
