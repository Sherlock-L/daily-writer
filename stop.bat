@echo off
title daily-writer - stop services
color 0C

echo Stopping daily-writer services...
echo ====================================

echo [1/2] Killing HTTP Server (port 50000)...
taskkill /FI "WINDOWTITLE eq daily-writer - HTTP Server*" /F >nul 2>&1
if %errorlevel% equ 0 (echo HTTP Server stopped.) else (echo HTTP Server not running.)

echo [2/2] Killing API Server...
taskkill /FI "WINDOWTITLE eq daily-writer - API Server*" /F >nul 2>&1
if %errorlevel% equ 0 (echo API Server stopped.) else (echo API Server not running.)

echo ====================================
echo All daily-writer services stopped.
timeout /t 3 >nul
exit