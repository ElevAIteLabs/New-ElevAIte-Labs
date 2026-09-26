<?php
/**
 * Everything Arkin is allowed to know, assembled from the database.
 *
 * The whole corpus - six services, sixteen case studies, the product, and
 * all sixteen articles in full - measures about twenty thousand tokens.
 * That fits in a single request with room to spare, which is why there is
 * no vector database here and no retrieval step.
 *
 * That is a deliberate choice, not a shortcut. Retrieval answers from a
 * handful of chunks and hopes they are the right ones; when it misses,
 * Arkin says it does not know about something the company has published a
 * guide on. Sending everything removes that failure mode, and the provider
 * bills repeated identical prefixes at a fraction of the normal rate, so it
 * is also the cheaper option at this size.
 *
 * Rebuilt from MySQL on a TTL rather than baked into the deploy, so an
 * article published through the admin panel reaches Arkin without anyone
 * touching code.
 */

const CHAT_KB_TTL = 900;

/** Strip authored HTML down to the prose Arkin should read. */
function kb_text($html, $limit = 0) {
    $text = preg_replace('#<(script|style)\b[^>]*>.*?</\1>#is', ' ', (string) $html);
    $text = preg_replace('#<[^>]+>#', ' ', $text);
    $text = html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $text = preg_replace('/\s+/u', ' ', $text);
    $text = trim($text);
    return $limit > 0 ? mb_substr($text, 0, $limit) : $text;
}

/** Build the knowledge base from the live database. */
function build_chat_knowledge(PDO $db) {
    $out = [];

    $out[] = "# ElevAIte Labs\n";
    $out[] = "An AI automation and product studio in HITEC City, Hyderabad, India. "
        . "Founded 2025. Builds AI workflow automations, custom AI agents, lead "
        . "generation systems, web and mobile applications, and AI content "
        . "pipelines. Works with clients across India and internationally "
        . "(US, UK, Canada, Australia, Singapore).\n";
    $out[] = "Contact: contact@elevaitelabs.in | +91 75699 54054 | "
        . "https://elevaitelabs.in/contact\n";

    try {
        $rows = $db->query('SELECT title, description, features FROM services')->fetchAll(PDO::FETCH_ASSOC);
        if ($rows) {
            $out[] = "\n# Services\n";
            foreach ($rows as $r) {
                $features = json_decode((string) $r['features'], true);
                $out[] = '## ' . $r['title'] . "\n" . kb_text($r['description'])
                    . (is_array($features) && $features ? "\nIncludes: " . implode(', ', $features) : '')
                    . "\n";
            }
        }
    } catch (Exception $e) { /* a missing table must not break the chat */ }

    try {
        $rows = $db->query('SELECT title, description, industry, category FROM work')->fetchAll(PDO::FETCH_ASSOC);
        if ($rows) {
            $out[] = "\n# Projects we have delivered\n";
            foreach ($rows as $r) {
                $out[] = '- ' . $r['title'] . ' (' . ($r['industry'] ?: $r['category']) . '): '
                    . kb_text($r['description'], 400);
            }
            $out[] = '';
        }
    } catch (Exception $e) { /* ignore */ }

    try {
        $rows = $db->query('SELECT name, description, price, features FROM products')->fetchAll(PDO::FETCH_ASSOC);
        if ($rows) {
            $out[] = "\n# Our own products\n";
            foreach ($rows as $r) {
                $features = json_decode((string) $r['features'], true);
                $out[] = '## ' . $r['name'] . "\n" . kb_text($r['description'])
                    . ($r['price'] ? "\nPrice: " . $r['price'] : '')
                    . (is_array($features) && $features ? "\nFeatures: " . implode(', ', $features) : '')
                    . "\n";
            }
        }
    } catch (Exception $e) { /* ignore */ }

    // Articles carry the pricing guidance and the technical detail, so they
    // go in whole rather than as excerpts - this is the part that lets Arkin
    // answer "what would it cost" with a real published number instead of a
    // guess, and cite where the number came from.
    try {
        $rows = $db->query(
            "SELECT slug, title, excerpt, content FROM posts
             WHERE status = 'published'
             ORDER BY COALESCE(published_at, created_at) DESC"
        )->fetchAll(PDO::FETCH_ASSOC);

        if ($rows) {
            $out[] = "\n# Published articles\n";
            $out[] = "Link to these as https://elevaitelabs.in/learn/<slug> when relevant.\n";
            foreach ($rows as $r) {
                $out[] = '## ' . $r['title'] . ' [slug: ' . $r['slug'] . "]\n"
                    . kb_text($r['excerpt']) . "\n" . kb_text($r['content']) . "\n";
            }
        }
    } catch (Exception $e) { /* ignore */ }

    return implode("\n", $out);
}

/**
 * The knowledge base, from a cache file when it is fresh.
 *
 * Kept outside the document root: the file is a concatenation of public
 * content, but nothing the API writes belongs anywhere Apache might serve.
 */
function chat_knowledge(PDO $db) {
    $cache = sys_get_temp_dir() . '/elevaite-chat-kb.txt';

    if (is_readable($cache) && (time() - filemtime($cache)) < CHAT_KB_TTL) {
        $cached = file_get_contents($cache);
        if ($cached !== false && $cached !== '') {
            return $cached;
        }
    }

    $kb = build_chat_knowledge($db);
    @file_put_contents($cache, $kb, LOCK_EX);
    @chmod($cache, 0600);
    return $kb;
}
