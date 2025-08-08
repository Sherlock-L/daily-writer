from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import DEBUG
from models import create_tables
from routes import diary

# 创建 FastAPI 应用
app = FastAPI(debug=DEBUG)

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],  # 允许所有来源
    allow_credentials=True,
    allow_methods=['*'],  # 允许所有方法
    allow_headers=['*'],  # 允许所有头
)

# 创建数据库表
create_tables()

# 注册路由
app.include_router(diary.router, prefix='/api', tags=['diary'])

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=9898)