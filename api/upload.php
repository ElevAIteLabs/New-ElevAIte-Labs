<?php
require_once __DIR__ . '/auth.php';

send_cors_headers('POST, OPTIONS');

// Uploads write into the public web root — admins only.
require_admin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit();
}

$targetDir = __DIR__ . '/../pictures/';

if (!file_exists($targetDir)) {
    mkdir($targetDir, 0755, true);
}

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "No file uploaded."]);
    exit();
}

$maxBytes = 5 * 1024 * 1024;
if ($_FILES['file']['size'] > $maxBytes) {
    http_response_code(413);
    echo json_encode(["status" => "error", "message" => "File exceeds the 5 MB limit."]);
    exit();
}

// SVG is deliberately excluded: it can carry inline scripts and would be
// served from our own origin, making it a stored-XSS vector.
$allowTypes = ['jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'png' => 'image/png',
               'gif' => 'image/gif', 'webp' => 'image/webp'];

$extension = strtolower(pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION));
if (!isset($allowTypes[$extension])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid file type."]);
    exit();
}

// Trust the decoded image, not the client-supplied name or MIME header.
$info = @getimagesize($_FILES['file']['tmp_name']);
if ($info === false || !in_array($info['mime'], $allowTypes, true)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "File is not a valid image."]);
    exit();
}

// Rebuild the filename so a caller can never traverse or overwrite arbitrary paths.
$base = pathinfo($_FILES['file']['name'], PATHINFO_FILENAME);
$base = preg_replace('/[^A-Za-z0-9_-]/', '-', $base);
$base = trim(substr($base, 0, 60), '-');
if ($base === '') {
    $base = 'upload';
}

$fileName = $base . '.' . $extension;
$counter = 1;
while (file_exists($targetDir . $fileName)) {
    $fileName = $base . '-' . $counter . '.' . $extension;
    $counter++;
}

if (move_uploaded_file($_FILES['file']['tmp_name'], $targetDir . $fileName)) {
    echo json_encode(["status" => "success", "fileName" => $fileName]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to upload file."]);
}
