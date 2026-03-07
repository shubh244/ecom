# Fix MySQL Connection Error

The error means MySQL is not running in XAMPP. Here's how to fix it:

## Solution: Start MySQL in XAMPP

### Step 1: Open XAMPP Control Panel
- Look for XAMPP icon in your system tray (bottom right)
- Or search for "XAMPP Control Panel" in Windows Start menu

### Step 2: Start MySQL
1. In XAMPP Control Panel, find **MySQL**
2. Click the **"Start"** button next to MySQL
3. Wait for it to turn green (should say "Running")

### Step 3: Verify MySQL is Running
- You should see "Running" in green next to MySQL
- If you see errors, check the logs

### Step 4: Try phpMyAdmin Again
- Refresh http://localhost/phpmyadmin
- Or click "Admin" button next to MySQL in XAMPP

## Alternative: Start MySQL via Command Line

If XAMPP Control Panel doesn't work, try:

```powershell
# Navigate to XAMPP
cd C:\xampp\mysql\bin

# Start MySQL
.\mysqld.exe --console
```

## Common Issues

### Port 3306 Already in Use
If MySQL won't start, another service might be using port 3306:
1. Open XAMPP Control Panel
2. Click "Config" next to MySQL
3. Select "my.ini"
4. Change port from 3306 to 3307 (or another port)
5. Update your Laravel .env file with the new port

### MySQL Service Won't Start
1. Check XAMPP Control Panel logs (click "Logs" button)
2. Make sure no other MySQL service is running
3. Try restarting XAMPP Control Panel as Administrator

## After MySQL Starts

Once MySQL is running:
1. Open phpMyAdmin: http://localhost/phpmyadmin
2. Create database: `woodstate_db`
3. Then continue with Laravel setup


