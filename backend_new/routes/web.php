<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $frontendUrl = rtrim((string) env('FRONTEND_URL', ''), '/');
    $currentOrigin = rtrim(request()->getSchemeAndHttpHost(), '/');

    // Fallback: use first allowed CORS origin as storefront URL.
    if ($frontendUrl === '') {
        $origins = array_values(array_filter(array_map('trim', explode(',', (string) env('CORS_ALLOWED_ORIGINS', '')))));
        if (! empty($origins)) {
            $frontendUrl = rtrim($origins[0], '/');
        }
    }

    // Avoid redirect loops when the frontend is served on the same host.
    if ($frontendUrl !== '' && $frontendUrl !== $currentOrigin) {
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
