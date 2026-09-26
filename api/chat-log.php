<?php
/**
 * Chat transcripts, for the admin panel.
 *
 * Admin-only and read-only. These are conversations with real visitors, so
 * they sit behind the same guard as enquiries rather than the public read
 * the content tables use - and writers have no business in them, so it is
 * the full-admin guard.
 *
 * What people actually ask is the best content and SEO research available,
 * which is why the transcripts are kept at all.
 */
require_once __DIR__ . '/db.php';

send_cors_headers('GET, OPTIONS');
require_full_admin();

try {
    // One conversation in full.
    if (isset($_GET['id'])) {
        $stmt = $db->prepare('SELECT * FROM chat_conversations WHERE id = :id');
        $stmt->execute(['id' => (int) $_GET['id']]);
        $conversation = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$conversation) {
            http_response_code(404);
            echo json_encode(['error' => 'Not found']);
            exit();
        }

        // The hash is here to tell visitors apart, not to expose to a UI.
        unset($conversation['ip_hash']);

        $msgs = $db->prepare(
            'SELECT role, content, created_at FROM chat_messages
             WHERE conversation_id = :c ORDER BY id ASC'
        );
        $msgs->execute(['c' => $conversation['id']]);

        echo json_encode($conversation + ['messages' => $msgs->fetchAll(PDO::FETCH_ASSOC)]);
        exit();
    }

    // Listing, newest first, with the opening question as the summary - it
    // is what makes a row worth clicking.
    $rows = $db->query(
        "SELECT c.id, c.entry_path, c.turns, c.lead_id, c.created_at,
                l.name AS lead_name, l.email AS lead_email,
                (SELECT m.content FROM chat_messages m
                  WHERE m.conversation_id = c.id AND m.role = 'user'
                  ORDER BY m.id ASC LIMIT 1) AS opening
         FROM chat_conversations c
         LEFT JOIN leads l ON l.id = c.lead_id
         WHERE c.turns > 0
         ORDER BY c.id DESC
         LIMIT 200"
    )->fetchAll(PDO::FETCH_ASSOC);

    $usage = $db->query('SELECT * FROM chat_usage ORDER BY ym DESC LIMIT 6')->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['conversations' => $rows, 'usage' => $usage]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => ELEVAITE_CONFIG['debug'] ? $e->getMessage() : 'Request failed']);
}
