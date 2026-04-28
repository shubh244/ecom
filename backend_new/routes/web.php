<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $frontendUrl = rtrim((string) env('FRONTEND_URL', ''), '/');

    if ($frontendUrl !== '') {
        return redirect()->away($frontendUrl);
    }

    return response()->json([
        'success' => true,
        'service' => 'ecom-backend',
        'message' => 'Backend is running. Set FRONTEND_URL to redirect home page to your storefront.',
        'api' => [
            'base' => url('/api'),
            'health' => url('/api/health'),
        ],
    ]);
});
