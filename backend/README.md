# Laravel API Backend

This is the Laravel backend API for the Wood State Furniture e-commerce website.

## Installation

1. **Install Composer dependencies**
   ```bash
   composer install
   ```

2. **Copy environment file**
   ```bash
   cp .env.example .env
   ```

3. **Generate application key**
   ```bash
   php artisan key:generate
   ```

4. **Configure database in `.env`**
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=woodstate_db
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

5. **Run migrations**
   ```bash
   php artisan migrate
   ```

6. **Seed database (optional)**
   ```bash
   php artisan db:seed
   ```

7. **Start development server**
   ```bash
   php artisan serve
   ```

The API will be available at `http://localhost:8000`

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get single product
- `GET /api/products/category/{category}` - Get products by category
- `POST /api/products` - Create product (admin)
- `PUT /api/products/{id}` - Update product (admin)
- `DELETE /api/products/{id}` - Delete product (admin)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/{id}` - Get single category

### Cart
- `POST /api/cart/add` - Add item to cart
- `GET /api/cart` - Get cart items
- `DELETE /api/cart/{id}` - Remove item from cart
- `PUT /api/cart/{id}` - Update cart item quantity

## CORS Configuration

The API is configured to accept requests from `http://localhost:3000` (Next.js frontend).

## Authentication

For admin endpoints, use Laravel Sanctum or Passport for authentication.

