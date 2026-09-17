# ════════════════════════════════════════════════════════════════
# RailFlow - Auto Setup & Launch Script
# Run this as: .\setup-and-run.ps1
# ════════════════════════════════════════════════════════════════

$ErrorActionPreference = "Continue"
$ProjectDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host ""
Write-Host "  ╔══════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "  ║  RailFlow - Smart Railway Monitoring System  ║" -ForegroundColor Cyan
Write-Host "  ║  Auto-Setup & Launcher                       ║" -ForegroundColor Cyan
Write-Host "  ╚══════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# ─── STEP 1: Open Dashboard in Browser (works immediately, no Java needed) ──
Write-Host "  [1/4] Opening Dashboard in browser (Demo Mode)..." -ForegroundColor Green
$htmlPath = Join-Path $ProjectDir "frontend\index.html"
if (Test-Path $htmlPath) {
    Start-Process $htmlPath
    Write-Host "        ✓ Dashboard opened! It runs in Demo Mode automatically." -ForegroundColor Green
} else {
    Write-Host "        ✗ frontend\index.html not found." -ForegroundColor Red
}

Write-Host ""

# ─── STEP 2: Check Java ──────────────────────────────────────────────────────
Write-Host "  [2/4] Checking Java..." -ForegroundColor Yellow
try {
    $javaVersion = & java -version 2>&1
    Write-Host "        ✓ Java found: $($javaVersion[0])" -ForegroundColor Green
    $javaOk = $true
} catch {
    Write-Host "        ✗ Java not found." -ForegroundColor Red
    Write-Host "          Download from: https://www.oracle.com/java/technologies/downloads/#java17" -ForegroundColor Gray
    $javaOk = $false
}

Write-Host ""

# ─── STEP 3: Check / Install Maven ───────────────────────────────────────────
Write-Host "  [3/4] Checking Maven..." -ForegroundColor Yellow

$mvnCmd = $null

# Check if mvn is in PATH
try {
    $mvnVersion = & mvn -version 2>&1
    if ($LASTEXITCODE -eq 0 -or $mvnVersion -match "Apache Maven") {
        Write-Host "        ✓ Maven found in PATH." -ForegroundColor Green
        $mvnCmd = "mvn"
    }
} catch { }

# Check common Maven locations
if (-not $mvnCmd) {
    $mvnLocations = @(
        "C:\maven\bin\mvn.cmd",
        "C:\Program Files\Maven\bin\mvn.cmd",
        "C:\apache-maven\bin\mvn.cmd",
        "$env:USERPROFILE\maven\bin\mvn.cmd",
        "C:\tools\maven\bin\mvn.cmd"
    )
    foreach ($loc in $mvnLocations) {
        if (Test-Path $loc) {
            Write-Host "        ✓ Maven found at: $loc" -ForegroundColor Green
            $mvnCmd = $loc
            break
        }
    }
}

# Download Maven if not found
if (-not $mvnCmd) {
    Write-Host "        Maven not found. Downloading Maven 3.9.6..." -ForegroundColor Yellow
    $mavenVersion = "3.9.6"
    $mavenUrl = "https://dlcdn.apache.org/maven/maven-3/$mavenVersion/binaries/apache-maven-$mavenVersion-bin.zip"
    $mavenZip = "$env:TEMP\apache-maven-$mavenVersion-bin.zip"
    $mavenDir = "C:\maven-auto"

    try {
        Write-Host "        Downloading from Apache CDN..." -ForegroundColor Gray
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        Invoke-WebRequest -Uri $mavenUrl -OutFile $mavenZip -UseBasicParsing
        
        Write-Host "        Extracting..." -ForegroundColor Gray
        Expand-Archive -Path $mavenZip -DestinationPath $mavenDir -Force
        
        $extractedDir = (Get-ChildItem $mavenDir -Directory | Select-Object -First 1).FullName
        $mvnCmd = Join-Path $extractedDir "bin\mvn.cmd"
        
        if (Test-Path $mvnCmd) {
            Write-Host "        ✓ Maven installed to: $extractedDir" -ForegroundColor Green
            Write-Host "        Tip: Add $extractedDir\bin to your system PATH permanently." -ForegroundColor Gray
        } else {
            Write-Host "        ✗ Maven extraction failed." -ForegroundColor Red
            $mvnCmd = $null
        }
    } catch {
        Write-Host "        ✗ Could not download Maven: $_" -ForegroundColor Red
        Write-Host "          Manual install: https://maven.apache.org/download.cgi" -ForegroundColor Gray
        $mvnCmd = $null
    }
}

Write-Host ""

# ─── STEP 4: Run Spring Boot API ─────────────────────────────────────────────
Write-Host "  [4/4] Starting Spring Boot API..." -ForegroundColor Yellow

if ($javaOk -and $mvnCmd) {
    Write-Host "        Running: $mvnCmd spring-boot:run" -ForegroundColor Gray
    Write-Host "        API will be available at: http://localhost:8080" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  ─────────────────────────────────────────────────" -ForegroundColor DarkGray
    Write-Host "  Press Ctrl+C to stop the API server" -ForegroundColor DarkGray
    Write-Host "  ─────────────────────────────────────────────────" -ForegroundColor DarkGray
    Write-Host ""
    Set-Location $ProjectDir
    & $mvnCmd "spring-boot:run"
} elseif (-not $javaOk) {
    Write-Host "        ✗ Cannot start API - Java not installed." -ForegroundColor Red
    Write-Host "          The Dashboard still works in Demo Mode (already opened above)." -ForegroundColor Yellow
} else {
    Write-Host "        ✗ Cannot start API - Maven not available." -ForegroundColor Red
    Write-Host "          The Dashboard still works in Demo Mode (already opened above)." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "  Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
