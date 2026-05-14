<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    // Comma-separated list in .env (CORS_ALLOWED_ORIGINS). Trailing slashes are stripped.
    'allowed_origins' => array_values(array_filter(array_map(
        function (string $origin): string {
            $origin = trim($origin);

            return rtrim($origin, '/');
        },
        explode(',', env(
            'CORS_ALLOWED_ORIGINS',
            implode(',', [
                'http://localhost:3000',
                'http://127.0.0.1:3000',
                'https://darkslategrey-gazelle-896289.hostingersite.com',
                'https://www.shreejeeblessingwood.in',
                'https://shreejeeblessingwood.in',
            ])
        ))
    ))),
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];

