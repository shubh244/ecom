# Fix MySQL - Remove Corrupted Database References

Write-Host "Fixing MySQL corrupted database issue..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Stop MySQL
Write-Host "Step 1: Please STOP MySQL in XAMPP Control Panel" -ForegroundColor Yellow
Write-Host "   - Open XAMPP Control Panel" -ForegroundColor Gray
Write-Host "   - Click 'Stop' next to MySQL" -ForegroundColor Gray
Write-Host ""
Read-Host "Press Enter after you've stopped MySQL"

# Step 2: Check for steel database
$steelPath = "C:\xampp\mysql\data\steel"
if (Test-Path $steelPath) {
    Write-Host "Found 'steel' database folder" -ForegroundColor Yellow
    Write-Host "Renaming to 'steel_backup'..." -ForegroundColor Cyan
    Rename-Item -Path $steelPath -NewName "steel_backup_$(Get-Date -Format 'yyyyMMdd')" -ErrorAction SilentlyContinue
    Write-Host "✓ Renamed successfully" -ForegroundColor Green
} else {
    Write-Host "✓ No 'steel' folder found (already removed or doesn't exist)" -ForegroundColor Green
}

# Step 3: Check MySQL data directory
Write-Host "`nChecking MySQL data directory..." -ForegroundColor Cyan
$dataPath = "C:\xampp\mysql\data"
if (Test-Path $dataPath) {
    Write-Host "✓ MySQL data directory exists: $dataPath" -ForegroundColor Green
    
    # List databases
    $databases = Get-ChildItem -Path $dataPath -Directory | Where-Object { $_.Name -notlike "*mysql*" -and $_.Name -notlike "*performance_schema*" -and $_.Name -notlike "*phpmyadmin*" -and $_.Name -notlike "*test*" }
    if ($databases) {
        Write-Host "`nFound databases:" -ForegroundColor Cyan
        $databases | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor Gray }
    }
} else {
    Write-Host "✗ MySQL data directory not found!" -ForegroundColor Red
}

# Step 4: Instructions
Write-Host "`n" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Start MySQL in XAMPP Control Panel" -ForegroundColor White
Write-Host "2. If errors persist, we'll need to remove database from MySQL system tables" -ForegroundColor White
Write-Host "3. Open phpMyAdmin: http://localhost/phpmyadmin" -ForegroundColor White
Write-Host "4. Create database: woodstate_db" -ForegroundColor White

Write-Host "`nPress any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")


