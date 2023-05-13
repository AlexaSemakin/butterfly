import typing
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


class ProjectBase(BaseModel):
    name: Optional[str]


class ProjectCreate(ProjectBase):
    pass


class Project(ProjectBase):
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

    class Config:
        orm_mode = True
        

class SubdepartmentBase(BaseModel):
    name: Optional[str]


class SubdepartmentCreate(SubdepartmentBase):
    pass


class Subdepartment(SubdepartmentBase):
    id: int
    
    class Config:
        orm_mode = True


class DepartmentBase(BaseModel):
    name: Optional[str]


class DepartmentCreate(DepartmentBase):
    pass


class Department(DepartmentBase):
    id: int

    class Config:
        orm_mode = True


class Relation(BaseModel):
    boss_id: int
    employee_id: int

    class Config:
        orm_mode = True


class PersonProject(BaseModel):
    person_id: int
    project_id: int

    class Config:
        orm_mode = True


class RepositoryProject(BaseModel):
    repository_id: int
    project_id: int

    class Config:
        orm_mode = True


class ProjectSubdepartment(BaseModel):
    project_id: int
    subdepartment_id: int

    class Config:
        orm_mode = True


class SubdepartmentDepartment(BaseModel):
    subdepartment_id: int
    department_id: int

    class Config:
        orm_mode = True


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
    projects: typing.List[Project]
    departments: Optional[typing.List[Department]]
    subdepartments: Optional[typing.List[Subdepartment]]
    # bosses = Optional[List]
    # employees = Optional[List]
    boss_emails: Optional[typing.List[EmailStr]]
    employee_emails: Optional[typing.List[EmailStr]]

    class Config:
        orm_mode = True
