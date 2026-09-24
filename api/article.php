<?php
/**
 * Server-rendered article page for a post that has no prerendered file yet.
 *
 * Why this exists: .htaccess only serves a route when a prerendered
 * index.html is on disk, and anything else falls through to a hard 404. So
 * until this file existed, a post published from the admin panel sat in the
 * database while its URL returned 404 to every visitor and to Google, until
 * somebody happened to run a build. Employees publishing their own articles
 * makes that gap unacceptable.
 *
 * Apache routes /learn/<slug> here only when dist has no prerendered copy,
 * so this never competes with the build output - it covers the window
 * between publishing and the next deploy. The next build prerenders the post
 * properly and takes over the URL again with no change here.
 *
 * It renders the head tags and the article body itself rather than serving
 * the SPA shell, because a shell would hand Googlebot an empty page and make
 * every freshly published article depend on JavaScript rendering. The markup
 * mirrors src/pages/BlogPost.jsx closely enough that the page is complete on
 * arrival; React then boots over the top and takes it from there.
 */
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/article-render.php';

header_remove('Content-Type');
header('Content-Type: text/html; charset=utf-8');
// The prerendered copy is the canonical rendering; this one must never be
// cached long enough to outlive the deploy that replaces it.
header('Cache-Control: public, max-age=0, must-revalidate');

function send_404($message = 'Article not found') {
    http_response_code(404);
    $file = dirname(__DIR__) . '/404.html';
    echo is_readable($file)
        ? file_get_contents($file)
        : '<!doctype html><meta name="robots" content="noindex, follow"><title>' . e($message) . '</title><h1>' . e($message) . '</h1>';
    exit();
}

$slug = (string) ($_GET['slug'] ?? '');
if ($slug === '' || !preg_match('/^[A-Za-z0-9-]{1,191}$/', $slug)) {
    send_404();
}

try {
    $stmt = $db->prepare("SELECT * FROM posts WHERE slug = :slug AND status = 'published' LIMIT 1");
    $stmt->execute(['slug' => $slug]);
    $post = $stmt->fetch(PDO::FETCH_ASSOC);
} catch (Exception $e) {
    http_response_code(500);
    echo '<!doctype html><title>Error</title><h1>Something went wrong</h1>';
    exit();
}

if (!$post) {
    send_404();
}

$template = dirname(__DIR__) . '/post-template.html';
echo render_article_page($post, $template);

// Recorded last: a failure here must not cost the reader the page.
try {
    $db->prepare('UPDATE posts SET views = views + 1 WHERE id = :id')->execute(['id' => $post['id']]);
} catch (Exception $e) {
    // Non-essential.
}
