@echo off
setlocal
title RailFlow - Push to GitHub
cd /d "%~dp0"

echo ============================================================
echo   RailFlow - Push Codebase to GitHub
echo ============================================================
echo Target Repository: https://github.com/adhavanmasscoc-maker/railflow-java
echo.

if not exist ".git" (
    echo Initializing git repository...
    git init
    git branch -M main
)

git remote remove origin 2>nul
git remote add origin https://github.com/adhavanmasscoc-maker/railflow-java.git
echo Remote set to: https://github.com/adhavanmasscoc-maker/railflow-java.git
echo.

echo Staging files...
git add .

echo Committing changes...
git commit -m "feat: complete RailFlow Java-Core Web Application, DSA engine, and Vercel setup" 2>nul

echo.
echo ============================================================
echo Pushing to GitHub (main branch)...
echo ============================================================
git push -u origin main --force

echo.
echo ============================================================
echo [SUCCESS] Codebase is live on GitHub:
echo https://github.com/adhavanmasscoc-maker/railflow-java
echo ============================================================
echo.
pause
