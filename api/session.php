<?php
require_once __DIR__ . '/auth.php';

send_cors_headers('GET, OPTIONS');

// Lets the admin UI ask the server whether the current session is valid,
// instead of trusting a flag in localStorage.
if (is_admin()) {
    echo json_encode([
        'authenticated' => true,
        'user' => [
            'id' => $_SESSION['admin_id'],
            'username' => $_SESSION['admin_username'] ?? null,
        ],
    ]);
} else {
    echo json_encode(['authenticated' => false]);
}
