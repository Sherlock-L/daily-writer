from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, SmallInteger
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import DATABASE_URL
from sqlalchemy import create_engine

from fastapi import HTTPException
import time
from sqlalchemy.exc import SQLAlchemyError
# 创建数据库引擎
# engine = create_engine(DATABASE_URL, echo=True)
engine = create_engine(
    DATABASE_URL,
    echo=True,
    pool_size=10,
    max_overflow=20,
    pool_timeout=30,
    pool_recycle=3600  # 1小时，小于MySQL默认的8小时超时
)
# 创建会话
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 声明基类
Base = declarative_base()

class Diary(Base):
    __tablename__ = 'diary'

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(200), nullable=False, comment='日记标题')
    content = Column(Text, nullable=False, comment='日记内容')
    create_time = Column(DateTime, nullable=False, default=datetime.now, comment='创建时间')
    update_time = Column(DateTime, nullable=False, default=datetime.now, onupdate=datetime.now, comment='更新时间')
    is_deleted = Column(SmallInteger, nullable=False, default=0, comment='是否删除(0:未删除,1:已删除)')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'create_time': self.create_time.strftime('%Y-%m-%d %H:%M:%S'),
            'update_time': self.update_time.strftime('%Y-%m-%d %H:%M:%S')
        }

# 创建数据库表
def create_tables():
    Base.metadata.create_all(bind=engine)

# 依赖项：获取数据库会话
def get_db():        
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 新增：每次请求创建新连接的函数
def get_db_new_connection():        
    # 每次请求都创建新的引擎和会话
    new_engine = create_engine(
        DATABASE_URL,
        echo=True,
        pool_size=0,  # 不使用连接池
        max_overflow=0
    )
    NewSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=new_engine)
    db = NewSessionLocal()
    try:
        yield db
    finally:
        db.close()
        new_engine.dispose()  # 释放引擎资源


# 带重试机制的数据库会话获取函数
def get_db_with_retry(max_retries: int = 3, delay: int = 1):
    """
    获取数据库会话，带重试机制
    
    参数:
    max_retries: 最大重试次数
    delay: 重试间隔(秒)
    """
    retries = 0
    while retries < max_retries:
        try:
            db = SessionLocal()
            try:
                yield db
                return  # 成功获取并使用会话后，直接返回
            finally:
                db.close()
        except SQLAlchemyError as e:
            retries += 1
            if retries >= max_retries:
                raise HTTPException(status_code=500, detail=f'数据库连接失败: {str(e)}')
            time.sleep(delay)
