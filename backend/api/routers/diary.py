from fastapi import APIRouter, HTTPException, status, Depends
from crud.diary import DiaryCrudManager
from schemas import diary as DiarySchema
from .depends import check_user_id, check_diary_id
from fastapi import BackgroundTasks
from feedback_generating import inference


not_found = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND, detail="Diary does not exist"
)

already_exists = HTTPException(
    status_code=status.HTTP_409_CONFLICT, detail="Diary already exists"
)

DiaryCrud = DiaryCrudManager()
router = APIRouter(prefix="/diary", tags=["Diary"])


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_dairy(
    newDiary: DiarySchema.DiaryCreate,
    uid: str = Depends(check_user_id),
):
    diary = await DiaryCrud.create(uid, newDiary)
    diary = await DiaryCrud.get(diary.id)
    if not diary:
        raise not_found

    try:
        ai_feedback = inference(diary.content)
        update_data = DiarySchema.DiaryUpdate(ai_feedback=ai_feedback)
        await DiaryCrud.update(diary.id, update_data)
    except Exception as e:
        print(f"Failed to update diary {diary.id} with inference: {e}")
    return


@router.get(
    "/{diary_id}", response_model=DiarySchema.DiaryRead, status_code=status.HTTP_200_OK
)
async def get_diary(diary_id: int):
    diary = await DiaryCrud.get(diary_id)
    if diary:
        return diary

    raise not_found


@router.get(
    "", response_model=list[DiarySchema.DiaryRead], status_code=status.HTTP_200_OK
)
async def get_all_diaries_of_particular_user(uid: str = Depends(check_user_id)):

    diaries = await DiaryCrud.get_by_user_id(uid)
    if diaries:
        return diaries
    raise not_found


@router.delete("/{diary_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_diary(diary_id: int = Depends(check_diary_id)):
    await DiaryCrud.delete(diary_id)
    return


async def update_diary_with_inference(diary_id: int):
    diary = await DiaryCrud.get(diary_id)
    if not diary:
        raise not_found

    try:
        ai_feedback = inference(diary.content)
        update_data = DiarySchema.DiaryUpdate(ai_feedback=ai_feedback)
        await DiaryCrud.update(diary_id, update_data)
    except Exception as e:
        print(f"Failed to update diary {diary_id} with inference: {e}")
