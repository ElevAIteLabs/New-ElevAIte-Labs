<?php
require_once __DIR__ . '/db.php';

/**
 * Blog posts for the Learn page.
 *
 * Reads are handled here rather than by handleCrud because drafts must stay
 * private: anonymous callers only ever see status = 'published'. Writes fall
 * through to handleCrud, which enforces the admin session and the column
 * whitelist.
 */

/** Turn a title into a URL-safe slug. */
function slugify($text) {
    $slug = strtolower(trim((string) $text));
    $slug = preg_replace('/[^a-z0-9]+/', '-', $slug);
    return trim($slug, '-');
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $isAdmin = is_admin();

    try {
        // Single post by slug - how /learn/:slug fetches its content.
        if (isset($_GET['slug'])) {
            $sql = 'SELECT * FROM posts WHERE slug = :slug';
            if (!$isAdmin) {
                $sql .= " AND status = 'published'";
            }
            $stmt = $db->prepare($sql);
            $stmt->execute(['slug' => $_GET['slug']]);
            $post = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$post) {
                http_response_code(404);
                echo json_encode(['error' => 'Post not found']);
                exit();
            }

            echo json_encode($post);
            exit();
        }

        if (isset($_GET['id'])) {
            $stmt = $db->prepare('SELECT * FROM posts WHERE id = :id');
            $stmt->execute(['id' => $_GET['id']]);
            echo json_encode($stmt->fetch(PDO::FETCH_ASSOC) ?: null);
            exit();
        }

        // Listing. The admin panel needs drafts too, so it asks for everything.
        $sql = 'SELECT id, slug, title, excerpt, image, author, read_time, tag, status, published_at FROM posts';
        if (!$isAdmin) {
            $sql .= " WHERE status = 'published'";
        }
        $sql .= ' ORDER BY COALESCE(published_at, created_at) DESC, id DESC';

        echo json_encode($db->query($sql)->fetchAll(PDO::FETCH_ASSOC));
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => ELEVAITE_CONFIG['debug'] ? $e->getMessage() : 'Request failed']);
    }
    exit();
}

// Writes: fill in a slug when the admin left it blank, and fail with a clear
// message on collision rather than letting the UNIQUE index surface as a 500.
if (in_array($_SERVER['REQUEST_METHOD'], ['POST', 'PUT', 'PATCH'], true)) {
    require_admin();

    $input = json_decode(file_get_contents('php://input'), true);
    if (is_array($input)) {
        $slug = trim((string) ($input['slug'] ?? ''));
        if ($slug === '') {
            $slug = slugify($input['title'] ?? '');
        } else {
            $slug = slugify($slug);
        }

        if ($slug === '') {
            http_response_code(400);
            echo json_encode(['error' => 'A title or slug is required']);
            exit();
        }

        $id = $_GET['id'] ?? null;
        $check = $db->prepare('SELECT id FROM posts WHERE slug = :slug' . ($id ? ' AND id <> :id' : ''));
        $check->execute($id ? ['slug' => $slug, 'id' => $id] : ['slug' => $slug]);

        if ($check->fetch()) {
            http_response_code(409);
            echo json_encode(['error' => "The slug \"$slug\" is already used by another post"]);
            exit();
        }

        $input['slug'] = $slug;

        // handleCrud re-reads php://input, which cannot be rewritten, so hand
        // it the normalised payload directly.
        $GLOBALS['ELEVAITE_INPUT_OVERRIDE'] = $input;
    }
}

handleCrud($db, 'posts');
