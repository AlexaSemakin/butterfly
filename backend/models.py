import json
import re
from backend import database

from sqlalchemy import Table, Column, Integer, MetaData, ForeignKey, String, Date, Boolean, Text, JSON, BigInteger
from sqlalchemy.orm import DeclarativeBase, relationship, backref


def search(model_class, substring, columns=tuple()):
    s = database.SessionLocal()
    result = []
    for obj in s.query(model_class):
        for column in obj.__table__.columns.keys():
            if re.search(substring, str(getattr(obj, column)), re.IGNORECASE) and (len(columns) == 0 or column in columns):
                result.append((model_class.__tablename__, column, obj))
                break
    return result


class Base(DeclarativeBase):
    pass


relations = Table('relations', Base.metadata,
                  Column('boss_id', Integer, ForeignKey('person.id', ondelete='CASCADE'), primary_key=True),
                  Column('employee_id', Integer, ForeignKey('person.id', ondelete='CASCADE'), primary_key=True))

person_project = Table('person_project', Base.metadata,
                       Column('person_id', Integer, ForeignKey('person.id', ondelete='CASCADE'), primary_key=True),
                       Column('project_id', Integer, ForeignKey('project.id', ondelete='CASCADE'), primary_key=True))

repository_project = Table('repository_project', Base.metadata,
                           Column('repository_id', Integer, ForeignKey('repository.id', ondelete='CASCADE'), primary_key=True),
                           Column('project_id', Integer, ForeignKey('project.id', ondelete='CASCADE'), primary_key=True))

project_subdepartment = Table('project_subdepartment', Base.metadata,
                              Column('project_id', Integer, ForeignKey('project.id', ondelete='CASCADE'),
                                     primary_key=True),
                              Column('subdepartment_id', Integer, ForeignKey('subdepartment.id', ondelete='CASCADE'),
                                     primary_key=True))

subdepartment_department = Table('subdepartment_department', Base.metadata,
                                 Column('subdepartment_id', Integer, ForeignKey('subdepartment.id', ondelete='CASCADE'),
                                        primary_key=True),
                                 Column('department_id', Integer, ForeignKey('department.id', ondelete='CASCADE'),
                                        primary_key=True))


person_group = Table('person_group', Base.metadata,
                     Column('person_id', Integer, ForeignKey('person.id', ondelete='CASCADE', primary_key=True)),
                     Column('group_id', String(32), primary_key=True))


def get_person_settings(self):
    attrs = ('name', 'surname', 'email', 'post', 'patronymic', 'birth_date', 'gender', 'summary', 'phone',
             'city', 'employment_date', 'telegram', 'notification_lang', 'about', 'graph')
    return dict(zip(attrs, [True] * len(attrs)))


class Person(Base):
    __tablename__ = 'person'
    id = Column(Integer(), primary_key=True)
    name = Column(String(200), nullable=False)
    surname = Column(String(200), nullable=True)  # nullable=False)
    email = Column(String(200), nullable=False, unique=True)  # nullable=False)
    post = Column(String(200), nullable=True)
    patronymic = Column(String(200), nullable=True)  # nullable=False)
    birth_date = Column(Date(), nullable=True)  # nullable=False)
    gender = Column(Boolean(), nullable=True)  # nullable=False)  # 0 - female, 1 - male
    summary = Column(String(200), nullable=True)
    phone = Column(String(200), nullable=True)  # nullable=False)
    city = Column(String(200), nullable=True)  # nullable=False)
    employment_date = Column(Date(), nullable=True)  # nullable=False)
    telegram = Column(String(200), nullable=True)
    telegram_id = Column(String(32), nullable=True)
    notification_lang = Column(String(200), nullable=True)
    about = Column(Text(), nullable=True)
    settings = Column(JSON(), nullable=False, default=get_person_settings)
    image = Column(String(200), nullable=True)
    bosses = relationship('Person', secondary=relations, lazy='select', primaryjoin=relations.c.employee_id == id,
                          secondaryjoin=relations.c.boss_id == id, back_populates='employees')
    employees = relationship('Person', secondary=relations, lazy='select', primaryjoin=relations.c.boss_id == id,
                             secondaryjoin=relations.c.employee_id == id, back_populates='bosses')
    projects = relationship('Project', secondary=person_project, lazy='select',
                            backref=backref('persons', lazy='select'))

    def __init__(self, name, **kw):
        super().__init__(**kw)
        self.name = name


class Repository(Base):
    __tablename__ = 'repository'
    id = Column(Integer(), primary_key=True)
    name = Column(String(200), nullable=False)
    url = Column(String(200), nullable=True)
    projects = relationship('Project', secondary=repository_project, lazy='select',
                            backref=backref('repositories', lazy='select'))


class Project(Base):
    __tablename__ = 'project'
    id = Column(Integer(), primary_key=True)
    name = Column(String(200), nullable=False)
    subdepartments = relationship('Subdepartment', secondary=project_subdepartment, lazy='select',
                                  backref=backref('projects', lazy='select'))


class Subdepartment(Base):
    __tablename__ = 'subdepartment'
    id = Column(Integer(), primary_key=True)
    name = Column(String(200), nullable=False)
    departments = relationship('Department', secondary=subdepartment_department, lazy='select',
                               backref=backref('subdepartments', lazy='select'))


class Department(Base):
    __tablename__ = 'department'
    id = Column(Integer(), primary_key=True)
    name = Column(String(200), nullable=False)


if __name__ == '__main__':
    session = database.SessionLocal()
    session.add_all((Person(name='C', email='c@example.com'), Person(name='D', email='d@example.com')))
    session.commit()

