# Rail Madad / Smart Bus System Runner

Write-Host "Starting Rail Madad / Smart Bus System..." -ForegroundColor Green

# Determine Maven Path
$mvnPath = "mvn"
if (!(Get-Command mvn -ErrorAction SilentlyContinue)) {
    $intellijMvn = "C:\Program Files\JetBrains\IntelliJ IDEA 2026.1\plugins\maven\lib\maven3\bin\mvn.cmd"
    if (Test-Path $intellijMvn) {
        $mvnPath = "& '$intellijMvn'"
    } else {
        $mvnPath = "./mvnw"
    }
}

# Start Backend
Write-Host "Launching Backend (Port 8081)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; $mvnPath spring-boot:run"

# Start Frontend
Write-Host "Launching Frontend (Port 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm start"

Write-Host "`nProject is booting up!" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Gray
Write-Host "Backend: http://localhost:8081" -ForegroundColor Gray
Write-Host "------------------------------------------------" -ForegroundColor Cyan
