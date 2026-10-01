@echo off
title RailFlow - Low-Resource Java Runtime (< 80MB RAM)
color 0B

echo.
echo ==============================================================
echo    RailFlow - Optimized Low-Resource Java Runtime Engine
echo    Target Footprint: Sub-80MB RAM (Serial GC, 256k Stacks)
echo ==============================================================
echo.

SET PROJECT_DIR=%~dp0
SET JVM_OPTS=-XX:+UseSerialGC -Xss256k -Xms32m -Xmx96m

echo [1] Checking for compiled JAR in target/ ...
if exist "%PROJECT_DIR%target\railflow-backend.jar" (
    echo [OK] Running optimized standalone JAR...
    java %JVM_OPTS% -jar "%PROJECT_DIR%target\railflow-backend.jar"
    goto end
)

if exist "%PROJECT_DIR%target\RailwaySystem-1.0.0.jar" (
    echo [OK] Running optimized standalone JAR...
    java %JVM_OPTS% -jar "%PROJECT_DIR%target\RailwaySystem-1.0.0.jar"
    goto end
)

echo [2] Launching via Maven Wrapper with low-memory JVM args...
WHERE mvn >nul 2>&1
IF ERRORLEVEL 1 (
    call "%PROJECT_DIR%mvnw.cmd" spring-boot:run -Dspring-boot.run.jvmArguments="%JVM_OPTS%"
) ELSE (
    mvn spring-boot:run -Dspring-boot.run.jvmArguments="%JVM_OPTS%"
)

:end
pause
