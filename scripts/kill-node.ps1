# Script to kill Hardhat node process on port 8545

Write-Host "Checking for processes using port 8545..." -ForegroundColor Yellow

# Find process using port 8545
$connection = Get-NetTCPConnection -LocalPort 8545 -ErrorAction SilentlyContinue

if ($connection) {
    $processId = $connection.OwningProcess
    $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
    
    if ($process) {
        Write-Host "Found process: $($process.ProcessName) (PID: $processId)" -ForegroundColor Red
        Write-Host "Killing process..." -ForegroundColor Yellow
        
        Stop-Process -Id $processId -Force
        Start-Sleep -Seconds 2
        
        Write-Host "Process killed successfully!" -ForegroundColor Green
    } else {
        Write-Host "Process not found, but port is in use." -ForegroundColor Yellow
    }
} else {
    Write-Host "Port 8545 is not in use." -ForegroundColor Green
}

Write-Host "`nYou can now run: npm run node" -ForegroundColor Cyan
