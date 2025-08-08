from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, SmallInteger
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import DATABASE_URL
from sqlalchemy import create_engine

# 创建数据库引擎
engine = create_engine(DATABASE_URL, echo=True)

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