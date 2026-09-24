/**
 * Proves src/seo/keywords.js and api/article-render.php produce the same
 * links for the same input.
 *
 * They exist as two implementations because an article is rendered by React
 * once it is prerendered and by PHP in the window before that. If they drift,
 * a post's links change the moment a build runs - or worse, Googlebot and a
 * reader see different pages at one URL. Nothing else in the codebase would
 * catch that, so it is checked here.
 *
 * The JavaScript side runs in a real browser because it works on the DOM;
 * the PHP side runs under the CLI. Both are handed identical fixtures.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const KEYWORDS = [
  { keyword: 'AI automation', url: '/services', rel: 'dofollow', all: false },
  { keyword: 'n8n', url: 'https://n8n.io', rel: 'nofollow', all: true },
  { keyword: 'Hyderabad', url: '/ai-automation-company-hyderabad', rel: 'dofollow', all: false },
];

const CASES = [
  {
    name: 'links the first occurrence only by default',
    html: '<p>We build AI automation in Hyderabad. More AI automation follows.</p>',
  },
  {
    name: 'links every occurrence when asked',
    html: '<p>We use n8n daily. n8n is the core of it.</p>',
  },
  {
    name: 'never links inside an existing anchor',
    html: '<p>See <a href="/work">our AI automation work</a> for examples.</p>',
  },
  {
    name: 'never links inside a heading',
    html: '<h2>AI automation basics</h2><p>Then AI automation in practice.</p>',
  },
  {
    name: 'never links inside code',
    html: '<p>Run <code>n8n start</code> first.</p><pre><code>n8n import</code></pre>',
  },
  {
    name: 'is case-insensitive but keeps the written casing',
    html: '<p>ai automation matters.</p>',
  },
  {
    name: 'respects word boundaries',
    html: '<p>Hyderabadi food is not Hyderabad.</p>',
  },
  {
    name: 'gives every heading an id, de-duplicating repeats',
    html: '<h2>Costs</h2><p>a</p><h2>Costs</h2><p>b</p><h2>What next?</h2>',
  },
  {
    name: 'leaves a body with no matches untouched',
    html: '<p>Nothing relevant here at all.</p>',
  },
  {
    name: 'prefers the longest keyword when two overlap',
    html: '<p>An AI automation company in Hyderabad ships things.</p>',
  },
];

/* --- PHP side ---------------------------------------------------------- */

const phpHarness = `<?php
require __DIR__ . '/../api/article-render.php';
$cases = json_decode(file_get_contents($argv[1]), true);
$keywords = json_encode(json_decode(file_get_contents($argv[2]), true));
$out = [];
foreach ($cases as $c) {
    [$html, ] = build_body($c['html'], $keywords);
    $out[$c['name']] = $html;
}
echo json_encode($out, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
`;

const tmp = path.join(root, 'scripts', '.parity-harness.php');
const casesFile = path.join(root, 'scripts', '.parity-cases.json');
const kwFile = path.join(root, 'scripts', '.parity-keywords.json');
writeFileSync(tmp, phpHarness);
writeFileSync(casesFile, JSON.stringify(CASES));
writeFileSync(kwFile, JSON.stringify(KEYWORDS));

let phpOut;
try {
  phpOut = JSON.parse(execFileSync('php', [tmp, casesFile, kwFile], { encoding: 'utf8' }));
} finally {
  for (const f of [tmp, casesFile, kwFile]) {
    try { execFileSync('rm', ['-f', f]); } catch { /* best effort */ }
  }
}

/* --- JavaScript side --------------------------------------------------- */

// Both modules are read as text and stitched into one script: the browser
// has no module resolver here, and the import between them is the only thing
// that needs removing.
const jsSrc = [
  readFileSync(path.join(root, 'src/seo/keywords.js'), 'utf8'),
  readFileSync(path.join(root, 'src/seo/articleBody.js'), 'utf8'),
]
  .join('\n')
  .replace(/^import .*$/gm, '')
  .replace(/^export /gm, '');

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setContent('<!doctype html><body></body>');
const jsOut = await page.evaluate(
  (src, cases, keywords) => {
    // eslint-disable-next-line no-new-func
    const { buildBody } = new Function(`${src}; return { buildBody };`)();
    const out = {};
    for (const c of cases) {
      out[c.name] = buildBody(c.html, keywords).bodyHtml;
    }
    return out;
  },
  jsSrc, CASES, KEYWORDS,
);
await browser.close();

/* --- compare ----------------------------------------------------------- */

// DOM serialisers differ on insignificant whitespace and attribute order;
// neither changes what a crawler reads, so both are normalised away.
const norm = (html) => html
  .replace(/\s+/g, ' ')
  .replace(/<a ([^>]*)>/g, (_, attrs) => {
    const pairs = (attrs.match(/[\w-]+="[^"]*"/g) || []).sort();
    return `<a ${pairs.join(' ')}>`;
  })
  .trim();

let failures = 0;
console.log('\nKeyword link parity (PHP vs JavaScript)\n');
for (const c of CASES) {
  const a = norm(phpOut[c.name] ?? '');
  const b = norm(jsOut[c.name] ?? '');
  const ok = a === b;
  if (!ok) failures++;
  console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${c.name}`);
  if (!ok) {
    console.log(`          php: ${a}`);
    console.log(`           js: ${b}`);
  }
}

console.log(failures ? `\n${failures} of ${CASES.length} differ.\n` : `\nAll ${CASES.length} agree.\n`);
process.exit(failures ? 1 : 0);
