from sqlalchemy.orm import Session

import models
import schemas

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: schemas.UserCreate):
    from auth import get_password_hash

    hashed_pwd = get_password_hash(user.password)

    db_user = models.User(
        email=user.email,
        hashed_password=hashed_pwd,
        full_name=user.full_name
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


def get_tasks(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return (
        db.query(models.Task)
        .filter(models.Task.owner_id == user_id)
        .offset(skip)
        .limit(limit)
        .all()
    )


def create_task(db: Session, task: schemas.TaskCreate, user_id: int):
    db_task = models.Task(
        **task.model_dump(),
        owner_id=user_id
    )

    db.add(db_task)
    db.commit()
    db.refresh(db_task)

    return db_task


def update_task(
    db: Session,
    task_id: int,
    task_update: schemas.TaskUpdate,
    user_id: int
):
    db_task = (
        db.query(models.Task)
        .filter(
            models.Task.id == task_id,
            models.Task.owner_id == user_id
        )
        .first()
    )

    if not db_task:
        return None

    for key, value in task_update.model_dump(exclude_unset=True).items():
        setattr(db_task, key, value)

    db.commit()
    db.refresh(db_task)

    return db_task


def delete_task(db: Session, task_id: int, user_id: int):
    db_task = (
        db.query(models.Task)
        .filter(
            models.Task.id == task_id,
            models.Task.owner_id == user_id
        )
        .first()
    )

    if not db_task:
        return False

    db.delete(db_task)
    db.commit()

    return True