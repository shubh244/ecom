# Sync monorepo storefront -> github.com/shubh244/ecom-storefront (main) for Hostinger Git deploy.
# Run from repo root: powershell -ExecutionPolicy Bypass -File scripts/push-ecom-storefront.ps1

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$src = Join-Path (Split-Path $root -Parent) 'shreejee-storefront'
$sync = Join-Path (Split-Path $root -Parent) 'ecom-storefront-sync'

& (Join-Path $root 'scripts\split-two-repos.ps1') | Out-Null

if (Test-Path $sync) { Remove-Item -Recurse -Force $sync }
git clone https://github.com/shubh244/ecom-storefront.git $sync
robocopy $src $sync /E /XD .git node_modules .next /NFL /NDL /NJH /NJS | Out-Null
if ($LASTEXITCODE -ge 8) { throw "robocopy failed: $LASTEXITCODE" }

Push-Location $sync
git add -A
$msg = "Sync storefront from monorepo $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
git commit -m $msg 2>$null
if ($LASTEXITCODE -ne 0) { Write-Host 'No changes to commit.' }
git push origin main
Pop-Location
Write-Host "Pushed to https://github.com/shubh244/ecom-storefront (main)"
