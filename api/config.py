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

# 日记字段常量配置
# 心情选项
MOOD_CHOICES = ['快乐', '悲伤', '愤怒', '恐惧', '厌恶', '惊讶', '平常']
MOOD_DEFAULT = '平常'

# 天气选项
WEATHER_CHOICES = ['晴天', '雨天', '多云天', '雾天', '沙天', '尘天', '平常']
WEATHER_DEFAULT = '平常'

# 地点默认值
LOCATION_DEFAULT = ''

# 数据库连接 URL
DATABASE_URL = f'mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'