# PowerShell script to start MySQL in XAMPP

Write-Host "Checking XAMPP MySQL..." -ForegroundColor Cyan

$mysqlPath = "C:\xampp\mysql\bin\mysqld.exe"
$mysqlDataPath = "C:\xampp\mysql\data"

if (Test-Path $mysqlPath) {
    Write-Host "✓ Found MySQL at: $mysqlPath" -ForegroundColor Green
    
    # Check if MySQL is already running
    $mysqlProcess = Get-Process | Where-Object {$_.ProcessName -eq "mysqld"}
    
    if ($mysqlProcess) {
        Write-Host "✓ MySQL is already running (PID: $($mysqlProcess.Id))" -ForegroundColor Green
    } else {
        Write-Host "Starting MySQL..." -ForegroundColor Yellow
        
        # Start MySQL
        Start-Process -FilePath $mysqlPath -ArgumentList "--defaults-file=C:\xampp\mysql\bin\my.ini" -WindowStyle Hidden
        
        Start-Sleep -Seconds 3
        
        # Check if it started
        $mysqlProcess = Get-Process | Where-Object {$_.ProcessName -eq "mysqld"}
        if ($mysqlProcess) {
            Write-Host "✓ MySQL started successfully (PID: $($mysqlProcess.Id))" -ForegroundColor Green
            Write-Host "`nYou can now:" -ForegroundColor Cyan
            Write-Host "1. Open phpMyAdmin: http://localhost/phpmyadmin" -ForegroundColor White
            Write-Host "2. Create database: woodstate_db" -ForegroundColor White
        } else {
            Write-Host "✗ Failed to start MySQL" -ForegroundColor Red
            Write-Host "Try starting it from XAMPP Control Panel instead" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "✗ MySQL not found at: $mysqlPath" -ForegroundColor Red
    Write-Host "Please check your XAMPP installation path" -ForegroundColor Yellow
}

Write-Host "`nPress any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")


