from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from . import models
from .api import auth, users, swaps

# Creates all the tables in the database if they don't exist
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Skill Swap API")

# Define the list of allowed origins
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/users", tags=["Users"]) 
app.include_router(swaps.router, prefix="/swaps", tags=["Swaps"]) 

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to the Skill Swap API!"}