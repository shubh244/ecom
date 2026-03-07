# Quick Setup with XAMPP

Since you have XAMPP running, follow these steps:

## Step 1: Verify PHP is Available

Open PowerShell or Command Prompt and run:
```bash
php -v
```

If PHP is not found, add XAMPP PHP to your PATH:
- XAMPP PHP is usually at: `C:\xampp\php`
- Add this to your system PATH (see instructions below)

## Step 2: Install Composer

1. Download Composer-Setup.exe from: https://getcomposer.org/download/
2. Run the installer
3. When prompted for PHP executable, point it to: `C:\xampp\php\php.exe`
4. Complete the installation

## Step 3: Verify Installation

Open a NEW PowerShell/Command Prompt window and run:
```bash
composer --version
php -v
```

Both commands should work.

## Step 4: Continue with Backend Setup

Once Composer is installed:
```bash
cd C:\Users\hp\Desktop\furniture\backend
composer install
```

## Adding XAMPP PHP to PATH (if needed)

1. Press `Win + X` and select "System"
2. Click "Advanced system settings"
3. Click "Environment Variables"
4. Under "System variables", find and select "Path", then click "Edit"
5. Click "New" and add: `C:\xampp\php`
6. Click "OK" on all dialogs
7. Close and reopen your terminal

