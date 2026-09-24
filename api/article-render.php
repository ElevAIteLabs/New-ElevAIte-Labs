<?php
/**
 * Body rendering for api/article.php: heading ids and keyword links.
 *
 * Kept apart from article.php because article.php opens a database
 * connection the moment it is required, and these functions are pure - which
 * is what lets scripts/test-keyword-parity.mjs run them against the same
 * fixtures as the JavaScript implementation and diff the output.
 *
 * The JavaScript twin is src/seo/keywords.js. The two must agree: a reader
 * and a crawler seeing different links on the same URL is worse than the
 * feature not existing at all. The parity test is what keeps them honest.
 */
const SITE_URL = 'https://elevaitelabs.in';
const SITE_NAME = 'ElevAIte Labs';

function e($s) { return htmlspecialchars((string) $s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }

/* ------------------------------------------------------------------ *
 * Keyword links. Mirrors src/seo/keywords.js - same skip list, same
 * first-occurrence-only default. If you change one, change the other:
 * a reader and a crawler must not see different links on one URL.
 * ------------------------------------------------------------------ */

const SKIP_ANCESTORS = ['a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code', 'pre'];

function parse_keywords($raw) {
    if (!is_string($raw) || trim($raw) === '') return [];
    $list = json_decode($raw, true);
    if (!is_array($list)) return [];

    $out = [];
    foreach ($list as $k) {
        $keyword = trim((string) ($k['keyword'] ?? ''));
        $url = trim((string) ($k['url'] ?? ''));
        if ($keyword === '' || $url === '') continue;
        $rel = ($k['rel'] ?? '') === 'nofollow' || ($k['rel'] ?? '') === 'sponsored' ? $k['rel'] : 'dofollow';
        $out[] = ['keyword' => $keyword, 'url' => $url, 'rel' => $rel, 'all' => ($k['all'] ?? false) === true];
    }

    // Longest first, so a specific phrase wins over a shorter one inside it.
    usort($out, fn($a, $b) => mb_strlen($b['keyword']) - mb_strlen($a['keyword']));
    return $out;
}

function is_external($url) {
    return preg_match('#^https?://#i', $url) && !preg_match('#^https?://(www\.)?elevaitelabs\.in#i', $url);
}

function rel_for($url, $rel) {
    if (!is_external($url)) return null;
    $parts = ['noopener'];
    if ($rel === 'nofollow' || $rel === 'sponsored') $parts[] = $rel;
    return implode(' ', $parts);
}

/**
 * Adds an id to every h2 so the table of contents can link to it, and turns
 * configured keywords into links. Returns [html, headings].
 */
function build_body($html, $keywordsRaw) {
    $html = trim((string) $html);
    if ($html === '') return ['', []];

    $keywords = parse_keywords($keywordsRaw);

    $doc = new DOMDocument();
    $prev = libxml_use_internal_errors(true);
    // Author-written HTML is rarely a well-formed document; the wrapper plus
    // the explicit UTF-8 declaration stop DOMDocument mangling accents.
    $doc->loadHTML(
        '<?xml encoding="utf-8" ?><div id="elevaite-root">' . $html . '</div>',
        LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD
    );
    libxml_clear_errors();
    libxml_use_internal_errors($prev);

    $root = $doc->getElementById('elevaite-root');
    if (!$root) return [$html, []];

    $xpath = new DOMXPath($doc);

    // Headings first: ids must exist before anything else rewrites the tree.
    $headings = [];
    $used = [];
    foreach (iterator_to_array($xpath->query('.//h2', $root)) as $h) {
        $text = trim($h->textContent);
        if ($text === '') continue;

        $id = trim(preg_replace('/[^a-z0-9]+/', '-', strtolower($text)), '-');
        if ($id === '') $id = 'section';
        $base = $id;
        $n = 2;
        while (isset($used[$id])) { $id = $base . '-' . $n++; }
        $used[$id] = true;

        $h->setAttribute('id', $id);
        $headings[] = ['id' => $id, 'text' => $text];
    }

    foreach ($keywords as $entry) {
        // \b is ASCII-only, which is correct here: the keywords are English
        // search phrases. /u keeps the surrounding text's UTF-8 intact.
        $re = '/\b' . preg_quote($entry['keyword'], '/') . '\b/iu';
        $done = false;

        // Collected up front: replacing a node invalidates a live node list.
        foreach (iterator_to_array($xpath->query('.//text()', $root)) as $node) {
            if ($done) break;
            if (!preg_match($re, $node->nodeValue)) continue;

            $skip = false;
            for ($p = $node->parentNode; $p && $p !== $root; $p = $p->parentNode) {
                if (in_array(strtolower($p->nodeName), SKIP_ANCESTORS, true)) { $skip = true; break; }
            }
            if ($skip) continue;

            // Split keeps the matched text so each link shows the casing the
            // author actually wrote, not the casing configured in the editor.
            $limit = $entry['all'] ? -1 : 2;
            $pieces = preg_split($re, $node->nodeValue, $limit, PREG_SPLIT_DELIM_CAPTURE);
            preg_match_all($re, $node->nodeValue, $matches);

            $frag = $doc->createDocumentFragment();
            $seen = 0;
            foreach ($pieces as $i => $piece) {
                $frag->appendChild($doc->createTextNode($piece));
                // A link goes between every pair of pieces, never after the last.
                if ($i < count($pieces) - 1) {
                    $a = $doc->createElement('a');
                    $a->setAttribute('href', $entry['url']);
                    $a->appendChild($doc->createTextNode($matches[0][$seen] ?? $entry['keyword']));
                    if (($rel = rel_for($entry['url'], $entry['rel'])) !== null) {
                        $a->setAttribute('rel', $rel);
                        $a->setAttribute('target', '_blank');
                    }
                    $frag->appendChild($a);
                    $seen++;
                }
            }

            $node->parentNode->replaceChild($frag, $node);
            if (!$entry['all']) $done = true;
        }
    }

    $out = '';
    foreach ($root->childNodes as $child) {
        $out .= $doc->saveHTML($child);
    }
    return [$out, $headings];
}


/**
 * The complete HTML for one article.
 *
 * Takes the post row and the path to the template scripts/prerender.mjs
 * wrote from the current build, and returns a finished page. Pure, so
 * scripts/test-article-render.mjs can assert on the metadata Google reads
 * without standing up MySQL.
 */
function render_article_page(array $post, $templatePath) {
    [$bodyHtml, $headings] = build_body($post['content'] ?? '', $post['keywords'] ?? null);

    /* --------------------------------------------------------------- *
     * Head metadata. Mirrors src/pages/BlogPost.jsx.
     * --------------------------------------------------------------- */

    $canonical   = SITE_URL . '/learn/' . $post['slug'];
    $title       = trim((string) ($post['meta_title'] ?? '')) !== ''
        ? $post['meta_title']
        : ($post['title'] . ' | ' . SITE_NAME);
    $description = mb_substr(trim((string) ($post['excerpt'] ?? '')), 0, 300);

    $image = trim((string) ($post['image'] ?? ''));
    if ($image === '') {
        $cover = SITE_URL . '/pictures/logo.png';
    } elseif (preg_match('#^https?://#i', $image)) {
        $cover = $image;
    } else {
        $cover = SITE_URL . '/pictures/' . ltrim($image, '/');
    }

    $schema = [
        '@context' => 'https://schema.org',
        '@type' => 'BlogPosting',
        'headline' => $post['title'],
        'description' => $description,
        'image' => [$cover],
        'datePublished' => $post['published_at'] ?: null,
        'dateModified' => $post['updated_at'] ?: ($post['published_at'] ?: null),
        'author' => [
            '@type' => $post['author'] ? 'Person' : 'Organization',
            'name' => $post['author'] ?: SITE_NAME,
        ],
        'publisher' => ['@id' => SITE_URL . '/#organization'],
        'mainEntityOfPage' => ['@type' => 'WebPage', '@id' => $canonical],
    ];
    $schema = array_filter($schema, fn($v) => $v !== null);

    $breadcrumb = [
        '@context' => 'https://schema.org',
        '@type' => 'BreadcrumbList',
        'itemListElement' => [
            ['@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => SITE_URL . '/'],
            ['@type' => 'ListItem', 'position' => 2, 'name' => 'Learn', 'item' => SITE_URL . '/learn'],
            ['@type' => 'ListItem', 'position' => 3, 'name' => $post['title'], 'item' => $canonical],
        ],
    ];

    $jsonFlags = JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP;

    $head = '
    <title data-seo="1">' . e($title) . '</title>
    <meta data-seo="1" name="description" content="' . e($description) . '" />
    <link data-seo="1" rel="canonical" href="' . e($canonical) . '" />
    <meta data-seo="1" name="robots" content="index, follow, max-image-preview:large" />
    <meta data-seo="1" property="og:type" content="article" />
    <meta data-seo="1" property="og:site_name" content="' . e(SITE_NAME) . '" />
    <meta data-seo="1" property="og:title" content="' . e($post['title']) . '" />
    <meta data-seo="1" property="og:description" content="' . e($description) . '" />
    <meta data-seo="1" property="og:url" content="' . e($canonical) . '" />
    <meta data-seo="1" property="og:image" content="' . e($cover) . '" />
    <meta data-seo="1" name="twitter:card" content="summary_large_image" />
    <script data-seo="1" type="application/ld+json">' . json_encode($schema, $jsonFlags) . '</script>
    <script data-seo="1" type="application/ld+json">' . json_encode($breadcrumb, $jsonFlags) . '</script>
';

    /* --------------------------------------------------------------- *
     * Body. React replaces this on boot, so it only has to be complete
     * and correct for a crawler and for the first paint.
     * --------------------------------------------------------------- */

    $metaParts = array_filter([
        $post['author'] ?: null,
        $post['published_at'] ? date('j M Y', strtotime($post['published_at'])) : null,
        $post['read_time'] ?: null,
    ]);

    $toc = '';
    if (count($headings) > 1) {
        $items = '';
        foreach ($headings as $h) {
            $items .= '<li><a href="#' . e($h['id']) . '">' . e($h['text']) . '</a></li>';
        }
        $toc = '<nav class="toc" aria-label="On this page"><p class="toc-label">On this page</p><ul>'
            . $items . '</ul></nav>';
    }

    $body = '
<header class="article-hero">
  <div class="wrap">
    <a class="article-back" href="/learn"><span class="arrow">&larr;</span> Back to Learn</a>
    <div class="article-head">'
      . ($post['tag'] ? '<span class="post-tag">' . e($post['tag']) . '</span>' : '')
      . '<h1>' . e($post['title']) . '</h1>'
      . ($metaParts ? '<div class="article-meta">' . e(implode(' · ', $metaParts)) . '</div>' : '')
      . ($post['excerpt'] ? '<p class="article-standfirst">' . e($post['excerpt']) . '</p>' : '') . '
    </div>
  </div>
</header>
<article class="article">
  <div class="wrap article-layout">' . $toc . '
    <div class="article-main">'
      . ($image !== '' ? '<div class="article-cover"><img src="' . e($cover) . '" alt="' . e($post['title']) . '" /></div>' : '')
      . '<div class="prose">' . $bodyHtml . '</div>
      <aside class="article-next">
        <p class="article-next-label">Where to go next</p>
        <ul>
          <li><a href="/ai-automation-company-hyderabad">AI automation company in Hyderabad</a></li>
          <li><a href="/web-development-company-hyderabad">Web development company in Hyderabad</a></li>
          <li><a href="/mobile-app-development-company-hyderabad">Mobile app development company in Hyderabad</a></li>
          <li><a href="/work">AI automation and app development case studies</a></li>
          <li><a href="/services">AI automation and AI agent services</a></li>
          <li><a href="/contact">Book a 30-minute scoping call</a></li>
        </ul>
      </aside>
    </div>
  </div>
</article>
';

    /* The template is written by scripts/prerender.mjs from the pristine
       build shell, so the script and stylesheet hashes always match the
       current deploy. Hardcoding asset filenames here would break on every
       build instead. */
    if (!is_readable($templatePath)) {
        // Better a complete but unstyled page than a 500: the content and
        // the metadata are what matter here.
        return "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\" />$head</head><body>$body</body></html>";
    }

    $out = file_get_contents($templatePath);
    $out = str_replace('<!--ELEVAITE_HEAD-->', $head, $out);
    $out = str_replace('<!--ELEVAITE_BODY-->', $body, $out);
    return $out;
}
