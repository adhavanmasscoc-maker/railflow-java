@echo off
title RailFlow Localhost Server
color 0A
echo.
echo ======================================================
echo    RailFlow - Fast Localhost Server Launcher
echo ======================================================
echo.

where node >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [OK] Node.js detected. Starting server with Node...
    node "%~dp0server.js"
    goto end
)

where py >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [OK] Python detected. Starting server with Python...
    py "%~dp0server.py"
    goto end
)

echo [!] Neither node nor py was found in PATH.
pause

:end
