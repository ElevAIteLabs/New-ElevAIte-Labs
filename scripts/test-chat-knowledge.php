<?php
/**
 * Checks what Arkin is given to answer from.
 *
 * The knowledge base is the whole of Arkin's accuracy: anything missing
 * here, he does not know, and anything wrong here, he will state as fact.
 * It is built by string concatenation from five tables, so a renamed column
 * or an empty result degrades it silently rather than erroring - which is
 * exactly the kind of failure nobody notices until a prospect is told the
 * company does not do something it does.
 *
 * Runs against SQLite in memory, so it needs no MySQL and no config.php.
 */

if (PHP_SAPI !== 'cli') { exit(1); }

require __DIR__ . '/../api/chat-knowledge.php';

$db = new PDO('sqlite::memory:');
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

$db->exec('CREATE TABLE services (title TEXT, description TEXT, features TEXT)');
$db->exec('CREATE TABLE work (title TEXT, description TEXT, industry TEXT, category TEXT)');
$db->exec('CREATE TABLE products (name TEXT, description TEXT, price TEXT, features TEXT)');
$db->exec('CREATE TABLE posts (slug TEXT, title TEXT, excerpt TEXT, content TEXT, status TEXT, published_at TEXT, created_at TEXT)');

$db->exec("INSERT INTO services VALUES
    ('AI Automation & Workflows', '<p>We build n8n workflows that remove manual steps.</p>', '[\"n8n\",\"Zapier\"]')");
$db->exec("INSERT INTO work VALUES
    ('Kredoo CRM', '<p>Auto-captures Meta Ads leads.</p>', 'Fintech', 'web-app')");
$db->exec("INSERT INTO products VALUES
    ('Kredoo', '<p>A sales CRM.</p>', 'From INR 25,000', '[\"WhatsApp\"]')");
$db->exec("INSERT INTO posts VALUES
    ('ai-automation-cost-india', 'What AI Automation Actually Costs in India',
     'Real numbers.', '<h2>Cost</h2><p>A simple workflow runs INR 40,000.</p><script>alert(1)</script>',
     'published', '2026-08-20', '2026-08-20')");
$db->exec("INSERT INTO posts VALUES
    ('a-draft', 'Unfinished Draft', 'Not ready.', '<p>Secret internal pricing.</p>',
     'draft', NULL, '2026-08-21')");

$kb = build_chat_knowledge($db);

$CHECKS = [
    'names the company'            => fn() => str_contains($kb, 'ElevAIte Labs'),
    'gives the contact address'    => fn() => str_contains($kb, 'contact@elevaitelabs.in'),
    'includes services'            => fn() => str_contains($kb, 'AI Automation & Workflows'),
    'includes service features'    => fn() => str_contains($kb, 'n8n, Zapier'),
    'includes case studies'        => fn() => str_contains($kb, 'Kredoo CRM') && str_contains($kb, 'Fintech'),
    'includes products and price'  => fn() => str_contains($kb, 'From INR 25,000'),
    'includes published articles'  => fn() => str_contains($kb, 'What AI Automation Actually Costs'),
    'includes article bodies'      => fn() => str_contains($kb, 'A simple workflow runs INR 40,000'),
    'carries slugs for linking'    => fn() => str_contains($kb, 'slug: ai-automation-cost-india'),

    // The two that matter most.
    'EXCLUDES drafts'              => fn() => !str_contains($kb, 'Secret internal pricing'),
    'strips script tags'           => fn() => !str_contains($kb, 'alert(1)'),
    'strips all HTML'              => fn() => !preg_match('/<(p|h2|div|script)\b/i', $kb),
];

echo "\nArkin knowledge base\n\n";
$fail = 0;
foreach ($CHECKS as $name => $fn) {
    $ok = false;
    try { $ok = $fn(); } catch (Throwable $e) { $ok = false; }
    if (!$ok) { $fail++; }
    printf("  %-4s  %s\n", $ok ? 'ok' : 'FAIL', $name);
}

// A table the deploy has not migrated yet must degrade, not fatal.
$bare = new PDO('sqlite::memory:');
$bare->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$degraded = null;
try {
    $degraded = build_chat_knowledge($bare);
} catch (Throwable $e) {
    $degraded = null;
}
$ok = is_string($degraded) && str_contains($degraded, 'ElevAIte Labs');
if (!$ok) { $fail++; }
printf("  %-4s  %s\n", $ok ? 'ok' : 'FAIL', 'survives missing tables');

$count = count($CHECKS) + 1;
echo $fail ? "\n$fail of $count failed.\n\n" : "\nAll $count passed.\n\n";
exit($fail ? 1 : 0);
