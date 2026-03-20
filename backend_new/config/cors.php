<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    // Normalize allowed origins: trim whitespace and remove trailing slashes.
    // This avoids preflight failures like:
    //   origin: https://site.vercel.app
    //   allow-origin: https://site.vercel.app/
    'allowed_origins' => array_values(array_filter(array_map(
        function (string $origin): string {
            $origin = trim($origin);
            return rtrim($origin, '/');
        },
        explode(',', env(
            'CORS_ALLOWED_ORIGINS',
            'http://localhost:3000,http://127.0.0.1:3000'
        ))
    ))),
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];

