# Solution for SSL Certificate Issue with Composer

The SSL certificate error is likely caused by:
1. Antivirus/Firewall (Avast mentioned in error)
2. Corporate proxy
3. Outdated certificate bundle

## Quick Fixes to Try:

### Option 1: Temporarily Disable Antivirus/Firewall
1. Temporarily disable Avast or your antivirus
2. Try `composer install` again
3. Re-enable antivirus after installation

### Option 2: Use HTTP Instead (Temporary)
Edit `composer.json` and add this before "require":
```json
"repositories": [
    {
        "type": "composer",
        "url": "http://repo.packagist.org"
    }
]
```

Then run:
```powershell
composer install --no-interaction
```

### Option 3: Manual Package Download
If nothing works, we can manually download Laravel packages.

### Option 4: Use Laravel Installer Instead
```powershell
composer global require laravel/installer
laravel new backend
```

## Recommended: Create Fresh Laravel Project

Since we're having SSL issues, let's create a fresh Laravel project in a new location and copy our API files:

1. Create Laravel project in a temp location
2. Copy our API controllers, models, routes, migrations
3. This way Laravel framework is properly installed

Let me know which option you'd like to try!

