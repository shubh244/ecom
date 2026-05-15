# Windows: migrate Hostinger MySQL schema + copy data from Supabase.
# Prerequisites:
#   1. PHP with pdo_mysql and pdo_pgsql (php -m)
#   2. backend_new\.env: DB_* = Hostinger MySQL (enable Remote MySQL + your IP in hPanel)
#      OR DB_* = local MySQL for testing, then import backup.sql to Hostinger later
#   3. IMPORT_SOURCE_DB_URL = Supabase connection string in .env

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$api = Join-Path $root "backend_new"

if (-not (Test-Path (Join-Path $api "artisan"))) {
    Write-Error "backend_new not found at $api"
}

Push-Location $api

$envFile = Join-Path $api ".env"
if (-not (Test-Path $envFile)) {
    Write-Error "Missing .env — copy .env.example and set DB_* and IMPORT_SOURCE_DB_URL"
}

$content = Get-Content $envFile -Raw
if ($content -notmatch "IMPORT_SOURCE_DB_URL\s*=\s*postgres") {
    Write-Host ""
    Write-Host "Add your Supabase URI to .env:" -ForegroundColor Yellow
    Write-Host "  IMPORT_SOURCE_DB_URL=postgresql://postgres.[ref]:[PASSWORD]@aws-0-[region].pooler.supabase.com:5432/postgres?sslmode=require"
    Write-Host "  (Supabase Dashboard -> Project Settings -> Database -> Connection string)"
    Write-Host ""
    exit 1
}

Write-Host "==> config:clear" -ForegroundColor Cyan
php artisan config:clear

Write-Host "==> migrate (MySQL target)" -ForegroundColor Cyan
php artisan migrate --force

Write-Host "==> import from Supabase (--force truncates app tables on MySQL)" -ForegroundColor Cyan
php artisan db:import-from-supabase --force --no-interaction

Write-Host ""
Write-Host "Done. If you used local MySQL, export and import to Hostinger:" -ForegroundColor Green
Write-Host "  mysqldump -u root -p YOUR_DB > backup.sql"
Write-Host "  Then phpMyAdmin on Hostinger -> Import backup.sql"
Write-Host "Remove IMPORT_SOURCE_DB_* from .env when finished."

Pop-Location
