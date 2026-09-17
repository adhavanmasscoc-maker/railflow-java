@echo off
setlocal
title RailFlow - Deploy to Vercel
cd /d "%~dp0"

echo ============================================================
echo   RailFlow - Production Vercel Deployment
echo ============================================================
echo Current Directory: %CD%
echo.

:: Deploy with outputDirectory: frontend
echo Starting Vercel Production Deploy...
vercel --prod --yes

echo.
echo ============================================================
echo Deployment Complete! Check your live URL above.
echo ============================================================
pause
