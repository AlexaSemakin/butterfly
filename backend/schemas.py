from typing import Optional, List
from datetime import date

from pydantic import BaseModel, EmailStr


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
    settings: Optional[str]


class PersonCreate(PersonBase):
    pass


class Person(PersonBase):
    id: int

    class Config:
        orm_mode = True
