# Install Composer Now - Step by Step

## Current Status
✅ XAMPP is running
✅ PHP is available at `C:\xampp\php\php.exe`
❌ Composer needs to be installed

## Quick Installation Steps

### Step 1: Download Composer
1. Open your browser
2. Go to: **https://getcomposer.org/download/**
3. Click on **"Composer-Setup.exe"** (Windows Installer)
4. Save and run the downloaded file

### Step 2: Install Composer
1. Run `Composer-Setup.exe`
2. When it asks for **"Command-line PHP"**, click **"Browse"**
3. Navigate to: `C:\xampp\php\php.exe`
4. Select it and click **"Next"**
5. Complete the installation (use default settings)
6. Click **"Finish"**

### Step 3: Verify Installation
1. **Close your current PowerShell/Command Prompt**
2. **Open a NEW PowerShell window**
3. Run these commands:

```powershell
# Add PHP to PATH for this session
$env:Path += ";C:\xampp\php"

# Check Composer
composer --version
```

You should see Composer version information.

### Step 4: Install Laravel Dependencies
Once Composer is installed, run:

```powershell
cd C:\Users\hp\Desktop\furniture\backend
$env:Path += ";C:\xampp\php"
composer install
```

## Alternative: Manual Composer Installation

If the installer doesn't work, you can install Composer manually:

1. Download `composer.phar` from: https://getcomposer.org/composer-stable.phar
2. Save it to: `C:\xampp\php\composer.phar`
3. Create a file `C:\xampp\php\composer.bat` with this content:
```batch
@echo off
php "%~dp0composer.phar" %*
```

4. Add `C:\xampp\php` to your PATH (permanently)

## After Installation

Once Composer is installed, continue with:

```powershell
cd C:\Users\hp\Desktop\furniture\backend
$env:Path += ";C:\xampp\php"

# Install dependencies
composer install

# Copy environment file
copy .env.example .env

# Generate key
php artisan key:generate

# Configure database in .env (edit the file)
# DB_DATABASE=woodstate_db
# DB_USERNAME=root
# DB_PASSWORD=

# Run migrations
php artisan migrate

# Seed database
php artisan db:seed

# Start server
php artisan serve
```

## Need Help?

If you encounter any issues:
1. Make sure XAMPP MySQL is running
2. Create database `woodstate_db` in phpMyAdmin
3. Check that PHP is accessible: `C:\xampp\php\php.exe -v`

