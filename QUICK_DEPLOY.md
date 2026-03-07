# ⚡ Quick Deployment Guide - Hostinger

## 🎯 Fastest Method: Vercel (Frontend) + Hostinger (Backend)

### Step 1: Deploy Frontend to Vercel (5 minutes)

1. **Go to https://vercel.com** and sign up
2. **Click "New Project"**
3. **Import your Git repository** OR **Upload folder**:
   - If using Git: Connect GitHub/GitLab
   - If uploading: Drag `furniture` folder
4. **Configure:**
   - Framework: Next.js (auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. **Add Environment Variable:**
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://your-domain.com/api` (update after backend setup)
6. **Click Deploy**
7. **Note your Vercel URL**: `your-app.vercel.app`

---

### Step 2: Deploy Backend to Hostinger (15 minutes)

#### A. Upload Files
1. **Login to Hostinger hPanel**
2. **File Manager** → Navigate to `public_html`
3. **Create folder**: `api`
4. **Upload all files** from `backend_new` folder to `api`
   - Exclude: `node_modules`, `.git`, `.env`

#### B. Create Database
1. **hPanel** → **MySQL Databases**
2. **Create Database**: Note database name
3. **Create User**: Note username and password
4. **Add User to Database**: Grant all privileges

#### C. Setup Environment
1. **File Manager** → `api` folder
2. **Create `.env` file**:
```env
APP_NAME="Shreejee Blessing Wood"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://your-domain.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password

ADMIN_EMAIL=admin@woodstate.com
ADMIN_PASSWORD=admin123

CORS_ALLOWED_ORIGINS=https://your-app.vercel.app
```

#### D. Generate Key & Migrate
1. **hPanel** → **Terminal** (or use SSH)
2. Run:
```bash
cd public_html/api
php artisan key:generate
php artisan migrate
php artisan db:seed
```

#### E. Set Permissions
```bash
chmod -R 755 storage bootstrap/cache
```

#### F. Create `.htaccess` in `api/public`
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

#### G. Point Domain to API
- **Option 1**: Use subdomain `api.your-domain.com` → point to `public_html/api/public`
- **Option 2**: Use folder `your-domain.com/api` → point to `public_html/api/public`

---

### Step 3: Update Frontend API URL

1. **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. **Update** `NEXT_PUBLIC_API_URL`:
   - `https://your-domain.com/api` OR
   - `https://api.your-domain.com`
3. **Redeploy** (automatic or manual)

---

### Step 4: Test

1. **Visit**: `https://your-app.vercel.app`
2. **Check**: Products loading
3. **Admin Login**: `https://your-app.vercel.app/admin/login`
   - Email: `admin@woodstate.com`
   - Password: `admin123`

---

## 🔧 Alternative: Both on Hostinger VPS

If you have VPS hosting:

### Quick Setup:
```bash
# 1. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 2. Install PM2
sudo npm install -g pm2

# 3. Build Frontend
cd /var/www/frontend
npm install
npm run build

# 4. Start with PM2
pm2 start npm --name "furniture" -- start
pm2 save
pm2 startup

# 5. Configure Nginx (see full guide)
```

---

## 📝 Important Notes

1. **Update CORS** in `backend_new/config/cors.php` with your frontend URL
2. **SSL Certificate**: Install via Hostinger or Let's Encrypt
3. **File Permissions**: Ensure `storage` folder is writable
4. **Database**: Use Hostinger's MySQL (usually `localhost`)

---

## ✅ Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend uploaded to Hostinger
- [ ] Database created and configured
- [ ] `.env` file created with correct credentials
- [ ] Migrations run successfully
- [ ] API URL updated in frontend
- [ ] CORS configured
- [ ] Test admin login
- [ ] Test product display

---

## 🆘 Need Help?

**Hostinger Support:**
- Live Chat in hPanel
- Help Center: https://www.hostinger.com/help

**Common Issues:**
- **500 Error**: Check `.env` file and database connection
- **CORS Error**: Update `cors.php` with frontend URL
- **Products Not Loading**: Verify API URL in frontend

---

**You're all set! Your site should be live! 🎉**

