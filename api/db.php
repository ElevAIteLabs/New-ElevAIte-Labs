<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// MySQL Configuration - Updated based on your hosting screenshots
$host = 'localhost'; // Usually localhost on Hostinger/Shared hosting
$dbname = 'u674592973_ElevAIteLabs';
$username = 'u674592973_elevaite';
$password = 'Elevaite@2026'; // INSERT YOUR DATABASE PASSWORD HERE

try {
    $db = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $e->getMessage()]);
    exit();
}

function handleCrud($db, $table) {
    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'), true);
    $id = isset($_GET['id']) ? $_GET['id'] : null;

    try {
        if ($method === 'GET') {
            if ($table === 'contact') {
                $stmt = $db->query("SELECT * FROM contact WHERE id = 1");
                echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
            } else {
                if ($id) {
                    $stmt = $db->prepare("SELECT * FROM $table WHERE id = :id");
                    $stmt->execute(['id' => $id]);
                    $result = $stmt->fetch(PDO::FETCH_ASSOC);
                    if (($table === 'products' || $table === 'services') && $result) {
                        $result['features'] = json_decode($result['features'], true);
                    }
                    echo json_encode($result);
                } else {
                    $stmt = $db->query("SELECT * FROM $table");
                    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    if ($table === 'products' || $table === 'services') {
                        foreach ($results as &$r) {
                            $r['features'] = json_decode($r['features'], true);
                        }
                    }
                    echo json_encode($results);
                }
            }
        } elseif ($method === 'POST') {
            if ($table === 'contact') {
                http_response_code(405); exit();
            }
            
            $columns = [];
            $values = [];
            $params = [];
            foreach ($input as $key => $value) {
                if ($key === 'id') continue;
                $columns[] = $key;
                $values[] = ":$key";
                $params[$key] = is_array($value) ? json_encode($value) : $value;
            }
            
            $sql = "INSERT INTO $table (" . implode(', ', $columns) . ") VALUES (" . implode(', ', $values) . ")";
            $stmt = $db->prepare($sql);
            $stmt->execute($params);
            $input['id'] = $db->lastInsertId();
            
            http_response_code(201);
            echo json_encode($input);
            
        } elseif ($method === 'PUT' || $method === 'PATCH') {
            if ($table === 'contact') {
                $id = 1;
            }
            
            $updates = [];
            $params = ['id' => $id];
            foreach ($input as $key => $value) {
                if ($key === 'id') continue;
                $updates[] = "$key = :$key";
                $params[$key] = is_array($value) ? json_encode($value) : $value;
            }
            
            $sql = "UPDATE $table SET " . implode(', ', $updates) . " WHERE id = :id";
            $stmt = $db->prepare($sql);
            $stmt->execute($params);
            
            echo json_encode($input);
            
        } elseif ($method === 'DELETE') {
            if ($table === 'contact') {
                http_response_code(405); exit();
            }
            
            $stmt = $db->prepare("DELETE FROM $table WHERE id = :id");
            $stmt->execute(['id' => $id]);
            
            http_response_code(204);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
}
