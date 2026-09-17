@echo off
title RailFlow Dashboard Launcher
color 0A
echo.
echo  ========================================
echo   RailFlow - Railway Monitoring System
echo  ========================================
echo.

REM ─── Try to open in browser using multiple methods ───────────

echo  Opening dashboard in your default browser...
echo.

REM Method 1: start command
start "" "%~dp0frontend\index.html"

echo  Dashboard should now be open in your browser!
echo  (Works immediately in Demo Mode - no Java needed)
echo.
echo  ─────────────────────────────────────────────
echo.
echo  To also run the Java backend API:
echo.
echo  1. First install Maven from: https://maven.apache.org/download.cgi
echo     OR if you have Maven zip, extract to C:\maven
echo.
echo  2. Then run:
echo     set PATH=C:\maven\bin;%%PATH%%
echo     cd /d "%~dp0"
echo     mvn spring-boot:run
echo.
echo  ─────────────────────────────────────────────
echo.
pause
