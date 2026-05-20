# Sync monorepo storefront -> github.com/shubh244/ecom-storefront (main) for Hostinger Git deploy.
# Run from repo root: powershell -ExecutionPolicy Bypass -File scripts/push-ecom-storefront.ps1

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$src = Join-Path (Split-Path $root -Parent) 'shreejee-storefront'
$parent = Split-Path $root -Parent
$sync = Join-Path $parent 'ecom-storefront-sync'
# If sync folder is locked (IDE/terminal), use a timestamped clone instead.
if (Test-Path $sync) {
  try { Remove-Item -Recurse -Force $sync -ErrorAction Stop }
  catch { $sync = Join-Path $parent ("ecom-storefront-sync-" + (Get-Date -Format 'yyyyMMddHHmmss')) }
}

& (Join-Path $root 'scripts\split-two-repos.ps1') | Out-Null

if (-not (Test-Path (Join-Path $sync '.git'))) {
  git clone https://github.com/shubh244/ecom-storefront.git $sync
}
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
