<?php
require_once __DIR__ . '/db.php';

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

try {
    $stmt = $db->prepare("SELECT * FROM admins WHERE username = :username");
    $stmt->execute(['username' => $username_input]);
    $admin = $stmt->fetch();

    if ($admin && password_verify($password_input, $admin['password'])) {
        // Establish the server-side session the rest of the API checks.
        start_admin_session();
        session_regenerate_id(true);
        $_SESSION['admin_id'] = $admin['id'];
        $_SESSION['admin_username'] = $admin['username'];

        echo json_encode([
            "status" => "success",
            "message" => "Login successful",
            "user" => [
                "id" => $admin['id'],
                "username" => $admin['username']
            ]
        ]);
    } else {
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
