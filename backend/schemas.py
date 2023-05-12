from typing import Optional, List
from datetime import date

from pydantic import BaseModel, EmailStr


class Settings(BaseModel):
    name: Optional[bool]
    surname: Optional[bool]
    email: Optional[bool]
    position: Optional[bool]
    patronymic: Optional[bool]
    birth_date: Optional[bool]
    gender: Optional[bool]
    summary: Optional[bool]
    phone: Optional[bool]
    city: Optional[bool]
    employment_date: Optional[bool]
    telegram: Optional[bool]
    notification_lang: Optional[bool]
    about: Optional[bool]
    graph: Optional[bool]


class PersonBase(BaseModel):
    name: Optional[str]
    surname: Optional[str]
    email: EmailStr
    position: Optional[str]
    patronymic: Optional[str]
    birth_date: Optional[date]
    gender: Optional[bool]
    summary: Optional[str]
    phone: Optional[str]
    city: Optional[str]
    employment_date: Optional[date]
    telegram: Optional[str]
    notification_lang: Optional[str]
    about: Optional[str]
    settings: Optional[Settings]


class PersonCreate(PersonBase):
    pass


class Person(PersonBase):
    id: int

    class Config:
        orm_mode = True


class RepositoryBase(BaseModel):
    name: Optional[str]
    url: Optional[str]

class RepositoryCreate(RepositoryBase):
    pass

class Repository(RepositoryBase):
    id: int