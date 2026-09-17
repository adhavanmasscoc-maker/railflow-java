@echo off
title RailFlow Core Java Interactive Console (CLI)
echo ============================================================
echo   Launching RailFlow Core Java Console Application...
echo ============================================================
cd /d "%~dp0.."

WHERE mvn >nul 2>&1
IF ERRORLEVEL 1 (
    echo System Maven not found in PATH. Using mvnw wrapper...
    call mvnw.cmd compile exec:java -Dexec.mainClass="com.railflow.cli.RailFlowConsole"
) ELSE (
    mvn compile exec:java -Dexec.mainClass="com.railflow.cli.RailFlowConsole"
)
pause
