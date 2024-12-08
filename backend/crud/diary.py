from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from models.diary import Diary as DiaryModel
from schemas import diary as DiarySchema
from database import crud_class_decorator
from datetime import datetime
from transformers import (
    BartTokenizer,
    BartForConditionalGeneration,
    AutoModelForSeq2SeqLM,
    AutoTokenizer,
)

# import torch


def feedback_inference(content):
    # device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    # # 加载训练好的模型和 tokenizer
    # model = AutoModelForSeq2SeqLM.from_pretrained("./saved_model")
    # tokenizer = AutoTokenizer.from_pretrained("./saved_model")
    input_text = "at all  i like to share responsibilities  when i pay half of my share  i actually distance myself from the fact that someone is offering me something and wooing me   i am actually      i m thinking infp   i forget to eat when i get caught up with work and i reach a point where i would eat my mother if she s in a sandwich  i don t really mind veganism  but frankly it s impractical for me  also i love      it s not the content of the conversation that matters  it s how it s conveyed   everyone can be smart and interested in science or philosophy  it s just that some are not going to be interested in      maybe the people you live with are just not the people you are supposed to live with  you know   living with someone is quite a commitment and has a huge impact on your well being  if anything  this      superiority complex    respect is not to be earned in my opinion  it s better to give it freely at first  and it has to be taken away when people are not worth it  it doesn t even have to be taken away in fact  you can      i don t even know if this is serious or not  but here s a hug    patriotism is dumb  it s being proud of something you didn t achieve  it s like being proud of having freckles   and carrying a freckled flag everywhere  and bombing people because  freckles    just throw it all out of the window when it gets too overwhelming    in a parallel universe  famous wants to become you    sorry  i don t know  kill your neighbor  here s your 15 minutes of fame  i should not be giving people advice    you guys are awesome   it s a shame you feel like you can t express your insights because the world would really benefit from it    i know that in my experience it s actually the opposite   i can      it s always stimulated really  but there is this weird thing that happens to me  i dream about solutions to my problems   i think it s ni in action  i have to create a packaging for a product and i        but it s not a detailed plan  it s a general idea like   i want to work in x field later  or i want to be in a monogamous relationship never have kids or whatever  immuable guidelines  then      type   intj believe   i don t know  why   because nothing has proven their non existence  and nothing has proven their existence either  therefore it s open to discussion  debate and research        only if forced to be honest   it seems like a fun idea for a book series  i would read it    yeah i know i personally have a hard time forgiving people  the other intj i know is even worse than i am  the intp i know doesn t care much  both of them are my best friends so i know them pretty      absurd and sarcastic  more on the absurd side  i would say that they get my sense of humor easier than other types and i find it refreshing when what i say don t go over peoples heads  also great      intj or infj   in both cases  if she s closed off to you  it s because she doesn t trust you in some way  you probably hurt her many times and she decided to shut the door and only interact with you      hi  i m a j so i ll tell you what i do and i hope it helps here s my advice     make lists   make playlists that go with the project that you re working on  to influence your mood  i m dead      general coolness thirst for knowledge low maintenance same sense of humor   istp or isfp maybe     yes i do  when i m close to someone i do value them greatly and if someone attacks them  i m not gonna let them do so  and i hate people who try to humiliate others    but sometimes     when i feel    "

    # # 对输入文本进行编码
    # inputs = tokenizer(
    #     input_text, return_tensors="pt", padding=True, truncation=True, max_length=512
    # )
    # inputs = {key: value.to(device) for key, value in inputs.items()}

    # # 使用模型生成文本
    # with torch.no_grad():
    #     output = model.generate(
    #         **inputs, max_length=100, num_beams=5, early_stopping=True
    #     )

    # # 解码生成的输出
    # output_text = tokenizer.decode(output[0], skip_special_tokens=True)

    return "input_text   input_text   input_text   input_text   input_text"


@crud_class_decorator
class DiaryCrudManager:
    async def create(
        self, uid: str, newDiary: DiarySchema.DiaryCreate, db_session: AsyncSession
    ):
        newDiary_dict = newDiary.model_dump()
        diary = DiaryModel(
            uid=uid,
            release_time=datetime.now().strftime("%Y-%m-%dT%H:%M:%S"),
            ai_feedback=feedback_inference(newDiary_dict["content"]),
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
