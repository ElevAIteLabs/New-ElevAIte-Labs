/**
 * Asserts on the page api/article-render.php produces for a post.
 *
 * This is the HTML Googlebot receives for any article published since the
 * last build, so the metadata in it is the whole point of the file. The
 * checks below are the ones that cost something real when they regress:
 * a missing robots directive silently removed 16 articles from the index
 * once already, and a wrong canonical would split a page's signals in two.
 *
 * Runs against a fixture row rather than MySQL, so it needs no database and
 * no config.php.
 */
import { execFileSync } from 'node:child_process';
import { writeFileSync, rmSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const work = mkdtempSync(path.join(tmpdir(), 'article-render-'));

const POST = {
  id: 42,
  slug: 'a-published-post',
  title: 'A Published Post',
  meta_title: '',
  excerpt: 'What this article covers, in a sentence that also serves as the search description.',
  content: '<h2>First section</h2><p>We build AI automation for teams.</p><h2>Second section</h2><p>More detail.</p>',
  keywords: JSON.stringify([{ keyword: 'AI automation', url: '/services', rel: 'dofollow', all: false }]),
  image: 'cover.png',
  author: 'Premsai Kilaru',
  read_time: '6 min read',
  tag: 'Automation',
  status: 'published',
  published_at: '2026-09-24',
  updated_at: '2026-09-24 10:00:00',
};

const template = path.join(work, 'post-template.html');
writeFileSync(template, [
  '<!doctype html><html lang="en"><head><meta charset="UTF-8" />',
  '<!--ELEVAITE_HEAD-->',
  '</head><body><div id="root"><!--ELEVAITE_BODY--></div>',
  '<script type="module" src="/assets/index-abc.js"></script></body></html>',
].join('\n'));

const harness = path.join(work, 'harness.php');
writeFileSync(harness, `<?php
require ${JSON.stringify(path.join(root, 'api/article-render.php'))};
echo render_article_page(json_decode(file_get_contents($argv[1]), true), $argv[2]);
`);

const postFile = path.join(work, 'post.json');
writeFileSync(postFile, JSON.stringify(POST));

let html;
try {
  html = execFileSync('php', [harness, postFile, template], { encoding: 'utf8' });
} finally {
  if (!process.env.KEEP) rmSync(work, { recursive: true, force: true });
}

if (process.env.DUMP) console.log(html);

const CHECKS = [
  ['is indexable', () => /<meta[^>]*name="robots"[^>]*content="index, follow, max-image-preview:large"/.test(html)],
  ['declares exactly one robots directive', () => (html.match(/name="robots"/g) || []).length === 1],
  ['canonical points at the live URL', () => html.includes('href="https://elevaitelabs.in/learn/a-published-post"')],
  ['title falls back to the post title', () => html.includes('<title data-seo="1">A Published Post | ElevAIte Labs</title>')],
  ['description comes from the excerpt', () => /name="description" content="What this article covers/.test(html)],
  ['cover image resolves to an absolute URL', () => html.includes('https://elevaitelabs.in/pictures/cover.png')],
  ['emits BlogPosting schema', () => html.includes('"@type":"BlogPosting"')],
  ['emits breadcrumb schema', () => html.includes('"@type":"BreadcrumbList"')],
  ['schema carries the publish date', () => html.includes('"datePublished":"2026-09-24"')],
  ['keeps the build’s script tag', () => html.includes('/assets/index-abc.js')],
  ['renders the headline as an h1', () => /<h1>A Published Post<\/h1>/.test(html)],
  // The sentence is split by the keyword link, which is the point - so the
  // check is that the surrounding prose survived, not that it is contiguous.
  ['renders the body prose', () => html.includes('We build <a href="/services">AI automation</a> for teams')],
  ['keeps both section headings', () => html.includes('>First section<') && html.includes('>Second section<')],
  ['applies keyword links', () => html.includes('<a href="/services">AI automation</a>')],
  ['builds a table of contents from the headings', () => html.includes('href="#first-section"') && html.includes('href="#second-section"')],
  ['leaves no unreplaced markers', () => !html.includes('ELEVAITE_HEAD') && !html.includes('ELEVAITE_BODY')],
  ['escapes the byline into the meta line', () => html.includes('Premsai Kilaru')],
];

console.log('\nArticle render (PHP fallback page)\n');
let failures = 0;
for (const [name, fn] of CHECKS) {
  let ok = false;
  try { ok = fn(); } catch { ok = false; }
  if (!ok) failures++;
  console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${name}`);
}

console.log(failures ? `\n${failures} of ${CHECKS.length} failed.\n` : `\nAll ${CHECKS.length} passed.\n`);
process.exit(failures ? 1 : 0);
