from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from models import Diary, get_db_new_connection  # 修改这里，使用带重试的函数
from pydantic import BaseModel
from typing import List, Optional
from config import PER_PAGE

# 创建路由
router = APIRouter()

# 请求模型
class DiaryCreate(BaseModel):
    title: str
    content: str

class DiaryUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

# 保存日记
@router.post('/diary', response_model=dict)
def save_diary(diary: DiaryCreate, db: Session = Depends(get_db_new_connection)):  # 修改这里
    try:
        new_diary = Diary(title=diary.title, content=diary.content)
        db.add(new_diary)
        db.commit()
        db.refresh(new_diary)
        return {
            'code': 200,
            'message': '保存成功',
            'data': new_diary.to_dict()
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f'保存失败: {str(e)}')

# 获取日记列表
@router.get('/diaries', response_model=dict)
def get_diaries(
    page: int = Query(1, ge=1),
    per_page: int = Query(PER_PAGE, ge=1, le=100),
    search: str = Query('', min_length=0),
    db: Session = Depends(get_db_new_connection)  # 修改这里
):
    try:
        # 计算偏移量
        offset = (page - 1) * per_page

        # 查询条件
        query = db.query(Diary).filter(Diary.is_deleted == 0)

        # 关键词搜索
        if search:
            query = query.filter(
                (Diary.title.like(f'%{search}%')) | 
                (Diary.content.like(f'%{search}%'))
            )

        # 获取总数
        total = query.count()

        # 获取分页数据
        diaries = query.order_by(Diary.create_time.desc()).offset(offset).limit(per_page).all()

        return {
            'code': 200,
            'message': '查询成功',
            'data': {
                'items': [diary.to_dict() for diary in diaries],
                'total': total,
                'page': page,
                'per_page': per_page,
                'pages': (total + per_page - 1) // per_page
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'查询失败: {str(e)}')

# 获取日记详情
@router.get('/diary/{diary_id}', response_model=dict)
def get_diary(diary_id: int, db: Session = Depends(get_db_new_connection)):  # 修改这里
    try:
        diary = db.query(Diary).filter(Diary.id == diary_id, Diary.is_deleted == 0).first()
        if not diary:
            raise HTTPException(status_code=404, detail='日记不存在')
        return {
            'code': 200,
            'message': '查询成功',
            'data': diary.to_dict()
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'查询失败: {str(e)}')

# 更新日记
@router.put('/diary/{diary_id}', response_model=dict)
def update_diary(diary_id: int, diary: DiaryUpdate, db: Session = Depends(get_db_new_connection)):  # 修改这里
    try:
        existing_diary = db.query(Diary).filter(Diary.id == diary_id, Diary.is_deleted == 0).first()
        if not existing_diary:
            raise HTTPException(status_code=404, detail='日记不存在')

        # 更新字段
        if diary.title is not None:
            existing_diary.title = diary.title
        if diary.content is not None:
            existing_diary.content = diary.content

        db.commit()
        db.refresh(existing_diary)

        return {
            'code': 200,
            'message': '更新成功',
            'data': existing_diary.to_dict()
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f'更新失败: {str(e)}')

# 删除日记
@router.delete('/diary/{diary_id}', response_model=dict)
def delete_diary(diary_id: int, db: Session = Depends(get_db_new_connection)):  # 修改这里
    try:
        diary = db.query(Diary).filter(Diary.id == diary_id, Diary.is_deleted == 0).first()
        if not diary:
            raise HTTPException(status_code=404, detail='日记不存在')

        # 软删除
        diary.is_deleted = 1
        db.commit()

        return {
            'code': 200,
            'message': '删除成功'
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f'删除失败: {str(e)}')