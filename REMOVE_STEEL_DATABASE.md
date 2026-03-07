# Remove Steel Database from MySQL System Tables

The `steel` database is registered in MySQL but the files are missing. We need to remove it from MySQL's system tables.

## Solution: Remove Database from MySQL System

### Step 1: Start MySQL in Safe Mode

1. **Stop MySQL** in XAMPP Control Panel

2. **Edit** `C:\xampp\mysql\bin\my.ini`

3. **Add this line** in the `[mysqld]` section (after `innodb_force_recovery = 6`):
   ```
   skip-grant-tables
   ```

4. **Save** the file

5. **Start MySQL** - it should start now

### Step 2: Connect to MySQL and Remove Database

Open PowerShell and run:

```powershell
$env:Path += ";C:\xampp\php"
cd C:\xampp\mysql\bin
.\mysql.exe -u root
```

Then in MySQL, run:
```sql
DROP DATABASE IF EXISTS steel;
FLUSH PRIVILEGES;
EXIT;
```

### Step 3: Remove Safe Mode

1. **Stop MySQL**

2. **Edit** `C:\xampp\mysql\bin\my.ini`

3. **Remove or comment out**:
   ```
   #skip-grant-tables
   ```

4. **Also remove** `innodb_force_recovery = 6` (or change back to 0)

5. **Save** the file

6. **Start MySQL** normally

## Alternative: Quick Fix Script

I'll create a script to do this automatically.


