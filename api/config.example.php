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
     * 'username' and 'from_email' must be the SAME mailbox. Gmail silently
     * rewrites the From header to the authenticated account when they differ,
     * so a mismatch does not error, it just quietly sends as someone else.
     *
     * Sending as an @elevaitelabs.in address therefore means authenticating as
     * that Workspace mailbox, not as a personal gmail with an alias. The
     * domain publishes DMARC with adkim=s and aspf=s, so SPF and DKIM have to
     * align to elevaitelabs.in exactly; authenticating as @gmail.com aligns to
     * gmail.com instead and the mail is treated as spam.
     */
    'smtp' => [
        'enabled'    => false,
        'host'       => 'smtp.gmail.com',
        'port'       => 587,
        'encryption' => 'tls',           // 'tls' for 587, 'ssl' for 465
        'username'   => 'premsai@elevaitelabs.in',
        'password'   => 'your-16-char-app-password',
        'from_email' => 'premsai@elevaitelabs.in',   // must match 'username'
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
