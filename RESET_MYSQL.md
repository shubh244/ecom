# Complete MySQL Reset Solution

Since MySQL keeps crashing, let's try a complete reset approach.

## Option 1: Reset MySQL Data Directory (Recommended)

This will remove all databases except system ones, giving you a fresh start.

### Steps:

1. **Stop MySQL** in XAMPP Control Panel

2. **Backup your data** (optional - only if you have important data):
   ```powershell
   # Backup entire data folder
   Copy-Item "C:\xampp\mysql\data" "C:\xampp\mysql\data_backup_$(Get-Date -Format 'yyyyMMdd')" -Recurse
   ```

3. **Remove problematic databases**:
   ```powershell
   cd C:\xampp\mysql\data
   
   # Remove all non-system databases
   Get-ChildItem -Directory | Where-Object {
       $_.Name -notlike "*mysql*" -and 
       $_.Name -notlike "*performance_schema*" -and 
       $_.Name -notlike "*phpmyadmin*" -and 
       $_.Name -notlike "*test*" -and 
       $_.Name -notlike "*information_schema*"
   } | Remove-Item -Recurse -Force
   ```

4. **Reset MySQL config**:
   - Edit `C:\xampp\mysql\bin\my.ini`
   - Remove or comment out:
     - `innodb_force_recovery = 6`
     - `skip-grant-tables` (if present)
   - Save the file

5. **Start MySQL** - it should start cleanly now

## Option 2: Use SQLite Instead (Quick Alternative)

If MySQL keeps causing issues, we can use SQLite for development:

1. **Update Laravel .env**:
   ```
   DB_CONNECTION=sqlite
   DB_DATABASE=C:\Users\hp\Desktop\furniture\backend_new\database\database.sqlite
   ```

2. **Create SQLite database**:
   ```powershell
   cd C:\Users\hp\Desktop\furniture\backend_new
   New-Item -ItemType File -Path "database\database.sqlite"
   ```

3. **Run migrations**:
   ```powershell
   php artisan migrate
   ```

This bypasses MySQL entirely for development.

## Option 3: Reinstall MySQL in XAMPP

If nothing works:

1. **Stop MySQL** in XAMPP
2. **Backup** `C:\xampp\mysql\data` folder
3. **Delete** `C:\xampp\mysql\data` folder
4. **Reinstall XAMPP MySQL** or restore from backup

## Which Option to Choose?

- **Option 1**: If you want to keep MySQL but start fresh
- **Option 2**: Quickest solution - use SQLite for development
- **Option 3**: Last resort - reinstall MySQL

I recommend **Option 2 (SQLite)** for now - it's the fastest way to get your project running!

