@echo off
title daily-writer - dev env start
color 0A

:: 获取当前脚本所在目录（daily-writer根目录）
set "SCRIPT_DIR=%~dp0"
echo Script directory: %SCRIPT_DIR%
echo.

echo Starting daily-writer development environment...
echo ====================================

echo [1/4] go to: frontend
cd /d "%SCRIPT_DIR%front" || (echo Error: Failed to change directory to frontend & exit /b 1)
echo current path: %cd%
echo.

echo [2/4] activate conda env: daily
@REM call conda activate daily || (echo Error: Failed to activate conda env "daily" & exit /b 1)
call conda activate daily 
echo current conda env: %CONDA_DEFAULT_ENV%
echo.

echo [3/4] start HTTP server (port 50000)
start /B "daily-writer - HTTP Server" cmd /c python -m http.server 50000 || (echo Error: Failed to start HTTP server & exit /b 1)
echo HTTP server started
echo url: http://localhost:50000
echo.

echo [4/4] start API server
cd /d "%SCRIPT_DIR%api" || (echo Error: Failed to change directory to API & exit /b 1)
echo go to API dir: %cd%
start /B "daily-writer - API Server" cmd /c python main.py || (echo Error: Failed to start API server & exit /b 1)
echo.

echo ====================================
echo All services started!  http://localhost:50000

rem 隐藏窗口并保持运行
if not "%1"=="hidden" (start /B cmd /c %0 hidden & exit)