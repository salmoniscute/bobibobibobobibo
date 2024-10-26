from pydantic import BaseModel, Field
from typing import Optional

class UserCreate(BaseModel):
    uid: str = Field(min_length=1, max_length=10)
    password: str = Field(min_length=6, max_length=20)
    name: str = Field(min_length=1, max_length=50)
    mbti: str = Field(min_length=1, max_length=10)

    model_config = {
        "json_schema_extra": {
            "examples": [
                { 
                    "uid": "salmon",
                    "password": "test123",
                    "name": "salmon_is_cute",
                    "mbti": "ENFJ"
                }
            ]
        }
    }

class UserRead(BaseModel):
    uid: str
    name: str
    mbti: str