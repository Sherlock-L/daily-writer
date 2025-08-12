@echo off
title Daily Writer dev env start
color 0A

echo starting Daily Writer ...
echo ====================================

echo [1/4] go to : D:\daily-writer
cd /d D:\daily-writer
echo current path: %cd%
echo.

echo [2/4] activate conda env: daily
call conda activate daily
echo current conda env: %CONDA_DEFAULT_ENV%
echo.

echo [3/4] start HTTP server (port 10086)
start "HTTP Server" cmd /k python -m http.server 10086
echo HTTP server started
echo url: http://localhost:10086
echo.

echo [4/4] start API server
cd /d D:\daily-writer\api
echo go to API dir: %cd%
python main.py
echo.

echo ====================================
echo all started !  http://localhost:10086
pause