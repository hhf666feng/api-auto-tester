from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime

class APIParameter(BaseModel):
    name: str
    type: str
    description: Optional[str] = None
    required: bool = False

class APIBase(BaseModel):
    name: str
    method: str
    path: str
    description: Optional[str] = None
    headers: Dict[str, str]
    parameters: List[APIParameter]
    response_example: Optional[str] = None

class APICreate(APIBase):
    pass

class APIUpdate(APIBase):
    pass

class APIInDB(APIBase):
    id: int
    status: str = "not_tested"
    last_tested_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class API(APIInDB):
    pass

class APIList(BaseModel):
    total: int
    items: List[API] 