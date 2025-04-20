from typing import List, Optional
from sqlalchemy.orm import Session
from ..models.api import API
from ..schemas.api import APICreate, APIUpdate

class APIService:
    def get(self, db: Session, id: int) -> Optional[API]:
        return db.query(API).filter(API.id == id).first()

    def get_multi(self, db: Session, *, skip: int = 0, limit: int = 100) -> List[API]:
        return db.query(API).offset(skip).limit(limit).all()
    
    def count(self, db: Session) -> int:
        return db.query(API).count()

    def create(self, db: Session, *, obj_in: APICreate) -> API:
        db_obj = API(
            name=obj_in.name,
            method=obj_in.method,
            path=obj_in.path,
            description=obj_in.description,
            headers=obj_in.headers,
            parameters=obj_in.parameters,
            response_example=obj_in.response_example
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, *, db_obj: API, obj_in: APIUpdate) -> API:
        update_data = obj_in.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, *, id: int) -> API:
        obj = db.query(API).get(id)
        db.delete(obj)
        db.commit()
        return obj

api_service = APIService() 