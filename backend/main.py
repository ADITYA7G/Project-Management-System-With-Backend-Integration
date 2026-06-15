from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import models
import schemas
import crud
import auth
import database

# Create database tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Task Management API")

# CORS setup for Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, specify the Next.js domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = crud.get_user_by_email(db, form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/users/", response_model=schemas.UserOut)
def create_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = crud.get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.get("/tasks/", response_model=List[schemas.TaskOut])
def read_tasks(skip: int = 0, limit: int = 100, current_user = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    return crud.get_tasks(db, user_id=current_user.id, skip=skip, limit=limit)

@app.get("/users/me", response_model=schemas.UserOut)
def read_user_me(current_user = Depends(auth.get_current_user)):
    return current_user

@app.post("/tasks/", response_model=schemas.TaskOut)
def create_task(task: schemas.TaskCreate, current_user = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    return crud.create_task(db=db, task=task, user_id=current_user.id)

@app.patch("/tasks/{task_id}", response_model=schemas.TaskOut)
def update_task(task_id: int, task: schemas.TaskUpdate, current_user = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    db_task = crud.update_task(db, task_id=task_id, task_update=task, user_id=current_user.id)
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, current_user = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    success = crud.delete_task(db, task_id=task_id, user_id=current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"detail": "Task deleted successfully"}
