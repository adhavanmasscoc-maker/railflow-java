@echo off
setlocal
title RailFlow - Deploy to aknex-railflow
cd /d "%~dp0"

echo ============================================================
echo   Linking and Deploying to aknex-railflow on Vercel
echo ============================================================
echo.

:: Relink to aknex-railflow
echo Linking project to aknex-railflow...
vercel link --project aknex-railflow --yes

:: Deploy to production
echo.
echo Deploying to Production (aknex-railflow.vercel.app)...
vercel --prod --yes

echo.
echo ============================================================
echo [SUCCESS] Deployed to https://aknex-railflow.vercel.app
echo ============================================================
echo.
pause
