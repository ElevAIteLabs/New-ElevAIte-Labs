<?php
/**
 * Shared bootstrap: config, CORS, session, and the admin guard.
 * Every endpoint must require this file before doing any work.
 */

if (!defined('ELEVAITE_CONFIG')) {
    $configPath = __DIR__ . '/config.php';
    if (!file_exists($configPath)) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Missing api/config.php. Copy config.example.php and fill it in.']);
        exit();
    }
    define('ELEVAITE_CONFIG', require $configPath);
}

/** Emit CORS headers, echoing back only allow-listed origins. */
function send_cors_headers($methods = 'GET, POST, PUT, PATCH, DELETE, OPTIONS') {
    $config = ELEVAITE_CONFIG;
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if ($origin !== '' && in_array($origin, $config['allowed_origins'], true)) {
        // Credentialed requests cannot use "*", so echo the exact origin.
        header("Access-Control-Allow-Origin: $origin");
        header('Access-Control-Allow-Credentials: true');
        header('Vary: Origin');
    }

    header("Access-Control-Allow-Methods: $methods");
    header('Access-Control-Allow-Headers: Content-Type');
    header('Content-Type: application/json');

    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        exit();
    }
}

/** Start the admin session with hardened cookie settings. */
function start_admin_session() {
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    $config = ELEVAITE_CONFIG;
    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');

    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => '/',
        'httponly' => true,
        'secure'   => $config['cookie_secure'] && $https,
        // "None" is required when the admin UI is on a different origin.
        'samesite' => 'Lax',
    ]);

    session_name('ELEVAITE_ADMIN');
    session_start();
}

/** True when the current session belongs to a logged-in admin. */
function is_admin() {
    start_admin_session();
    return !empty($_SESSION['admin_id']);
}

/** Abort with 401 unless the caller is a logged-in admin. */
function require_admin() {
    if (!is_admin()) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Authentication required']);
        exit();
    }
}

/**
 * The signed-in account's role.
 *
 * Defaults to 'admin' so that a session established before the role column
 * existed, or a database where the migration has not run yet, keeps working
 * exactly as it did. Only accounts explicitly marked 'writer' are limited.
 */
function admin_role() {
    start_admin_session();
    return $_SESSION['admin_role'] ?? 'admin';
}

/** True for accounts that may only write blog posts. */
function is_writer() {
    return admin_role() === 'writer';
}

/**
 * Abort with 403 when a writer reaches something only a full admin may
 * change. Employees publish articles; they have no business editing the
 * services list, the case studies, or reading customer enquiries.
 */
function require_full_admin() {
    require_admin();
    if (is_writer()) {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Your account can only manage blog posts']);
        exit();
    }
}
