from typing import Annotated

from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from backend.database import get_session
from backend import models
from backend import schemas

app = FastAPI()


@app.get('/persons/{person_email}')
async def get_person(session: Annotated[Session, Depends(get_session)], person_email: str):
    return session.query(models.Person).filter(models.Person.email == person_email).first()


@app.post('/persons')
def create_person(session: Annotated[Session, Depends(get_session)], new_person: schemas.PersonCreate):
    new_person = models.Person(**new_person.dict(exclude_unset=True))
    session.add(new_person)
    session.commit()
    session.refresh(new_person)
    return new_person


