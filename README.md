# Wood State Furniture - E-commerce Website

A modern furniture e-commerce website inspired by woodstate.co design.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- Modern, responsive design
- Product categories and listings
- Shopping cart functionality
- Product detail pages
- Search and filter capabilities

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- React Icons

## Custom domain: shreejeeblessingwood.in (GoDaddy DNS, keep default nameservers)

1. In **Vercel**, add `shreejeeblessingwood.in` and `www.shreejeeblessingwood.in`. In **GoDaddy DNS**: **A** `@` → `76.76.21.21`, **CNAME** `www` → `cname.vercel-dns.com`.
2. In **Render**, add `api.shreejeeblessingwood.in`. In **GoDaddy DNS**: **CNAME** `api` → your `*.onrender.com` hostname (value from Render).
3. In **Vercel** project environment (Production), set and redeploy:
   - `NEXT_PUBLIC_SITE_URL=https://www.shreejeeblessingwood.in`
   - `NEXT_PUBLIC_API_URL=https://api.shreejeeblessingwood.in/api`
4. In **Render** service environment, set and redeploy:
   - `APP_URL=https://api.shreejeeblessingwood.in`
   - `FRONTEND_URL=https://www.shreejeeblessingwood.in`
   - `CORS_ALLOWED_ORIGINS=https://www.shreejeeblessingwood.in,https://shreejeeblessingwood.in`

If you use the apex (`https://shreejeeblessingwood.in`) as the main site instead of `www`, set `NEXT_PUBLIC_SITE_URL` and `FRONTEND_URL` to that URL and keep both origins in `CORS_ALLOWED_ORIGINS`.

Copy variable names from `.env.example` (frontend) and `backend_new/.env.example` (API).

