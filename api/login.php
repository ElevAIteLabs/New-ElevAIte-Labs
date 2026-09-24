<?php
require_once __DIR__ . '/db.php';

/**
 * Brute-force throttle.
 *
 * Added when the panel went from one shared login to an account per
 * employee: more accounts means more guessable passwords, and the endpoint
 * previously accepted unlimited attempts at whatever rate a script could
 * manage. Counts are kept in the system temp directory rather than a table
 * so there is no migration to forget, and they are keyed on the username as
 * well as the address so one attacker cannot lock out a real employee from
 * a different IP.
 */
const LOGIN_MAX_ATTEMPTS = 8;
const LOGIN_LOCKOUT_SECONDS = 900;

function login_throttle_file($username) {
    $key = hash('sha256', strtolower(trim($username)) . '|' . ($_SERVER['REMOTE_ADDR'] ?? ''));
    return sys_get_temp_dir() . '/elevaite-login-' . $key;
}

/** Seconds left on a lockout, or 0 when the caller may try again. */
function login_lockout_remaining($username) {
    $file = login_throttle_file($username);
    if (!is_readable($file)) {
        return 0;
    }

    $state = json_decode((string) file_get_contents($file), true);
    if (!is_array($state)) {
        return 0;
    }

    // The window is measured from the most recent failure, so attempts have
    // to stop entirely for it to clear.
    $age = time() - (int) ($state['at'] ?? 0);
    if ($age >= LOGIN_LOCKOUT_SECONDS) {
        @unlink($file);
        return 0;
    }

    return ((int) ($state['n'] ?? 0)) >= LOGIN_MAX_ATTEMPTS
        ? LOGIN_LOCKOUT_SECONDS - $age
        : 0;
}

function login_record_failure($username) {
    $file = login_throttle_file($username);
    $state = is_readable($file) ? json_decode((string) file_get_contents($file), true) : null;
    $n = is_array($state) && (time() - (int) ($state['at'] ?? 0)) < LOGIN_LOCKOUT_SECONDS
        ? (int) $state['n']
        : 0;

    @file_put_contents($file, json_encode(['n' => $n + 1, 'at' => time()]), LOCK_EX);
    @chmod($file, 0600);
}

function login_clear_failures($username) {
    @unlink(login_throttle_file($username));
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);
$username_input = $input['username'] ?? '';
$password_input = $input['password'] ?? '';

if (empty($username_input) || empty($password_input)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing credentials"]);
    exit();
}

$locked = login_lockout_remaining($username_input);
if ($locked > 0) {
    http_response_code(429);
    header('Retry-After: ' . $locked);
    echo json_encode([
        "status" => "error",
        "message" => 'Too many failed attempts. Try again in ' . ceil($locked / 60) . ' minutes.',
    ]);
    exit();
}

try {
    $stmt = $db->prepare("SELECT * FROM admins WHERE username = :username");
    $stmt->execute(['username' => $username_input]);
    $admin = $stmt->fetch();

    if ($admin && password_verify($password_input, $admin['password'])) {
        login_clear_failures($username_input);

        // Establish the server-side session the rest of the API checks.
        start_admin_session();
        session_regenerate_id(true);
        $_SESSION['admin_id'] = $admin['id'];
        $_SESSION['admin_username'] = $admin['username'];
        // Absent until migration 004 runs; treat an account with no role as a
        // full admin, which is what every existing login was.
        $_SESSION['admin_role'] = $admin['role'] ?? 'admin';

        echo json_encode([
            "status" => "success",
            "message" => "Login successful",
            "user" => [
                "id" => $admin['id'],
                "username" => $admin['username'],
                "role" => $_SESSION['admin_role'],
            ]
        ]);
    } else {
        login_record_failure($username_input);
        // Same response for unknown user and wrong password.
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Invalid username or password"]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => ELEVAITE_CONFIG['debug'] ? "Database error: " . $e->getMessage() : "Login failed",
    ]);
}
