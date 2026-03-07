# PowerShell script to help set up Composer with XAMPP

Write-Host "Checking PHP installation..." -ForegroundColor Cyan

# Add XAMPP PHP to PATH for this session
$env:Path += ";C:\xampp\php"

# Verify PHP
$phpVersion = php -v 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ PHP is available!" -ForegroundColor Green
    Write-Host $phpVersion -ForegroundColor Gray
} else {
    Write-Host "✗ PHP not found. Please check XAMPP installation." -ForegroundColor Red
    exit 1
}

Write-Host "`nChecking Composer..." -ForegroundColor Cyan

# Check if Composer is installed
$composerCheck = composer --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Composer is already installed!" -ForegroundColor Green
    Write-Host $composerCheck -ForegroundColor Gray
    Write-Host "`nYou can now run: composer install" -ForegroundColor Green
} else {
    Write-Host "✗ Composer is not installed." -ForegroundColor Yellow
    Write-Host "`nTo install Composer:" -ForegroundColor Cyan
    Write-Host "1. Download Composer-Setup.exe from: https://getcomposer.org/download/" -ForegroundColor White
    Write-Host "2. Run the installer" -ForegroundColor White
    Write-Host "3. When prompted for PHP executable, use: C:\xampp\php\php.exe" -ForegroundColor White
    Write-Host "4. After installation, close and reopen this terminal" -ForegroundColor White
    Write-Host "5. Then run this script again or run: composer install" -ForegroundColor White
}

Write-Host "`nTo make PHP available permanently:" -ForegroundColor Cyan
Write-Host "Add C:\xampp\php to your System PATH environment variable" -ForegroundColor White

