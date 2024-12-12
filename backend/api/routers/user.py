from fastapi import APIRouter, HTTPException, status, Depends
from crud.user import UserCrudManager
from crud.diary import DiaryCrudManager
from schemas import user as UserSchema
from auth.passwd import get_password_hash
from .depends import check_user_id
from mbti_classification import inference
from bs4 import BeautifulSoup

permission_denied = HTTPException(
    status_code=status.HTTP_403_FORBIDDEN, detail="Permission denied"
)

not_found = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND, detail="User does not exist"
)

already_exists = HTTPException(
    status_code=status.HTTP_409_CONFLICT, detail="User already exists"
)

UserCrud = UserCrudManager()
DiaryCrud = DiaryCrudManager()
router = APIRouter(prefix="/user", tags=["Users"])


@router.post("", status_code=status.HTTP_204_NO_CONTENT)
async def create_user(newUser: UserSchema.UserCreate):
    if await UserCrud.get(newUser.uid):
        raise already_exists

    newUser.password = get_password_hash(newUser.password)
    user = await UserCrud.create(newUser)

    return user


@router.get(
    "", response_model=list[UserSchema.UserRead], status_code=status.HTTP_200_OK
)
async def get_all_users():
    users = await UserCrud.get_all()
    if users:
        return users
    raise not_found


@router.get(
    "/{uid}", response_model=UserSchema.UserRead, status_code=status.HTTP_200_OK
)
async def get_user(uid: str):
    user = await UserCrud.get(uid)
    if user:
        return user
    raise not_found


@router.delete("/{uid}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(uid: str = Depends(check_user_id)):
    await UserCrud.delete(uid)
    return


@router.put("/{uid}", status_code=status.HTTP_200_OK)
async def update_user(
    uid: str = Depends(check_user_id),
):
    diaries = await DiaryCrud.get_by_user_id(uid)
    combined_content = " ".join(
        BeautifulSoup(diary.content, "html.parser").get_text() for diary in diaries
    )
    try:
        mbti = inference(combined_content[:512])
        update_data = UserSchema.UserUpdate(mbti=mbti)
        await UserCrud.update(uid, update_data)
    except Exception as e:
        print(f"Failed to update user {uid} with inference: {e}")

    return {"mbti": mbti, "uid": uid}


@router.put("/demo/{uid}", status_code=status.HTTP_204_NO_CONTENT)
async def update_user_demo(
    updateUser: UserSchema.UserUpdateDemo,
    uid: str = Depends(check_user_id),
):
    await UserCrud.update(uid, updateUser)
    return
