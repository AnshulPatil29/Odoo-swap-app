from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from . import models
from .api import auth, users, swaps

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Skill Swap API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)


app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(users.router, tags=["Users"])
app.include_router(swaps.router, tags=["Swaps"])

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to the Skill Swap API!"}