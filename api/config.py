# 数据库配置
DB_HOST = 'localhost'
DB_PORT = 3306
DB_USER = 'root'
DB_PASSWORD = 'root'
DB_NAME = 'diary_db'

# 应用配置
SECRET_KEY = 'your_secret_key'
DEBUG = True

# 分页配置
PER_PAGE = 10

# 数据库连接 URL
DATABASE_URL = f'mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'