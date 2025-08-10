@echo off
title Daily Writer 开发环境启动器
color 0A

echo 正在启动 Daily Writer 开发环境...
echo ====================================

echo [1/4] 切换到项目目录: D:\daily-writer
cd /d D:\daily-writer
echo 当前目录: %cd%
echo.

echo [2/4] 激活 conda 环境: daily
call conda activate daily
echo 当前 conda 环境: %CONDA_DEFAULT_ENV%
echo.

echo [3/4] 启动 HTTP 服务器 (端口 10086)
start "HTTP Server" cmd /k python -m http.server 10086
echo HTTP 服务器已在后台启动
echo 访问地址: http://localhost:10086
echo.

echo [4/4] 启动 API 服务
cd /d D:\daily-writer\api
echo 已进入 API 目录: %cd%
python main.py
echo.

echo ====================================
echo 所有服务已启动完成!
pause