# Fix Corrupted Database - MySQL Won't Start

The `steel` database is corrupted and preventing MySQL from fully starting. Here's how to fix it:

## Solution: Remove Corrupted Database Files

### Method 1: Stop MySQL and Delete Database Folder

1. **Stop MySQL** in XAMPP Control Panel (click "Stop")

2. **Navigate to MySQL data folder**:
   ```
   C:\xampp\mysql\data\steel
   ```

3. **Delete the `steel` folder** (or rename it to `steel_backup`)

4. **Start MySQL again** in XAMPP Control Panel

### Method 2: Use Command Line

Run these commands in PowerShell (as Administrator):

```powershell
# Stop MySQL first in XAMPP Control Panel

# Backup the corrupted database (optional)
cd C:\xampp\mysql\data
Rename-Item -Path "steel" -NewName "steel_backup_corrupted"

# Or delete it completely
# Remove-Item -Path "steel" -Recurse -Force

# Then start MySQL again from XAMPP Control Panel
```

### Method 3: Fix via MySQL Configuration

1. **Stop MySQL** in XAMPP Control Panel

2. **Edit MySQL config**:
   - Open: `C:\xampp\mysql\bin\my.ini`
   - Find: `[mysqld]` section
   - Add this line:
     ```
     innodb_force_recovery = 1
     ```

3. **Start MySQL** - it should start with recovery mode

4. **Remove the steel database** via phpMyAdmin or command line

5. **Remove the recovery line** from my.ini

6. **Restart MySQL** normally

## Quick Fix (Recommended)

**Easiest solution:**

1. **Stop MySQL** in XAMPP Control Panel
2. **Open File Explorer** and go to: `C:\xampp\mysql\data`
3. **Rename** the `steel` folder to `steel_old` (or delete it if you don't need it)
4. **Start MySQL** again in XAMPP Control Panel
5. **Verify** it starts without errors

## After Fixing

Once MySQL starts properly:
1. Open phpMyAdmin: http://localhost/phpmyadmin
2. Create database: `woodstate_db`
3. Continue with Laravel setup

## Why This Happened

The `steel` database (likely WordPress) has corrupted InnoDB tablespace files. Removing it allows MySQL to start normally.


