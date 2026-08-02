<?php
/**
 * Copy this file to config.php and fill in the real values.
 * config.php is gitignored - never commit real credentials.
 */
return [
    'db' => [
        'host'     => 'localhost',
        'name'     => 'your_database_name',
        'user'     => 'your_database_user',
        'password' => 'your_database_password',
    ],

    // Origins allowed to call this API with credentials.
    // In production the site and API are same-origin, so this only
    // matters for local development against the live API.
    'allowed_origins' => [
        'https://elevaitelabs.in',
        'https://www.elevaitelabs.in',
        'http://localhost:5173',
    ],

    // Set false only when running over plain HTTP locally.
    'cookie_secure' => true,

    // Show DB error details in API responses. Keep false in production.
    'debug' => false,
];
