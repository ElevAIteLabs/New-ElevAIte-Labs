<?php
require_once __DIR__ . '/auth.php';

send_cors_headers();

$config = ELEVAITE_CONFIG;
$dbConf = $config['db'];

try {
    $db = new PDO(
        "mysql:host={$dbConf['host']};dbname={$dbConf['name']};charset=utf8mb4",
        $dbConf['user'],
        $dbConf['password']
    );
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => $config['debug']
            ? 'Database connection failed: ' . $e->getMessage()
            : 'Database connection failed',
    ]);
    exit();
}

/** Tables this API is allowed to touch. */
const ALLOWED_TABLES = ['products', 'services', 'work', 'learn', 'testimonials', 'contact', 'posts'];

/**
 * Real column names for a table, read from the live schema.
 * Used to reject attacker-controlled JSON keys before they reach SQL.
 */
function table_columns(PDO $db, $table) {
    static $cache = [];
    if (!isset($cache[$table])) {
        $stmt = $db->query("SHOW COLUMNS FROM `$table`");
        $cache[$table] = array_column($stmt->fetchAll(PDO::FETCH_ASSOC), 'Field');
    }
    return $cache[$table];
}

function handleCrud($db, $table) {
    if (!in_array($table, ALLOWED_TABLES, true)) {
        http_response_code(400);
        echo json_encode(['error' => 'Unknown resource']);
        exit();
    }

    $method = $_SERVER['REQUEST_METHOD'];

    // Reads stay public (the site renders from them); writes require an admin session.
    if ($method !== 'GET') {
        require_admin();
    }

    // An endpoint may pre-process the body (posts.php normalises the slug);
    // php://input cannot be re-read after that, so it hands the result over.
    $input = $GLOBALS['ELEVAITE_INPUT_OVERRIDE']
        ?? json_decode(file_get_contents('php://input'), true);

    if ($method !== 'GET' && $method !== 'DELETE' && !is_array($input)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON body']);
        exit();
    }

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

            $allowed = table_columns($db, $table);
            $columns = [];
            $values = [];
            $params = [];
            foreach ($input as $key => $value) {
                if ($key === 'id') continue;
                if (!in_array($key, $allowed, true)) continue;
                $columns[] = "`$key`";
                $values[] = ":$key";
                $params[$key] = is_array($value) ? json_encode($value) : $value;
            }

            if (empty($columns)) {
                http_response_code(400);
                echo json_encode(['error' => 'No valid fields supplied']);
                exit();
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

            if (!$id) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing id']);
                exit();
            }

            $allowed = table_columns($db, $table);
            $updates = [];
            $params = ['id' => $id];
            foreach ($input as $key => $value) {
                if ($key === 'id') continue;
                if (!in_array($key, $allowed, true)) continue;
                $updates[] = "`$key` = :$key";
                $params[$key] = is_array($value) ? json_encode($value) : $value;
            }

            if (empty($updates)) {
                http_response_code(400);
                echo json_encode(['error' => 'No valid fields supplied']);
                exit();
            }

            $sql = "UPDATE $table SET " . implode(', ', $updates) . " WHERE id = :id";
            $stmt = $db->prepare($sql);
            $stmt->execute($params);

            echo json_encode($input);

        } elseif ($method === 'DELETE') {
            if ($table === 'contact') {
                http_response_code(405); exit();
            }

            if (!$id) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing id']);
                exit();
            }

            $stmt = $db->prepare("DELETE FROM $table WHERE id = :id");
            $stmt->execute(['id' => $id]);

            http_response_code(204);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'error' => ELEVAITE_CONFIG['debug'] ? $e->getMessage() : 'Request failed',
        ]);
    }
}
