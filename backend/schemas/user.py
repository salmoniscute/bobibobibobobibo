from pydantic import BaseModel, Field
from typing import Optional


class UserCreate(BaseModel):
    uid: str = Field(min_length=1, max_length=10)
    password: str = Field(min_length=6, max_length=20)
    mbti: str = Field(min_length=1, max_length=10)

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "uid": "salmon",
                    "password": "test123",
                    "mbti": "ENFJ",
                }
            ]
        }
    }


class UserUpdate(BaseModel):
    mbti: str = Field(min_length=1, max_length=10)
    model_config = {"json_schema_extra": {"examples": [{"mbti": "ENFJ"}]}}


class UserRead(BaseModel):
    uid: str
    mbti: str
