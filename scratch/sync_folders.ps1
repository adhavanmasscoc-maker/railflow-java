$rootDir = "d:\CS-ML-JAVA\JAVA\RailwaySystem"
$deployDir = Join-Path $rootDir "deploy"
$gitDir = Join-Path $rootDir "git"

Write-Host "=== SYNCHRONIZING TO DEPLOY AND GIT FOLDERS ==="

# Function to copy file if exists
function Sync-File($sourceRel, $targetFolder) {
    $src = Join-Path $rootDir $sourceRel
    if (Test-Path $src) {
        $dest = Join-Path $targetFolder $sourceRel
        $destDir = Split-Path $dest
        if (-not (Test-Path $destDir)) {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
        }
        Copy-Item -Path $src -Destination $dest -Force
        Write-Host "  [OK] Copied $sourceRel to $(Split-Path $targetFolder -Leaf)"
    }
}

# Function to copy folder recursively
function Sync-Folder($folderRel, $targetFolder, $excludePatterns = @()) {
    $src = Join-Path $rootDir $folderRel
    if (Test-Path $src) {
        $dest = Join-Path $targetFolder $folderRel
        if (-not (Test-Path $dest)) {
            New-Item -ItemType Directory -Path $dest -Force | Out-Null
        }
        Get-ChildItem -Path $src -Recurse | ForEach-Object {
            $relPath = $_.FullName.Substring($src.Length + 1)
            $destFile = Join-Path $dest $relPath
            
            $skip = $false
            foreach ($p in $excludePatterns) {
                if ($relPath -like $p -or $_.Name -like $p) {
                    $skip = $true
                    break
                }
            }
            
            if (-not $skip) {
                if ($_.PSIsContainer) {
                    if (-not (Test-Path $destFile)) {
                        New-Item -ItemType Directory -Path $destFile -Force | Out-Null
                    }
                } else {
                    $parentDir = Split-Path $destFile
                    if (-not (Test-Path $parentDir)) {
                        New-Item -ItemType Directory -Path $parentDir -Force | Out-Null
                    }
                    Copy-Item -Path $_.FullName -Destination $destFile -Force
                }
            }
        }
        Write-Host "  [OK] Synced folder $folderRel to $(Split-Path $targetFolder -Leaf)"
    }
}

# 1. Sync to deploy/
Write-Host "`n1. Copying assets to deploy/..."
Sync-File "index.html" $deployDir
Sync-File "README.md" $deployDir
Sync-File "pbl.md" $deployDir
Sync-File "pblv1.md" $deployDir
Sync-File "project_build_history.md" $deployDir
Sync-File "spec.md" $deployDir
Sync-Folder "frontend" $deployDir
Sync-Folder "css" $deployDir
Sync-Folder "js" $deployDir
Sync-Folder "docs" $deployDir
Sync-File "DATA\aliases.json" $deployDir
Sync-File "DATA\station_heritage.json" $deployDir
Sync-File "DATA\train_heritage.json" $deployDir

# 2. Sync to git/
Write-Host "`n2. Copying assets to git/..."
Sync-File "index.html" $gitDir
Sync-File "README.md" $gitDir
Sync-File "pbl.md" $gitDir
Sync-File "pblv1.md" $gitDir
Sync-File "project_build_history.md" $gitDir
Sync-File "spec.md" $gitDir
Sync-File "pom.xml" $gitDir
Sync-File ".gitignore" $gitDir
Sync-Folder "frontend" $gitDir
Sync-Folder "css" $gitDir
Sync-Folder "js" $gitDir
Sync-Folder "docs" $gitDir
Sync-Folder "src" $gitDir
Sync-Folder "scripts" $gitDir
Sync-File "DATA\aliases.json" $gitDir
Sync-File "DATA\station_heritage.json" $gitDir
Sync-File "DATA\train_heritage.json" $gitDir

Write-Host "`n=== SYNCHRONIZATION COMPLETE ==="
