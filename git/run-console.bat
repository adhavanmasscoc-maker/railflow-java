@echo off
title RailFlow Core Java Interactive Console
echo ============================================================
echo   RailFlow — Core Java Console Application Launcher
echo ============================================================
cd /d "%~dp0"

SET "JAVA_BIN="
SET "JAVAC_BIN="

where javac >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    SET "JAVA_BIN=java"
    SET "JAVAC_BIN=javac"
    goto :java_found
)

if defined JAVA_HOME (
    if exist "%JAVA_HOME%\bin\javac.exe" (
        SET "JAVA_BIN=%JAVA_HOME%\bin\java.exe"
        SET "JAVAC_BIN=%JAVA_HOME%\bin\javac.exe"
        goto :java_found
    )
)

for %%P in (
    "C:\Program Files\Java"
    "C:\Program Files\Eclipse Adoptium"
    "C:\Program Files\Microsoft"
    "C:\Program Files\Amazon Corretto"
    "C:\Program Files\Zulu"
    "C:\Program Files\Semeru"
    "C:\Program Files\BellSoft"
    "C:\Users\%USERNAME%\.jdks"
    "C:\Program Files (x86)\Java"
    "D:\Java"
    "D:\JDK"
    "C:\Java"
    "C:\JDK"
) do (
    if exist "%%~P" (
        for /d %%D in ("%%~P\*") do (
            if exist "%%~D\bin\javac.exe" (
                SET "JAVA_BIN=%%~D\bin\java.exe"
                SET "JAVAC_BIN=%%~D\bin\javac.exe"
                SET "JAVA_HOME=%%~D"
                goto :java_found
            )
        )
    )
)

:java_not_found
echo.
echo [!] Java Development Kit (JDK 17 or newer) was not found on your system.
echo Please install JDK 17+: https://adoptium.net/temurin/releases/
pause
exit /b 1

:java_found
echo Found JDK at: %JAVA_BIN%
set "PATH=%JAVA_HOME%\bin;%PATH%"

if not exist "bin" mkdir bin

echo Compiling Core Java source files...
(
    dir /s /b src\main\java\org\springframework\stereotype\*.java
    dir /s /b src\main\java\org\springframework\beans\factory\annotation\*.java
    dir /s /b src\main\java\jakarta\validation\constraints\*.java
    dir /s /b src\main\java\com\railflow\enums\*.java
    dir /s /b src\main\java\com\railflow\model\*.java
    dir /s /b src\main\java\com\railflow\collection\*.java
    dir /s /b src\main\java\com\railflow\algorithm\*.java
    dir /s /b src\main\java\com\railflow\repository\*.java
    dir /s /b src\main\java\com\railflow\dto\*.java
    echo %CD%\src\main\java\com\railflow\exception\PlatformNotFoundException.java
    echo %CD%\src\main\java\com\railflow\exception\TrainNotFoundException.java
    echo %CD%\src\main\java\com\railflow\exception\StationNotFoundException.java
    echo %CD%\src\main\java\com\railflow\exception\InvalidCrowdCountException.java
    echo %CD%\src\main\java\com\railflow\exception\InvalidPlatformCapacityException.java
    dir /s /b src\main\java\com\railflow\service\Platform*.java
    dir /s /b src\main\java\com\railflow\service\Train*.java
    dir /s /b src\main\java\com\railflow\service\Alert*.java
    dir /s /b src\main\java\com\railflow\service\Crowd*.java
    dir /s /b src\main\java\com\railflow\service\Recommendation*.java
    dir /s /b src\main\java\com\railflow\service\Station*.java
    echo %CD%\src\main\java\com\railflow\io\CsvReader.java
    echo %CD%\src\main\java\com\railflow\io\FileExporter.java
    echo %CD%\src\main\java\com\railflow\cli\RailFlowConsole.java
) > sources.txt

"%JAVAC_BIN%" -encoding UTF-8 -d bin @sources.txt
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Compilation failed.
    del sources.txt 2>nul
    pause
    exit /b %ERRORLEVEL%
)

del sources.txt 2>nul
echo Compilation successful!
echo.
echo ============================================================
echo   Starting RailFlow Core Console Application...
echo ============================================================
echo.
"%JAVA_BIN%" -cp bin com.railflow.cli.RailFlowConsole
pause
