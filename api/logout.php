<?php
require_once __DIR__ . '/auth.php';

send_cors_headers('POST, OPTIONS');

start_admin_session();
$_SESSION = [];

if (ini_get('session.use_cookies')) {
    $p = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
}

session_destroy();

echo json_encode(['status' => 'success', 'message' => 'Logged out']);
