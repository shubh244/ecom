# Fix SSL Certificate Error for Composer Installation

## Problem
Composer installer can't verify SSL certificates because the certificate bundle is missing or outdated.

## Solution 1: Download Certificate Bundle (Recommended)

### Step 1: Download cacert.pem
1. Go to: https://curl.se/ca/cacert.pem
2. Save the file as `cacert.pem`
3. Save it to: `C:\xampp\php\extras\ssl\cacert.pem` (create the folder if needed)

### Step 2: Update php.ini
1. Open: `C:\xampp\php\php.ini` in a text editor
2. Find the line: `;curl.cainfo =`
3. Uncomment it and set it to:
   ```
   curl.cainfo = "C:\xampp\php\extras\ssl\cacert.pem"
   ```
4. Also find: `;openssl.cafile=`
5. Uncomment it and set it to:
   ```
   openssl.cafile = "C:\xampp\php\extras\ssl\cacert.pem"
   ```
6. Save the file

### Step 3: Try Composer Installer Again
Run the Composer installer again.

## Solution 2: Manual Composer Installation (Easier)

Skip the installer and install Composer manually:

### Step 1: Download composer.phar
1. Go to: https://getcomposer.org/download/latest-stable/composer.phar
2. Save it to: `C:\xampp\php\composer.phar`

### Step 2: Create composer.bat
Create a file `C:\xampp\php\composer.bat` with this content:
```batch
@echo off
php "%~dp0composer.phar" %*
```

### Step 3: Add to PATH
Add `C:\xampp\php` to your system PATH (if not already added).

### Step 4: Test
Open PowerShell and run:
```powershell
$env:Path += ";C:\xampp\php"
composer --version
```

## Solution 3: Disable SSL Verification (Temporary - Not Recommended)

Only use this if other methods don't work:

1. Open: `C:\xampp\php\php.ini`
2. Find: `allow_url_fopen`
3. Make sure it's: `allow_url_fopen = On`
4. Find: `openssl.cafile`
5. Comment it out or leave empty
6. Save and try again

**Note:** This is less secure and not recommended for production.

