@echo off
title RailFlow - Smart Railway Monitoring System
color 0B

echo.
echo  ==============================================================
echo     RailFlow - Smart Railway Crowd Monitoring System
echo  ==============================================================
echo.

SET PROJECT_DIR=%~dp0
SET FRONTEND=%PROJECT_DIR%frontend\index.html

echo  [1] Opening Dashboard in browser...
start "" "%FRONTEND%"
echo      Dashboard opened!
echo.

echo  [2] Starting Backend Services...
java -version >nul 2>&1
IF ERRORLEVEL 1 (
    echo  [!] Java not found on PATH. Please ensure Java 17+ is installed.
    echo      The dashboard will run in static mode.
    pause
    exit /b 1
)

WHERE mvn >nul 2>&1
IF ERRORLEVEL 1 (
    echo  Maven not in PATH. Using portable mvnw wrapper...
    call "%PROJECT_DIR%mvnw.cmd" spring-boot:run
) ELSE (
    mvn spring-boot:run
)

pause
