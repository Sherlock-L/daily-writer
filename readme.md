# 1. 项目介绍
这是一个复古风的日记web项目，本地化部署，不上传云端

![项目效果图](demo.png)
![项目效果图](overview.png)
![项目效果图](list.png)
![项目效果图](detail.png)
[![Chinese](https://img.shields.io/badge/中文-README-green.svg)](README.md) [![English](https://img.shields.io/badge/English-README-blue.svg)](README_EN.md)

# 2. 项目依赖
- python ，推荐python 11
- Mysql Server

# 3. 项目安装
1. 克隆项目 : git clone https://github.com/Sherlock-L/daily-writer.git

2. 安装依赖  
- 可选：如果有conda环境，建议创建一个新环境，python版本3.11。 conda create -n daily python=3.11
- 可选：进入环境：conda activate daily
- cd api  ，  pip install -r requirements.txt

3.创建库表
从init.sql导入sql执行。
- 数据库：mysql
- 库名：diary_db
- 表名：diary



4. 配置数据库  config.py
```
DB_USER = 'mysql用户'
DB_PASSWORD = 'mysql密码'
DB_NAME = 'diary_db'
```
5. 运行项目
- win11: start.bat
- linux:  
 1. 前端：cd   front && python -m http.server 10086  
 2. 后端：cd   api && python main.py



