# Complete Hostinger setup (Next.js shop + Laravel API)

Account context: Git overwrites **deployment root** (usually `public_html`). Laravel lives at **`public_html/api/`** with subdomain root **`public_html/api/public`**. Re-upload Laravel after a Git deploy if `api/` disappears.

---

## Part A — Laravel API (`backend_new`)

### A1. Prepare files on your PC

From repo root (`furniture/`):

```powershell
.\scripts\pack-api-tar-hostinger.ps1
```

Produces **`backend_new-deploy.tar.gz`** (Unix paths — avoids `public\index.php` bug).

**Do not** use Hostinger “Extract” on Windows `.zip` if it creates backslash filenames again.

### A2. Upload on Hostinger

1. **File Manager** →  
   `domains/darkslategrey-gazelle-896289.hostingersite.com/public_html`
2. Create folder **`api`** if missing.
3. Upload **`backend_new-deploy.tar.gz`** into **`api/`**.

### A3. Extract with SSH (recommended)

```bash
ssh -p 65002 u274811071@93.127.208.1
cd /home/u274811071/domains/darkslategrey-gazelle-896289.hostingersite.com/public_html/api
tar -xzf backend_new-deploy.tar.gz
rm -f backend_new-deploy.tar.gz
ls -la public/index.php artisan
```

You must see **real** folder `public/` with `index.php` (not files named `public\...`).

### A4. `.env` on server

Path: **`public_html/api/.env`** (next to `artisan`).

Copy from **`scripts/hostinger-api.env.example`** and set:

```env
APP_URL=https://api.darkslategrey-gazelle-896289.hostingersite.com
APP_ENV=production
APP_DEBUG=false

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=u274811071_shreejee
DB_USERNAME=u274811071_shreejee
DB_PASSWORD=<your MySQL password>

CORS_ALLOWED_ORIGINS=https://darkslategrey-gazelle-896289.hostingersite.com
```

Enable **Show hidden files** in File Manager to edit `.env`.

### A5. Composer + Artisan (SSH)

```bash
cd /home/u274811071/domains/darkslategrey-gazelle-896289.hostingersite.com/public_html/api
composer install --no-dev --optimize-autoloader
php artisan key:generate --force
php artisan config:clear
php artisan storage:link
```

Skip `php artisan migrate` if you import SQL below.

### A6. Database (phpMyAdmin)

1. Open **`u274811071_shreejee`**
2. Import **`backend_new/database/exports/hostinger-schema.sql`** first  
3. Import **`backend_new/database/exports/hostinger-data.sql`** second  

(Regenerate data export on PC if missing: `php artisan db:export-mysql-for-hostinger`)

### A7. Subdomain document root

**Websites** → **`api.darkslategrey-gazelle-896289.hostingersite.com`** → Manage → document root:

```
/home/u274811071/domains/darkslategrey-gazelle-896289.hostingersite.com/public_html/api/public
```

(or **`public_html/api/public`** if the panel shows relative paths)

### A8. SSL

hPanel → SSL for **`api.darkslategrey-gazelle-896289.hostingersite.com`** → enable (Confirm if Hostinger prompts).

### A9. Verify API

| URL | Expected |
|-----|----------|
| `https://api.darkslategrey-gazelle-896289.hostingersite.com/test.php` | Plain text: API public folder OK |
| `https://api.darkslategrey-gazelle-896289.hostingersite.com/api/health` | JSON `ok` |
| `https://api.darkslategrey-gazelle-896289.hostingersite.com/api/categories` | JSON categories |

If **`test.php`** shows the **furniture shop** layout → doc root still wrong (must be **`api/public`**).

---

## Part B — Next.js storefront (Git)

### B1. Environment variables

Git project → **Environment variables**:

```
NEXT_PUBLIC_SITE_URL=https://darkslategrey-gazelle-896289.hostingersite.com
NEXT_PUBLIC_API_URL=https://api.darkslategrey-gazelle-896289.hostingersite.com/api
```

### B2. Redeploy

Trigger deploy after saving env vars.

---

## Part C — After each frontend Git deploy

Hostinger may overwrite **`public_html`**. Check **`public_html/api/`** still exists.

If **`api`** is gone → repeat **A2–A5** (upload tar + extract + composer + `.env` restore).

Optional: GitHub Action FTP push to `public_html/api` — see `.github/HOSTINGER_FTP_DEPLOY.md`.

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Shop 404 on `/test.php` for api host | Doc root ≠ `api/public` |
| `public\index.php` style names | Bad ZIP extract → use **tar.gz + SSH** |
| Empty categories | Import schema + data SQL; check `.env` DB_* |
| CORS errors | Add storefront URL to `CORS_ALLOWED_ORIGINS` |

---

## Paths cheat sheet

```
Laravel root:  .../public_html/api/
Web root:      .../public_html/api/public/
.env:          .../public_html/api/.env
MySQL DB:      u274811071_shreejee
```
