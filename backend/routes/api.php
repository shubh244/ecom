<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CartController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('api')->group(function () {
    // Products
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{id}', [ProductController::class, 'show']);
    Route::get('/products/category/{category}', [ProductController::class, 'getByCategory']);
    Route::get('/products/featured', [ProductController::class, 'getFeatured']);
    
    // Categories
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{id}', [CategoryController::class, 'show']);
    Route::get('/categories/{id}/products', [CategoryController::class, 'getProducts']);
    
    // Cart
    Route::prefix('cart')->group(function () {
        Route::post('/add', [CartController::class, 'add']);
        Route::get('/', [CartController::class, 'index']);
        Route::delete('/{id}', [CartController::class, 'remove']);
        Route::put('/{id}', [CartController::class, 'update']);
        Route::delete('/', [CartController::class, 'clear']);
    });
});

// Admin routes (protected)
Route::middleware(['api', 'auth:sanctum'])->group(function () {
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
});

