# Laravel API Integration Guide

This document explains how the Next.js frontend integrates with the Laravel backend API.

## Architecture

- **Frontend**: Next.js 14 (React) running on `http://localhost:3000`
- **Backend**: Laravel API running on `http://localhost:8000`
- **Communication**: RESTful API calls via fetch

## Setup Instructions

### 1. Laravel Backend Setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate

# Configure database in .env
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=woodstate_db
# DB_USERNAME=your_username
# DB_PASSWORD=your_password

php artisan migrate
php artisan db:seed
php artisan serve
```

### 2. Next.js Frontend Setup

```bash
# In the root directory
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local

npm run dev
```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get single product
- `GET /api/products/category/{category}` - Get products by category slug
- `GET /api/products/featured` - Get featured products

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/{id}` - Get single category
- `GET /api/categories/{id}/products` - Get products for a category

### Cart
- `POST /api/cart/add` - Add item to cart
- `GET /api/cart` - Get cart items
- `DELETE /api/cart/{id}` - Remove item from cart
- `PUT /api/cart/{id}` - Update cart item quantity
- `DELETE /api/cart` - Clear cart

## Frontend API Client

The frontend uses `lib/api.ts` which provides a typed API client:

```typescript
import { apiClient } from '@/lib/api'

// Get all products
const products = await apiClient.getProducts()

// Get products by category
const beds = await apiClient.getProductsByCategory('beds')

// Get featured products
const featured = await apiClient.getFeaturedProducts()

// Get categories
const categories = await apiClient.getCategories()
```

## Data Flow

1. **Homepage** (`app/page.tsx`)
   - Fetches categories and featured products on mount
   - Passes data to child components

2. **Product Pages** (`app/product/[id]/page.tsx`)
   - Fetches product details by ID
   - Displays product information

3. **Category Pages** (`app/category/[slug]/page.tsx`)
   - Fetches category by slug
   - Fetches products for that category

4. **Components**
   - `BedsSection` and `SofaSection` fetch products by category
   - `FeaturedProducts` receives products as props
   - `CategorySection` receives categories as props

## CORS Configuration

The Laravel backend is configured to accept requests from:
- `http://localhost:3000`
- `http://127.0.0.1:3000`

See `backend/config/cors.php` for configuration.

## Error Handling

The API client includes error handling:
- Network errors are caught and logged
- Components handle loading and error states
- Fallback to static data if API is unavailable (optional)

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Backend (.env)
```
APP_URL=http://localhost:8000
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=woodstate_db
DB_USERNAME=root
DB_PASSWORD=
```

## Testing the Integration

1. Start Laravel backend: `php artisan serve`
2. Start Next.js frontend: `npm run dev`
3. Visit `http://localhost:3000`
4. Check browser console for API calls
5. Verify data is loading from Laravel API

## Troubleshooting

### CORS Errors
- Ensure `backend/config/cors.php` includes your frontend URL
- Check Laravel CORS middleware is enabled

### API Connection Failed
- Verify Laravel server is running on port 8000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Test API endpoints directly in browser/Postman

### Data Not Loading
- Check browser console for errors
- Verify database is seeded with data
- Check Laravel logs: `storage/logs/laravel.log`

