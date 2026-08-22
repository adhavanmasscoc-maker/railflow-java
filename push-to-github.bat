@echo off
setlocal
title RailFlow - Push to GitHub
cd /d "%~dp0"

echo ============================================================
echo   RailFlow - Push Codebase to GitHub
echo ============================================================
echo Target Repository: https://github.com/adhavanmasscoc-maker/railflow-java
echo.

:: Initialize git if not already initialized
if not exist ".git" (
    echo Initializing git repository...
    git init
    git branch -M main
)

:: Set remote origin
git remote remove origin 2>nul
git remote add origin https://github.com/adhavanmasscoc-maker/railflow-java.git
echo Remote set to: https://github.com/adhavanmasscoc-maker/railflow-java.git
echo.

:: Stage all files
echo Staging files...
git add .

:: Commit
echo Committing changes...
git commit -m "feat: complete RailFlow Java-Core Web Application, DSA engine, and Vercel setup"

echo.
echo ============================================================
echo Pushing to GitHub (main branch)...
echo ============================================================
git push -u origin main --force

if %errorlevel% equ 0 (
    echo.
    echo ============================================================
    echo [SUCCESS] Codebase pushed successfully to:
    echo https://github.com/adhavanmasscoc-maker/railflow-java
    echo ============================================================
) else (
    echo.
    echo [NOTE] If prompted, please authenticate with your GitHub credentials or Personal Access Token (PAT).
)

echo.
pause
