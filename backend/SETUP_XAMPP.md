# Setting Up Laravel Backend with XAMPP

## Step 1: Add XAMPP PHP to PATH

Since XAMPP is running but PHP is not in your PATH, you need to add it:

### Method 1: Using PowerShell (Temporary - Current Session Only)
```powershell
$env:Path += ";C:\xampp\php"
php -v
```

### Method 2: Permanent Solution (Recommended)

1. Press `Win + R`, type `sysdm.cpl`, press Enter
2. Go to "Advanced" tab
3. Click "Environment Variables"
4. Under "System variables", find "Path" and click "Edit"
5. Click "New" and add: `C:\xampp\php`
6. Click "OK" on all dialogs
7. **Close and reopen your terminal/PowerShell**

Then verify:
```bash
php -v
```

## Step 2: Install Composer

1. Download Composer-Setup.exe from: https://getcomposer.org/download/
2. Run the installer
3. When it asks for PHP executable, browse to: `C:\xampp\php\php.exe`
4. Complete the installation
5. **Close and reopen your terminal**

Verify:
```bash
composer --version
```

## Step 3: Configure Database in XAMPP

1. Open XAMPP Control Panel
2. Start MySQL (if not already running)
3. Open phpMyAdmin (click "Admin" next to MySQL)
4. Create a new database named `woodstate_db`

## Step 4: Install Laravel Dependencies

Open PowerShell in the backend directory:
```bash
cd C:\Users\hp\Desktop\furniture\backend

# Add PHP to PATH for this session (if not done permanently)
$env:Path += ";C:\xampp\php"

# Install dependencies
composer install
```

## Step 5: Configure Laravel

```bash
# Copy environment file
copy .env.example .env

# Generate application key
php artisan key:generate
```

## Step 6: Configure Database in .env

Edit `backend\.env` file and set:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=woodstate_db
DB_USERNAME=root
DB_PASSWORD=
```

## Step 7: Run Migrations and Seed

```bash
php artisan migrate
php artisan db:seed
```

## Step 8: Start Laravel Server

```bash
php artisan serve
```

The API will be available at: http://localhost:8000

## Quick Commands Reference

```bash
# Add PHP to PATH (current session)
$env:Path += ";C:\xampp\php"

# Navigate to backend
cd C:\Users\hp\Desktop\furniture\backend

# Install dependencies
composer install

# Generate key
php artisan key:generate

# Run migrations
php artisan migrate

# Seed database
php artisan db:seed

# Start server
php artisan serve
```

