# Installing Composer on Windows

Composer is required to manage PHP dependencies for the Laravel backend.

## Option 1: Install Composer (Recommended)

### Step 1: Install PHP
1. Download PHP from https://windows.php.net/download/
2. Choose the latest PHP 8.1 or 8.2 Thread Safe version (ZIP)
3. Extract to `C:\php`
4. Add `C:\php` to your system PATH:
   - Right-click "This PC" → Properties
   - Advanced System Settings → Environment Variables
   - Edit "Path" under System Variables
   - Add `C:\php`
5. Verify: Open PowerShell and run `php -v`

### Step 2: Install Composer
1. Download Composer-Setup.exe from https://getcomposer.org/download/
2. Run the installer
3. It will detect PHP automatically
4. Complete the installation

### Step 3: Verify Installation
Open a new PowerShell/Command Prompt and run:
```bash
composer --version
php -v
```

## Option 2: Use XAMPP (Easier for Beginners)

XAMPP includes PHP and makes it easier to set up:

1. Download XAMPP from https://www.apachefriends.org/
2. Install XAMPP (includes PHP, MySQL, Apache)
3. After installation, download Composer-Setup.exe from https://getcomposer.org/download/
4. Run Composer installer (it will find PHP from XAMPP)
5. Verify: `composer --version`

## Option 3: Use Laravel Herd (Windows Alternative)

Laravel Herd is a native Windows application that includes PHP and Composer:
1. Download from https://herd.laravel.com/windows
2. Install Herd
3. Composer will be available automatically

## After Installing Composer

Once Composer is installed, you can proceed with:

```bash
cd backend
composer install
```

## Troubleshooting

If `composer` command still not found:
1. Close and reopen your terminal/PowerShell
2. Check if Composer is in PATH: `echo $env:Path` (PowerShell)
3. Restart your computer if needed

