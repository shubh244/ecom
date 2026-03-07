# Script to remove steel database from MySQL

Write-Host "=== Remove Steel Database from MySQL ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if MySQL is running
Write-Host "Step 1: Make sure MySQL is STOPPED in XAMPP Control Panel" -ForegroundColor Yellow
Write-Host "   - Open XAMPP Control Panel" -ForegroundColor Gray
Write-Host "   - Click 'Stop' next to MySQL" -ForegroundColor Gray
Write-Host ""
Read-Host "Press Enter after MySQL is stopped"

# Step 2: Add skip-grant-tables to my.ini
Write-Host "`nStep 2: Adding skip-grant-tables to my.ini..." -ForegroundColor Cyan
$myIni = "C:\xampp\mysql\bin\my.ini"
$content = Get-Content $myIni -Raw

if ($content -notmatch "skip-grant-tables") {
    $content = $content -replace "(\[mysqld\])", "`$1`r`nskip-grant-tables"
    Set-Content -Path $myIni -Value $content -NoNewline
    Write-Host "✓ Added skip-grant-tables" -ForegroundColor Green
} else {
    Write-Host "✓ skip-grant-tables already exists" -ForegroundColor Green
}

# Step 3: Start MySQL
Write-Host "`nStep 3: Please START MySQL in XAMPP Control Panel" -ForegroundColor Yellow
Write-Host "   - Click 'Start' next to MySQL" -ForegroundColor Gray
Write-Host "   - Wait for it to start" -ForegroundColor Gray
Write-Host ""
Read-Host "Press Enter after MySQL has started"

# Step 4: Remove database
Write-Host "`nStep 4: Removing steel database..." -ForegroundColor Cyan
$env:Path += ";C:\xampp\php"

$sqlCommands = @"
DROP DATABASE IF EXISTS steel;
FLUSH PRIVILEGES;
EXIT;
"@

$sqlCommands | & "C:\xampp\mysql\bin\mysql.exe" -u root 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Database removed successfully" -ForegroundColor Green
} else {
    Write-Host "⚠ Could not remove database automatically" -ForegroundColor Yellow
    Write-Host "You can remove it manually via phpMyAdmin" -ForegroundColor Gray
}

# Step 5: Remove skip-grant-tables
Write-Host "`nStep 5: Removing skip-grant-tables from my.ini..." -ForegroundColor Cyan
Write-Host "Please STOP MySQL first, then I'll update the config" -ForegroundColor Yellow
Read-Host "Press Enter after MySQL is stopped"

$content = Get-Content $myIni -Raw
$content = $content -replace "skip-grant-tables`r?`n?", ""
Set-Content -Path $myIni -Value $content -NoNewline
Write-Host "✓ Removed skip-grant-tables" -ForegroundColor Green

# Step 6: Also remove or reduce recovery mode
$content = Get-Content $myIni -Raw
if ($content -match "innodb_force_recovery\s*=\s*6") {
    $content = $content -replace "innodb_force_recovery\s*=\s*6", "innodb_force_recovery = 0"
    Set-Content -Path $myIni -Value $content -NoNewline
    Write-Host "✓ Reduced recovery mode to 0" -ForegroundColor Green
}

Write-Host "`n=== Done! ===" -ForegroundColor Green
Write-Host "Now start MySQL normally from XAMPP Control Panel" -ForegroundColor Cyan
Write-Host "It should start without errors!" -ForegroundColor Green


