@REM Maven wrapper for Windows - downloads Maven automatically if needed
@ECHO OFF
SETLOCAL ENABLEEXTENSIONS

REM ─── Auto-locate JDK if JAVA_HOME or java is not in PATH ───
IF NOT DEFINED JAVA_HOME (
    FOR %%P IN (
        "C:\Program Files\Java"
        "C:\Program Files\Eclipse Adoptium"
        "C:\Program Files\Microsoft"
        "C:\Program Files\Amazon Corretto"
        "C:\Program Files\Zulu"
        "C:\Users\%USERNAME%\.jdks"
    ) DO (
        IF EXIST "%%~P" (
            FOR /D %%D IN ("%%~P\*") DO (
                IF EXIST "%%~D\bin\java.exe" (
                    SET "JAVA_HOME=%%~D"
                    GOTO :jdk_set
                )
            )
        )
    )
)
:jdk_set
IF DEFINED JAVA_HOME (
    SET "PATH=%JAVA_HOME%\bin;%PATH%"
)

SET MAVEN_VERSION=3.9.6
SET MAVEN_HOME=%USERPROFILE%\.m2\wrapper\dists\apache-maven-%MAVEN_VERSION%
SET MVN_BIN=%MAVEN_HOME%\bin\mvn.cmd

WHERE mvn >nul 2>&1
IF NOT ERRORLEVEL 1 (
    mvn %*
    EXIT /B %ERRORLEVEL%
)

IF NOT EXIST "%MVN_BIN%" (
    ECHO System Maven not found in PATH. Downloading portable Apache Maven %MAVEN_VERSION%...
    SET MAVEN_ZIP=%TEMP%\apache-maven-%MAVEN_VERSION%-bin.zip
    
    SET PS_EXE=%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe
    IF NOT EXIST "%PS_EXE%" (
        SET PS_EXE=%WINDIR%\System32\WindowsPowerShell\v1.0\powershell.exe
    )
    IF NOT EXIST "%PS_EXE%" (
        SET PS_EXE=powershell.exe
    )

    "%PS_EXE%" -NoProfile -Command ^
        "[Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12;" ^
        "Invoke-WebRequest 'https://archive.apache.org/dist/maven/maven-3/%MAVEN_VERSION%/binaries/apache-maven-%MAVEN_VERSION%-bin.zip' -OutFile '%MAVEN_ZIP%' -UseBasicParsing;" ^
        "Expand-Archive '%MAVEN_ZIP%' -DestinationPath '%USERPROFILE%\.m2\wrapper\dists' -Force"

    IF EXIST "%MVN_BIN%" (
        ECHO Maven downloaded and configured successfully.
    ) ELSE (
        ECHO Download attempt 1 failed. Trying curl fallback...
        curl.exe -L "https://archive.apache.org/dist/maven/maven-3/%MAVEN_VERSION%/binaries/apache-maven-%MAVEN_VERSION%-bin.zip" -o "%MAVEN_ZIP%"
        tar.exe -xf "%MAVEN_ZIP%" -C "%USERPROFILE%\.m2\wrapper\dists"
        
        IF NOT EXIST "%MVN_BIN%" (
            ECHO Download failed. Please check internet connection.
            PAUSE
            EXIT /B 1
        )
    )
)

CALL "%MVN_BIN%" %*
