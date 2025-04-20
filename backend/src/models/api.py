from sqlalchemy import Column, Integer, String, JSON, DateTime, Enum
from sqlalchemy.sql import func
from typing import List, Optional
from datetime import datetime

from ..db.base_class import Base

class API(Base):
    __tablename__ = "apis"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    method = Column(String)  # GET, POST, PUT, DELETE, PATCH
    path = Column(String)
    description = Column(String, nullable=True)
    headers = Column(JSON)
    parameters = Column(JSON)
    response_example = Column(String, nullable=True)
    status = Column(String, default="not_tested")  # not_tested, success, failed
    last_tested_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now()) 