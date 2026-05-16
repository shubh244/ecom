# Auto-deploy Laravel (`backend_new`) to Hostinger on Git push

Hostinger’s **Git** integration only deploys your **Next.js** app from the repo root.  
This workflow deploys **`backend_new/`** to **`public_html/api/`** over **FTP** when you push to `master`/`main`.

## One-time setup (GitHub)

1. Repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

2. Add these secrets (values from **hPanel → Files → FTP Accounts** for the **main** site `darkslategrey-gazelle-896289.hostingersite.com`):

| Secret | Example / where to find |
|--------|-------------------------|
| `HOSTINGER_FTP_SERVER` | Often `ftp.hostinger.com` or the host shown in FTP details |
| `HOSTINGER_FTP_USERNAME` | FTP user (e.g. `u274811071@darkslategrey-gazelle-896289.hostingersite.com` or similar) |
| `HOSTINGER_FTP_PASSWORD` | FTP password you set when creating the account |
| `HOSTINGER_FTP_REMOTE_DIR` | Path **from FTP login root** to `api` folder — often one of: `domains/darkslategrey-gazelle-896289.hostingersite.com/public_html/api` or `public_html/api` |

3. In File Manager, **create empty folder** `public_html/api` on the main site if it does not exist (FTP may fail if missing).

4. **Subdomain** `api.darkslategrey-gazelle-896289.hostingersite.com` → document root =  
   `/home/u274811071/domains/darkslategrey-gazelle-896289.hostingersite.com/public_html/api/public`

## One-time on server (still manual)

After the **first** successful deploy:

- Upload or create **`public_html/api/.env`** (copy `scripts/hostinger-api.env.example`, set `DB_PASSWORD`, `APP_KEY` via SSH `php artisan key:generate`).
- The workflow **does not** upload `.env` (excluded for safety).

Optional SSH after each deploy (or only first time):

```bash
cd ~/domains/darkslategrey-gazelle-896289.hostingersite.com/public_html/api
php artisan migrate --force
php artisan config:clear
php artisan storage:link
```

Database data: import `hostinger-schema.sql` then `hostinger-data.sql` in phpMyAdmin once.

## Trigger

- Push any change under **`backend_new/`** to **`master`** or **`main`**, or  
- **Actions** tab → **Deploy Laravel API to Hostinger** → **Run workflow**

## If FTP path is wrong

Check FTP client (FileZilla): after login, navigate to `public_html/api` — the path shown there is what `HOSTINGER_FTP_REMOTE_DIR` should be (no leading slash sometimes required; try both if deploy fails).
