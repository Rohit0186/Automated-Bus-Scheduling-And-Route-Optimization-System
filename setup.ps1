# Rail Madad / Smart Bus System Setup Script

Write-Host "------------------------------------------------" -ForegroundColor Cyan
Write-Host "Initializing Rail Madad / Smart Bus System Setup" -ForegroundColor Cyan
Write-Host "------------------------------------------------" -ForegroundColor Cyan

# Check for Node.js
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = node -v
    Write-Host "[✓] Node.js Found: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "[X] Node.js is missing. Please install Node.js 18+." -ForegroundColor Red
    exit
}

# Check for Java
if (Get-Command java -ErrorAction SilentlyContinue) {
    $javaVersion = java -version 2>&1 | Select-Object -First 1
    Write-Host "[✓] Java Found: $javaVersion" -ForegroundColor Green
} else {
    Write-Host "[X] Java is missing. Please install Java 17+." -ForegroundColor Red
    exit
}

# 1. Install Frontend Dependencies
Write-Host "`n[1/2] Installing Frontend Dependencies..." -ForegroundColor Yellow
cd frontend
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "[✓] Frontend Dependencies Installed Successfully." -ForegroundColor Green
} else {
    Write-Host "[X] Error installing frontend dependencies." -ForegroundColor Red
}
cd ..

# 2. Build Backend
Write-Host "`n[2/2] Verifying Backend (Maven)..." -ForegroundColor Yellow
cd backend

$mvnPath = "mvn"
if (!(Get-Command mvn -ErrorAction SilentlyContinue)) {
    # Fallback to IntelliJ Maven if existing
    $intellijMvn = "C:\Program Files\JetBrains\IntelliJ IDEA 2026.1\plugins\maven\lib\maven3\bin\mvn.cmd"
    if (Test-Path $intellijMvn) {
        $mvnPath = "& '$intellijMvn'"
        Write-Host "[!] Using IntelliJ Maven fallback." -ForegroundColor Yellow
    } else {
        Write-Host "[X] Maven not found. Attempting mvnw..." -ForegroundColor Gray
        $mvnPath = "./mvnw"
    }
}

Invoke-Expression "$mvnPath clean compile"

if ($LASTEXITCODE -eq 0) {
    Write-Host "[✓] Backend Build Verified." -ForegroundColor Green
} else {
    Write-Host "[!] Backend build had warnings or errors. Attempting to proceed..." -ForegroundColor Yellow
}
cd ..

Write-Host "`n------------------------------------------------" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Cyan
Write-Host "You can now start the project using: ./run-project.ps1" -ForegroundColor Cyan
Write-Host "------------------------------------------------" -ForegroundColor Cyan

Write-Host "`n------------------------------------------------" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Cyan
Write-Host "You can now start the project using: ./run-project.ps1" -ForegroundColor Cyan
Write-Host "------------------------------------------------" -ForegroundColor Cyan
