# How to Start Laravel Backend

## Quick Start

Open PowerShell and run these commands:

```powershell
cd C:\Users\hp\Desktop\furniture\backend_new
$env:Path += ";C:\xampp\php"
php artisan serve
```

## Step-by-Step Instructions

### Step 1: Open PowerShell
- Press `Win + X` and select "Windows PowerShell"
- Or search for "PowerShell" in Start menu

### Step 2: Navigate to Backend Directory
```powershell
cd C:\Users\hp\Desktop\furniture\backend_new
```

### Step 3: Add PHP to PATH (for this session)
```powershell
$env:Path += ";C:\xampp\php"
```

### Step 4: Start Laravel Server
```powershell
php artisan serve
```

## What You Should See

When the server starts, you'll see:
```
INFO  Server running on [http://127.0.0.1:8000]

  Press Ctrl+C to stop the server
```

## Verify It's Working

Open your browser and visit:
- **API Test**: http://localhost:8000/api/categories
- **API Products**: http://localhost:8000/api/products

You should see JSON data.

## Stop the Server

Press `Ctrl + C` in the PowerShell window to stop the server.

## Troubleshooting

### "php is not recognized"
- Make sure XAMPP is installed
- Add PHP to PATH: `$env:Path += ";C:\xampp\php"`
- Or use full path: `C:\xampp\php\php.exe artisan serve`

### "Port 8000 already in use"
- Another server might be running on port 8000
- Use a different port: `php artisan serve --port=8001`

### "Could not open input file: artisan"
- Make sure you're in the `backend_new` directory
- Check: `cd C:\Users\hp\Desktop\furniture\backend_new`

## Quick Reference

**Start Backend:**
```powershell
cd C:\Users\hp\Desktop\furniture\backend_new
$env:Path += ";C:\xampp\php"
php artisan serve
```

**Backend URL:** http://localhost:8000

