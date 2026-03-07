# 🚀 How to Start the Project

Follow these steps in order to get your furniture e-commerce website running:

## Step 1: Set Up Database (One-Time Setup)

1. **Open XAMPP Control Panel**
2. **Start MySQL** (if not already running)
3. **Open phpMyAdmin**:
   - Click "Admin" button next to MySQL in XAMPP
   - Or visit: http://localhost/phpmyadmin
4. **Create Database**:
   - Click "New" in the left sidebar
   - Database name: `woodstate_db`
   - Collation: `utf8mb4_unicode_ci`
   - Click "Create"

✅ Database is ready!

## Step 2: Start Laravel Backend API

Open a **new PowerShell/Command Prompt** window and run:

```powershell
cd C:\Users\hp\Desktop\furniture\backend_new
$env:Path += ";C:\xampp\php"
php artisan serve
```

You should see:
```
INFO  Server running on [http://127.0.0.1:8000]
```

✅ Laravel API is now running on **http://localhost:8000**

**Keep this window open!** The server needs to keep running.

## Step 3: Run Database Migrations (If Not Done)

In the same terminal (or a new one), run:

```powershell
cd C:\Users\hp\Desktop\furniture\backend_new
$env:Path += ";C:\xampp\php"
php artisan migrate
php artisan db:seed
```

This creates the tables and adds sample data.

## Step 4: Configure Frontend Environment

Create `.env.local` file in the root directory:

```powershell
cd C:\Users\hp\Desktop\furniture
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local
```

Or manually create `.env.local` with:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Step 5: Install Frontend Dependencies

Open a **new PowerShell/Command Prompt** window:

```powershell
cd C:\Users\hp\Desktop\furniture
npm install
```

Wait for installation to complete.

## Step 6: Start Next.js Frontend

In the same terminal:

```powershell
npm run dev
```

You should see:
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
```

✅ Frontend is now running on **http://localhost:3000**

## Step 7: Open Your Website! 🎉

Open your browser and visit:
- **Frontend**: http://localhost:3000
- **API Test**: http://localhost:8000/api/categories

## Quick Commands Summary

### Terminal 1 - Laravel Backend:
```powershell
cd C:\Users\hp\Desktop\furniture\backend_new
$env:Path += ";C:\xampp\php"
php artisan serve
```

### Terminal 2 - Next.js Frontend:
```powershell
cd C:\Users\hp\Desktop\furniture
npm run dev
```

## Troubleshooting

### Laravel Server Won't Start
- Make sure XAMPP MySQL is running
- Check if port 8000 is already in use
- Try: `php artisan serve --port=8001`

### Frontend Can't Connect to API
- Verify Laravel is running on http://localhost:8000
- Check `.env.local` has correct API URL
- Test API directly: http://localhost:8000/api/categories

### Database Connection Error
- Make sure MySQL is running in XAMPP
- Verify database `woodstate_db` exists
- Check `backend_new/.env` has correct database credentials

## What You Should See

1. **Laravel API**: http://localhost:8000/api/categories (JSON data)
2. **Next.js Frontend**: http://localhost:3000 (Beautiful furniture website)

## 🎊 You're Done!

Your furniture e-commerce website is now running!

