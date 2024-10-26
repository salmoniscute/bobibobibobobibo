from fastapi import APIRouter,HTTPException, status,Depends
from crud.diary import DiaryCrudManager
from schemas import diary as DiarySchema
from .depends import  check_user_id , check_diary_id

not_found = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND, 
    detail="Diary does not exist"
)

already_exists = HTTPException(
    status_code=status.HTTP_409_CONFLICT, 
    detail="Diary already exists"
)

DiaryCrud = DiaryCrudManager()
router = APIRouter(
    prefix="/diary",
    tags=["Diary"]
)


@router.post(
    "",
    status_code=status.HTTP_201_CREATED
)
async def create_dairy(
    newDiary: DiarySchema.DiaryCreate,
    uid: str = Depends(check_user_id),
):
    diary = await DiaryCrud.create(uid, newDiary)
    return {"id": diary.id}


@router.get(
    "/{diary_id}",
    response_model=DiarySchema.DiaryRead,
    status_code=status.HTTP_200_OK
)
async def get_diary(diary_id: int):
    diary = await DiaryCrud.get(diary_id)
    if diary:
        return diary

    raise not_found


@router.get(
    "", 
    response_model=list[DiarySchema.DiaryRead],
    status_code=status.HTTP_200_OK
)
async def get_all_diaries_of_particular_user(uid: str = Depends(check_user_id)):

    diaries = await DiaryCrud.get_by_user_id(uid)
    if diaries:
        return diaries
    raise not_found


@router.delete(
    "/{diary_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
async def delete_diary(diary_id: int = Depends(check_diary_id)):
    await DiaryCrud.delete(diary_id)
    return 

