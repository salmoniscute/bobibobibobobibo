from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from uvicorn import Config, Server
from .routers.user import router as user_router
from .routers.diary import router as diary_router
from .routers.auth import router as auth_router

app = FastAPI()
app.include_router(user_router)
app.include_router(diary_router)
app.include_router(auth_router)

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def api_run():
    config = Config(
        app=app,
        host="0.0.0.0",
        port=8080
    )
    server = Server(config=config)

    await server.serve()

    server.run() 