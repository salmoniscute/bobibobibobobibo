from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class DiaryCreate(BaseModel):
    title: str = Field(min_length=1, max_length=100)
    content: str = Field(min_length=1, max_length=1000)

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "title": "This is a title",
                    "content": "This is a content",
                }
            ]
        }
    }


class DiaryRead(BaseModel):
    uid: str
    id: int
    release_time: datetime
    title: str
    content: str
    ai_feedback: str
