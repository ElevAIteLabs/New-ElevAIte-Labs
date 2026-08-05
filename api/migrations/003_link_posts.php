<?php
/**
 * Adds contextual links inside article bodies.
 *
 * Every post referenced our projects in bold and linked to nothing, so the
 * only internal links on an article were the sitewide nav and footer - which
 * are boilerplate and carry very little weight. Body links from relevant
 * prose are the strongest internal signal a site has, and there were none.
 *
 * Conservative by design: only the FIRST mention of each known project is
 * linked, so an article gains a few descriptive links rather than reading
 * like a link farm. Re-running is safe because an already-linked mention no
 * longer matches the pattern.
 *
 * Usage (on the server):  php 003_link_posts.php ../config.php
 */

$config = require $argv[1];
$db = new PDO(
    "mysql:host={$config['db']['host']};dbname={$config['db']['name']};charset=utf8mb4",
    $config['db']['user'],
    $config['db']['password'],
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
);

// Case study names as they appear in the copy, linked to the portfolio.
$projects = [
    'Email-to-Email Workflow via Monday.com',
    'Intelligent SMS Lead Engagement via HubSpot',
    'WhatsApp Automation for Kredoo CRM',
    'AI-Powered Social Media Content Automation',
    'Certification Issuance Automation',
    'AI-Powered Lead Coordinator',
    'Content Generation Platform',
    'GenZ IQ Learning',
    'SmartDoc OCR',
    'SmartDoc',
    'Chaitanyamrutha',
    'Sree Nandas',
    'Mamma Magic',
    'Bee Echoo',
    'Knowva',
    'Benri',
];

$posts = $db->query('SELECT id, slug, content FROM posts')->fetchAll(PDO::FETCH_ASSOC);
$totalAdded = 0;

foreach ($posts as $post) {
    $content = $post['content'];
    $added = 0;

    foreach ($projects as $name) {
        // Only a bold mention that is not already wrapped in a link.
        $needle = '<strong>' . $name . '</strong>';
        $pos = strpos($content, $needle);
        if ($pos === false) continue;

        // Skip if this mention already sits inside an anchor.
        $before = substr($content, max(0, $pos - 60), 60);
        if (strpos($before, '<a href=') !== false) continue;

        $content = substr_replace(
            $content,
            '<strong><a href="/work">' . $name . '</a></strong>',
            $pos,
            strlen($needle)
        );
        $added++;
    }

    if ($added > 0) {
        $stmt = $db->prepare('UPDATE posts SET content = :c WHERE id = :id');
        $stmt->execute(['c' => $content, 'id' => $post['id']]);
        $totalAdded += $added;
        printf("  %-42s +%d\n", $post['slug'], $added);
    }
}

echo "\n  linked $totalAdded project mentions across " . count($posts) . " posts\n";
