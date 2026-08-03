<?php
require_once __DIR__ . '/db.php';

/**
 * Captured contact form submissions.
 *
 * Unlike the content tables, reads here require an admin session. This data is
 * personal information from members of the public, so handleCrud's public GET
 * is deliberately not used.
 */

send_cors_headers('GET, DELETE, OPTIONS');
require_admin();

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $stmt = $db->query(
            'SELECT id, name, email, phone, company, role, service, budget, message,
                    mail_status, mail_error, webhook_status, webhook_error, created_at
             FROM leads ORDER BY created_at DESC, id DESC LIMIT 500'
        );
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        exit();
    }

    if ($method === 'DELETE') {
        $id = $_GET['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing id']);
            exit();
        }
        $db->prepare('DELETE FROM leads WHERE id = :id')->execute(['id' => $id]);
        http_response_code(204);
        exit();
    }

    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => ELEVAITE_CONFIG['debug'] ? $e->getMessage() : 'Request failed']);
}
