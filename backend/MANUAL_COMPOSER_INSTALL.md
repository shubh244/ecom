# Manual Composer Installation (Alternative Method)

If the Composer installer still doesn't work, use this manual method:

## Step 1: Download composer.phar

1. Open PowerShell
2. Run this command:

```powershell
$env:Path += ";C:\xampp\php"
cd C:\xampp\php
Invoke-WebRequest -Uri "https://getcomposer.org/download/latest-stable/composer.phar" -OutFile "composer.phar"
```

Or manually:
- Go to: https://getcomposer.org/download/latest-stable/composer.phar
- Save it to: `C:\xampp\php\composer.phar`

## Step 2: Create composer.bat

Create a file `C:\xampp\php\composer.bat` with this content:

```batch
@echo off
php "%~dp0composer.phar" %*
```

Or use PowerShell:

```powershell
@"
@echo off
php "%~dp0composer.phar" %*
"@ | Out-File -FilePath "C:\xampp\php\composer.bat" -Encoding ASCII
```

## Step 3: Test Composer

```powershell
$env:Path += ";C:\xampp\php"
composer --version
```

## Step 4: Install Laravel Dependencies

```powershell
cd C:\Users\hp\Desktop\furniture\backend
$env:Path += ";C:\xampp\php"
composer install
```

## Benefits of Manual Installation

- No installer needed
- Works even with SSL issues
- Easy to update (just replace composer.phar)
- Full control over installation

