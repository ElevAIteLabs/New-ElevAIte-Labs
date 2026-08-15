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

    /**
     * Outgoing mail for contact form notifications.
     *
     * Provider-agnostic. For a Gmail account, generate an App Password
     * (Google Account > Security > 2-Step Verification > App passwords) and
     * use it as 'password' - your normal account password will not work.
     *
     * Note on the From address: Gmail will not send as an address it has not
     * verified, so 'from_email' should be the account itself. 'reply_to' is
     * what matters for replies, and that is the address people will answer to.
     */
    'smtp' => [
        'enabled'    => false,
        'host'       => 'smtp.gmail.com',
        'port'       => 587,
        'encryption' => 'tls',           // 'tls' for 587, 'ssl' for 465
        'username'   => 'sender@gmail.com',
        'password'   => 'your-16-char-app-password',
        'from_email' => 'sender@gmail.com',
        'from_name'  => 'ElevAIte Labs Website',
        'reply_to'   => 'contact@elevaitelabs.in',
        'notify'     => 'premsai@elevaitelabs.in',   // where new leads are sent
        // Copied on the team notification only, never on the confirmation
        // that goes back to the person who filled in the form.
        'notify_cc'  => ['elevaitelabs@gmail.com'],
    ],

    // Forwarded server-side so the URL is not exposed in the JS bundle.
    // Empty string disables forwarding.
    'kredoo_webhook' => '',
];
