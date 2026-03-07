# Final MySQL Fix - Remove Steel Database

## The Problem
MySQL is crashing because the `steel` database is registered in MySQL's system tables, but the physical files are missing or corrupted.

## Solution: Remove Database from MySQL System

I've created a script to fix this automatically. Here's what to do:

### Quick Fix (Recommended)

1. **Run the fix script**:
   ```powershell
   cd C:\Users\hp\Desktop\furniture
   .\remove-steel-db.ps1
   ```

2. **Follow the prompts** - it will guide you through:
   - Stopping MySQL
   - Adding safe mode
   - Starting MySQL
   - Removing the database
   - Cleaning up

### Manual Fix (If Script Doesn't Work)

#### Step 1: Add Safe Mode
1. **Stop MySQL** in XAMPP
2. **Edit** `C:\xampp\mysql\bin\my.ini`
3. **Find** `[mysqld]` section
4. **Add** this line:
   ```
   skip-grant-tables
   ```
5. **Save** the file

#### Step 2: Start MySQL and Remove Database
1. **Start MySQL** in XAMPP
2. **Open PowerShell** and run:
   ```powershell
   $env:Path += ";C:\xampp\php"
   C:\xampp\mysql\bin\mysql.exe -u root
   ```
3. **In MySQL**, type:
   ```sql
   DROP DATABASE IF EXISTS steel;
   FLUSH PRIVILEGES;
   EXIT;
   ```

#### Step 3: Remove Safe Mode
1. **Stop MySQL**
2. **Edit** `C:\xampp\mysql\bin\my.ini`
3. **Remove** the `skip-grant-tables` line
4. **Also change** `innodb_force_recovery = 6` to `innodb_force_recovery = 0`
5. **Save** the file
6. **Start MySQL** normally

## After Fixing

Once MySQL starts successfully:
1. ✅ Open phpMyAdmin: http://localhost/phpmyadmin
2. ✅ Create database: `woodstate_db`
3. ✅ Continue with Laravel setup!

## Why This Works

The `steel` database exists in MySQL's system tables but has corrupted/missing files. By using `skip-grant-tables`, we can connect to MySQL and remove the database reference, then MySQL will start normally.


