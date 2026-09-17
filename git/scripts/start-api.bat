@echo off
title RailFlow Spring Boot Backend Server
echo ============================================================
echo   Starting RailFlow REST API Server (Port 8080)...
echo ============================================================
cd /d "%~dp0.."

WHERE mvn >nul 2>&1
IF ERRORLEVEL 1 (
    echo System Maven not found in PATH. Using mvnw wrapper...
    call mvnw.cmd spring-boot:run
) ELSE (
    mvn spring-boot:run
)
pause
