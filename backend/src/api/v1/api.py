from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ...db.session import get_db
from ...schemas.api import API, APICreate, APIUpdate, APIList
from ...services.api import api_service

router = APIRouter()

@router.get("/", response_model=APIList)
def list_apis(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """获取 API 列表"""
    apis = api_service.get_multi(db, skip=skip, limit=limit)
    total = api_service.count(db)
    return {"total": total, "items": apis}

@router.post("/", response_model=API)
def create_api(
    api_in: APICreate,
    db: Session = Depends(get_db)
):
    """创建新的 API"""
    return api_service.create(db, obj_in=api_in)

@router.get("/{api_id}", response_model=API)
def get_api(
    api_id: int,
    db: Session = Depends(get_db)
):
    """获取特定 API 的详细信息"""
    api = api_service.get(db, id=api_id)
    if not api:
        raise HTTPException(status_code=404, detail="API not found")
    return api

@router.put("/{api_id}", response_model=API)
def update_api(
    api_id: int,
    api_in: APIUpdate,
    db: Session = Depends(get_db)
):
    """更新 API 信息"""
    api = api_service.get(db, id=api_id)
    if not api:
        raise HTTPException(status_code=404, detail="API not found")
    return api_service.update(db, db_obj=api, obj_in=api_in)

@router.delete("/{api_id}")
def delete_api(
    api_id: int,
    db: Session = Depends(get_db)
):
    """删除 API"""
    api = api_service.get(db, id=api_id)
    if not api:
        raise HTTPException(status_code=404, detail="API not found")
    api_service.remove(db, id=api_id)
    return {"status": "success"} 