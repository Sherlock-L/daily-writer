@echo off
setlocal enabledelayedexpansion

:: Ports to kill
set ports=9898 50000
set success=0

title Port Killer
color 0A

echo [Port Killer] Checking ports %ports%...
echo.

for %%p in (%ports%) do (
    echo Processing port: %%p
    set found=0

    :: Find processes using PowerShell
    for /f "delims=" %%a in ('powershell -command "Get-NetTCPConnection -LocalPort %%p | Where-Object {$_.State -ne 'TimeWait'} | Select-Object OwningProcess | Format-Table -HideTableHeaders"') do (
        set "line=%%a"
        for /f "tokens=1" %%b in ("!line!") do (
            set pid=%%b
            set /a pid=!pid! 2>nul
            if !pid! gtr 0 (
                echo Found PID: !pid!
                set found=1
                
                :: Get process name
                for /f "delims=" %%n in ('powershell -command "(Get-Process -Id !pid! -ErrorAction SilentlyContinue).ProcessName"') do (
                    set procname=%%n
                    echo Process name: !procname!
                )
                
                :: Kill process
                echo Killing PID: !pid!...
                powershell -command "Stop-Process -Id !pid! -Force -ErrorAction SilentlyContinue" >nul
                if !errorlevel! equ 0 (
                    echo Successfully killed PID: !pid!
                    set /a success+=1
                ) else (
                    echo Failed to kill PID: !pid!
                )
                echo.
            )
        )
    )
    
    if !found! equ 0 (
        echo No active processes found on port %%p
        echo.
    )
)

echo -----------------------------------
if %success% gtr 0 (
    echo Operation completed. %success% processes terminated.
) else (
    echo No processes were terminated.
)
echo Closing in 3 seconds...

timeout /t 3 >nul
exit