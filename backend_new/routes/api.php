<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\OrderPaymentController;
use App\Http\Controllers\Api\PaymentConfigController;

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

// API health/info
Route::get('/', function () {
    return response()->json([
        'success' => true,
        'service' => 'ecom-backend',
        'message' => 'API is running',
    ]);
});

Route::get('/health', function () {
    return response()->json([
        'success' => true,
        'status' => 'ok',
    ]);
});

Route::get('/payment/config', [PaymentConfigController::class, 'show']);

// Products
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/category/{category}', [ProductController::class, 'getByCategory']);
Route::get('/products/featured', [ProductController::class, 'getFeatured']);
Route::get('/products/hot-offers', [ProductController::class, 'getHotOffers']);
// Constrain {id} to numbers so "featured" / "hot-offers" never match this route.
Route::get('/products/{id}', [ProductController::class, 'show'])->whereNumber('id');

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

// Orders
Route::post('/orders', [OrderController::class, 'store']);
Route::get('/orders', [OrderController::class, 'index']);
Route::get('/orders/{id}', [OrderController::class, 'show'])->whereNumber('id');
Route::post('/orders/{id}/payment/razorpay/order', [OrderPaymentController::class, 'createRazorpayOrder'])->whereNumber('id');
Route::post('/orders/{id}/payment/razorpay/verify', [OrderPaymentController::class, 'verifyRazorpayPayment'])->whereNumber('id');
// Compatibility routes for standard Razorpay examples.
Route::post('/create-order', [OrderPaymentController::class, 'createOrder']);
Route::post('/verify-payment', [OrderPaymentController::class, 'verifyPayment']);
Route::post('/orders/{id}/payment/report', [OrderPaymentController::class, 'report'])->whereNumber('id');
Route::post('/orders/{id}/payment/screenshot', [OrderPaymentController::class, 'uploadScreenshot'])->whereNumber('id');

// Admin routes (protected)
Route::middleware(['api', 'auth:sanctum'])->group(function () {
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
});

