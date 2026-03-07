# 🚀 Deployment Guide for Hostinger

## 📋 Prerequisites

1. **Hostinger Account** with:
   - Shared Hosting or VPS (for Laravel backend)
   - Domain name configured
   - SSH access (for VPS) or File Manager access

2. **Files Ready:**
   - Next.js frontend (in `furniture` folder)
   - Laravel backend (in `backend_new` folder)

## 🎯 Deployment Options

### Option 1: Shared Hosting (Easier)
- Frontend: Deploy to Vercel/Netlify (Free)
- Backend: Deploy to Hostinger Shared Hosting

### Option 2: VPS Hosting (Full Control)
- Both frontend and backend on Hostinger VPS

---

## 📦 Option 1: Shared Hosting Setup (Recommended for Testing)

### Step 1: Deploy Frontend to Vercel (Free & Easy)

#### 1.1 Prepare Frontend
```powershell
cd C:\Users\hp\Desktop\furniture
npm run build
```

#### 1.2 Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub/GitLab/Bitbucket
3. Install Vercel CLI (optional) or use web interface

#### 1.3 Deploy via Vercel Dashboard
1. Go to https://vercel.com/new
2. Import your Git repository OR
3. Drag and drop your `furniture` folder
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (or leave default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

#### 1.4 Environment Variables
Add in Vercel Dashboard → Settings → Environment Variables:
```
NEXT_PUBLIC_API_URL=https://your-domain.com/api
```

#### 1.5 Deploy
- Click "Deploy"
- Vercel will provide a URL like: `your-app.vercel.app`

---

### Step 2: Deploy Backend to Hostinger

#### 2.1 Prepare Backend Files
```powershell
cd C:\Users\hp\Desktop\furniture\backend_new
```

#### 2.2 Upload Files to Hostinger
1. **Login to Hostinger** → hPanel
2. Go to **File Manager**
3. Navigate to `public_html` or your domain folder
4. Create folder: `api` (or `backend`)
5. Upload all files from `backend_new` folder EXCEPT:
   - `node_modules` (if exists)
   - `.git`
   - `storage/logs/*` (keep folder, delete files)
   - `.env` (we'll create new one)

#### 2.3 Create `.env` File on Hostinger
In File Manager, create `.env` file in your backend folder:

```env
APP_NAME="Shreejee Blessing Wood"
APP_ENV=production
APP_KEY=base64:YOUR_APP_KEY_HERE
APP_DEBUG=false
APP_URL=https://your-domain.com

LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password

ADMIN_EMAIL=admin@woodstate.com
ADMIN_PASSWORD=admin123

CORS_ALLOWED_ORIGINS=https://your-frontend-url.vercel.app,https://your-domain.com
```

#### 2.4 Generate App Key
In Hostinger File Manager → Terminal (or SSH):
```bash
cd public_html/api
php artisan key:generate
```

#### 2.5 Database Setup
1. **Create Database:**
   - hPanel → MySQL Databases
   - Create new database
   - Create database user
   - Note credentials

2. **Update `.env`** with database credentials

3. **Run Migrations:**
   - In Terminal/SSH:
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

#### 2.6 Configure `.htaccess` for Laravel
Create/Edit `.htaccess` in `public_html/api/public`:

```apache
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Redirect Trailing Slashes If Not A Folder...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Send Requests To Front Controller...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
```

#### 2.7 Set Permissions
```bash
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

#### 2.8 Update API URL in Frontend
In Vercel Dashboard → Environment Variables:
```
NEXT_PUBLIC_API_URL=https://your-domain.com/api
```

---

## 🖥️ Option 2: VPS Hosting (Full Deployment)

### Step 1: Connect to VPS via SSH
```bash
ssh root@your-server-ip
```

### Step 2: Install Required Software

#### Install Nginx
```bash
sudo apt update
sudo apt install nginx -y
```

#### Install PHP & Composer
```bash
sudo apt install php8.1-fpm php8.1-mysql php8.1-xml php8.1-mbstring php8.1-curl php8.1-zip -y
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

#### Install Node.js & NPM
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

#### Install MySQL
```bash
sudo apt install mysql-server -y
sudo mysql_secure_installation
```

### Step 3: Deploy Backend

#### 3.1 Clone/Upload Backend
```bash
cd /var/www
sudo mkdir api
sudo chown -R $USER:$USER /var/www/api
# Upload your backend files here
```

#### 3.2 Install Dependencies
```bash
cd /var/www/api
composer install --no-dev --optimize-autoloader
```

#### 3.3 Setup Environment
```bash
cp .env.example .env
nano .env  # Edit with your settings
php artisan key:generate
php artisan migrate
php artisan db:seed
```

#### 3.4 Configure Nginx for Backend
```bash
sudo nano /etc/nginx/sites-available/api
```

Add:
```nginx
server {
    listen 80;
    server_name api.your-domain.com;
    root /var/www/api/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 4: Deploy Frontend

#### 4.1 Build Frontend
```bash
cd /var/www
sudo mkdir frontend
sudo chown -R $USER:$USER /var/www/frontend
# Upload your frontend files here
```

#### 4.2 Install Dependencies & Build
```bash
cd /var/www/frontend
npm install
npm run build
```

#### 4.3 Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

#### 4.4 Start Next.js with PM2
```bash
cd /var/www/frontend
pm2 start npm --name "furniture-frontend" -- start
pm2 save
pm2 startup
```

#### 4.5 Configure Nginx for Frontend
```bash
sudo nano /etc/nginx/sites-available/frontend
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable:
```bash
sudo ln -s /etc/nginx/sites-available/frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 5: Setup SSL (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
sudo certbot --nginx -d api.your-domain.com
```

---

## 🔧 Important Configuration Updates

### 1. Update Frontend API URL

**For Vercel Deployment:**
- Vercel Dashboard → Project → Settings → Environment Variables
- Add: `NEXT_PUBLIC_API_URL=https://your-domain.com/api`

**For VPS Deployment:**
- Edit `.env.local` or `.env.production`:
```
NEXT_PUBLIC_API_URL=https://api.your-domain.com
```

### 2. Update Backend CORS

Edit `backend_new/config/cors.php`:
```php
'allowed_origins' => [
    'https://your-frontend.vercel.app',
    'https://your-domain.com',
],
```

### 3. Update Admin Login URL

The admin login will be:
- **Vercel**: `https://your-app.vercel.app/admin/login`
- **VPS**: `https://your-domain.com/admin/login`

---

## ✅ Post-Deployment Checklist

- [ ] Backend API accessible at `https://your-domain.com/api`
- [ ] Frontend accessible at your domain
- [ ] Database connected and migrated
- [ ] Products seeded
- [ ] Admin login working
- [ ] CORS configured correctly
- [ ] SSL certificate installed
- [ ] Environment variables set
- [ ] File permissions correct
- [ ] Test product CRUD operations
- [ ] Test order creation

---

## 🐛 Troubleshooting

### Backend Not Working
1. Check `.env` file exists and is configured
2. Verify database connection
3. Check file permissions: `chmod -R 755 storage`
4. Check Nginx/Apache error logs

### Frontend Can't Connect to API
1. Verify `NEXT_PUBLIC_API_URL` is set correctly
2. Check CORS settings in backend
3. Verify API endpoint is accessible

### 500 Errors
1. Check Laravel logs: `storage/logs/laravel.log`
2. Enable debug temporarily: `APP_DEBUG=true`
3. Check PHP error logs

---

## 📞 Quick Reference

**Hostinger Support:**
- Help Center: https://www.hostinger.com/help
- Live Chat: Available in hPanel

**Useful Commands:**
```bash
# Check Laravel logs
tail -f storage/logs/laravel.log

# Restart services
sudo systemctl restart nginx
pm2 restart furniture-frontend

# Check Nginx status
sudo systemctl status nginx
```

---

## 🎉 You're Ready!

Once deployed, your furniture e-commerce site will be live and accessible for showcase!

**Recommended: Use Option 1 (Vercel + Hostinger) for easiest deployment!**

