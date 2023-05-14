import json
import typing
from typing import Annotated, List
from random import randint

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import insert
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from backend.database import get_session
from backend import models
from backend import schemas


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_person_departments(session: Session, person_id: int):
    result = session.query(models.Department)\
        .join(models.Subdepartment, models.Department.subdepartments)\
        .join(models.Project, models.Subdepartment.projects)\
        .join(models.Person, models.Project.persons)\
        .filter(models.Person.id == person_id)\
        .all()
    return result


def get_person_subdepartments(session: Session, person_id: int):
    result = session.query(models.Subdepartment) \
        .join(models.Project, models.Subdepartment.projects) \
        .join(models.Person, models.Project.persons) \
        .filter(models.Person.id == person_id) \
        .all()
    return result


@app.get('/persons', response_model=List[schemas.Person])
def get_persons(session: Annotated[Session, Depends(get_session)]):
    persons_db = session.query(models.Person).all()
    persons_out = list()
    for person_db in persons_db:
        person = schemas.Person.from_orm(person_db)
        bosses = person_db.bosses
        employees = person_db.employees
        departments = get_person_departments(session, person.id)
        subdepartments = get_person_subdepartments(session, person.id)
        projects = list(person_db.projects)
        person.project = projects[0].name if len(projects) != 0 else None
        person.department = departments[0].name if len(departments) != 0 else None
        person.subdepartment = subdepartments[0].name if len(subdepartments) != 0 else None
        person.boss_email = bosses[0].email if len(bosses) != 0 else None
        person.employee_email = employees[0].email if len(employees) != 0 else None
        persons_out.append(person)

    return persons_out


@app.get('/personsGraph')
def get_persons_graph(session: Annotated[Session, Depends(get_session)]):
    persons_db = session.query(models.Person)
    persons_out = list()
    for person_db in persons_db:
        person = schemas.PersonGraph.from_orm(person_db)
        bosses = person_db.bosses
        departments = get_person_departments(session, person.id)
        person.department = departments[0].name if len(departments) != 0 else 'Default'
        person.pid = bosses[0].id if len(bosses) != 0 else None
        person.img = 'https://cdn.balkan.app/shared/' + str(randint(1, 18)) + '.jpg'
        persons_out.append(person.dict(exclude_none=True))
    return persons_out


@app.get('/personsDetail', response_model=List[schemas.PersonDetail])
def get_persons(session: Annotated[Session, Depends(get_session)]):
    persons_db = session.query(models.Person).all()
    persons_out = list()
    for person_db in persons_db:
        person = schemas.PersonDetail.from_orm(person_db)
        bosses = person_db.bosses
        employees = person_db.employees
        person.departments = get_person_departments(session, person.id)
        person.subdepartments = get_person_subdepartments(session, person.id)
        person.boss_emails = list([i.email for i in bosses])
        person.employee_emails = list([i.email for i in employees])
        persons_out.append(person)

    return persons_out


@app.get('/persons/{person_email}', response_model=schemas.PersonDetail)
def get_person(session: Annotated[Session, Depends(get_session)], person_email: str):
    person = session.query(models.Person).filter(models.Person.email == person_email).first()
    bosses = person.bosses
    employees = person.employees
    person = schemas.PersonDetail.from_orm(person)
    person.departments = get_person_departments(session, person.id)
    person.subdepartments = get_person_subdepartments(session, person.id)
    person.boss_emails = list([i.email for i in bosses])
    person.employee_emails = list([i.email for i in employees])
    return person


@app.post('/persons', response_model=schemas.Person)
def create_person(session: Annotated[Session, Depends(get_session)], new_person: schemas.PersonCreate):
    new_person = models.Person(**new_person.dict(exclude_unset=True))
    session.add(new_person)
    session.commit()
    session.refresh(new_person)
    return new_person


@app.post('/persons/delete/{person_id}')
def delete_person(session: Annotated[Session, Depends(get_session)], person_id: int):
    person = session.query(models.Person).get(person_id)
    telegram = person.telegram
    session.delete(person)
    session.commit()
    # TODO: code...


@app.post('/persons/settings/{person_email}')
def update_person_settings(session: Annotated[Session, Depends(get_session)], person_email: str, settings: schemas.Settings):
    person = session.query(models.Person).filter(models.Person.email == person_email).first()
    person.settings = settings.dict()
    session.add(person)
    session.commit()
    session.refresh(person)
    return person


@app.get('/repositories/{repository_id}')
def get_repository(session: Annotated[Session, Depends(get_session)], repository_id: int):
    return session.query(models.Repository).get(repository_id)


@app.get('/repositories', response_model=List[schemas.Repository])
def get_repositories(session: Annotated[Session, Depends(get_session)]):
    return session.query(models.Repository).all()


@app.post('/repositories', response_model=schemas.Repository)
def create_repository(session: Annotated[Session, Depends(get_session)], new_repository: schemas.RepositoryCreate):
    new_repository = models.Repository(**new_repository.dict(exclude_unset=True))
    session.add(new_repository)
    session.commit()
    session.refresh(new_repository)
    return new_repository


@app.get('/projects/{project_id}', response_model=schemas.Project)
def get_project(session: Annotated[Session, Depends(get_session)], project_id: int):
    return session.query(models.Project).get(project_id)


@app.get('/projects', response_model=List[schemas.Project])
def get_projects(session: Annotated[Session, Depends(get_session)]):
    return session.query(models.Project).all()


@app.post('/projects', response_model=schemas.Project)
def create_project(session: Annotated[Session, Depends(get_session)], new_project: schemas.ProjectCreate):
    new_project = models.Project(**new_project.dict(exclude_unset=True))
    session.add(new_project)
    session.commit()
    session.refresh(new_project)
    return new_project


@app.get('/subdepartments/{subdepartment_id}')
def get_subdepartment(session: Annotated[Session, Depends(get_session)], subdepartment_id: int):
    return session.query(models.Subdepartment).get(subdepartment_id)


@app.get('/subdepartments', response_model=List[schemas.Subdepartment])
def get_subdepartments(session: Annotated[Session, Depends(get_session)]):
    return session.query(models.Subdepartment).all()


@app.post('/subdepartments', response_model=schemas.Subdepartment)
def create_subdepartment(session: Annotated[Session, Depends(get_session)], new_subdepartment: schemas.SubdepartmentCreate):
    new_subdepartment = models.Subdepartment(**new_subdepartment.dict(exclude_unset=True))
    session.add(new_subdepartment)
    session.commit()
    session.refresh(new_subdepartment)
    return new_subdepartment


@app.get('/departments/{department_id}')
def get_department(session: Annotated[Session, Depends(get_session)], department_id: int):
    return session.query(models.Department).get(department_id)


@app.get('/departments', response_model=List[schemas.Department])
def get_departments(session: Annotated[Session, Depends(get_session)]):
    return session.query(models.Department).all()


@app.post('/departments', response_model=schemas.Department)
def create_department(session: Annotated[Session, Depends(get_session)], new_department: schemas.DepartmentCreate):
    new_department = models.Department(**new_department.dict(exclude_unset=True))
    session.add(new_department)
    session.commit()
    session.refresh(new_department)
    return new_department


@app.post('/relations')
def create_relation(session: Annotated[Session, Depends(get_session)], new_relation: schemas.Relation):
    try:
        session.execute(models.relations.insert().values(**new_relation.dict()))
        session.commit()
    except IntegrityError:
        print('Already exists')
    return {'message': 'created'}


@app.post('/relations/delete')
def delete_relation(session: Annotated[Session, Depends(get_session)], relation: schemas.Relation):
    filters = [getattr(models.relations.c, name) == value for (name, value) in relation.dict().items()]
    session.execute(models.relations.delete().filter(*filters))
    session.commit()
    return {'message': 'deleted'}


@app.post('/personProject')
def create_person_project(session: Annotated[Session, Depends(get_session)], new_person_project: schemas.PersonProject):
    try:
        session.execute(models.person_project.insert().values(**new_person_project.dict()))
        session.commit()
    except IntegrityError:
        print('Already exists')
    return {'message': 'created'}


@app.post('/personProject/delete')
def delete_person_project(session: Annotated[Session, Depends(get_session)], person_project: schemas.PersonProject):
    filters = [getattr(models.person_project.c, name) == value for (name, value) in person_project.dict().items()]
    session.execute(models.person_project.delete().filter(*filters))
    session.commit()
    return {'message': 'deleted'}


@app.post('/repositoryProject')
def create_repository_project(session: Annotated[Session, Depends(get_session)], new_repository_project: schemas.RepositoryProject):
    try:
        session.execute(models.repository_project.insert().values(**new_repository_project.dict()))
        session.commit()
    except IntegrityError:
        print('Already exists')
    return {'message': 'created'}


@app.post('/repositoryProject/delete')
def delete_repository_project(session: Annotated[Session, Depends(get_session)], repository_project: schemas.RepositoryProject):
    filters = [getattr(models.repository_project.c, name) == value for (name, value) in repository_project.dict().items()]
    session.execute(models.repository_project.delete().filter(*filters))
    session.commit()
    return {'message': 'deleted'}


@app.post('/projectSubdepartment')
def create_project_subdepartment(session: Annotated[Session, Depends(get_session)], new_project_subdepartment: schemas.ProjectSubdepartment):
    try:
        session.execute(models.project_subdepartment.insert().values(**new_project_subdepartment.dict()))
        session.commit()
    except IntegrityError:
        print('Already exists')
    return {'message': 'created'}


@app.post('/projectSubdepartment/delete')
def delete_project_subdepartment(session: Annotated[Session, Depends(get_session)], project_subdepartment: schemas.ProjectSubdepartment):
    filters = [getattr(models.project_subdepartment.c, name) == value for (name, value) in project_subdepartment.dict().items()]
    session.execute(models.project_subdepartment.delete().filter(*filters))
    session.commit()
    return {'message': 'deleted'}


@app.post('/subdepartmentDepartment')
def create_subdepartment_department(session: Annotated[Session, Depends(get_session)], new_subdepartment_department: schemas.SubdepartmentDepartment):
    try:
        session.execute(models.subdepartment_department.insert().values(**new_subdepartment_department.dict()))
        session.commit()
    except IntegrityError:
        print('Already exists')
    return {'message': 'created'}


@app.post('/subdepartmentDepartment/delete')
def delete_subdepartment_department(session: Annotated[Session, Depends(get_session)], subdepartment_department: schemas.SubdepartmentDepartment):
    filters = [getattr(models.subdepartment_department.c, name) == value for (name, value) in subdepartment_department.dict().items()]
    session.execute(models.subdepartment_department.delete().filter(*filters))
    session.commit()
    return {'message': 'deleted'}


@app.get('/search/{q}')
def search(session: Annotated[Session, Depends(get_session)], q: str):
    classes = (models.Person, models.Repository, models.Project, models.Subdepartment, models.Department)
    result = []
    for c in classes:
        result += models.search(c, q)
    return [dict(zip(('name', 'column', 'object'), i)) for i in result]


@app.get('/searchByName/{q}')
def search(session: Annotated[Session, Depends(get_session)], q: str):
    result = models.search(models.Person, q, ('name', 'surname', 'patronymic'))
    return [dict(zip(('name', 'column', 'object'), i)) for i in result]
