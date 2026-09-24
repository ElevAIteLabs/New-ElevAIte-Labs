/**
 * Turns an article's stored HTML into what the page renders.
 *
 * Two jobs, both of which have to happen identically wherever an article is
 * rendered: give every h2 an id so the table of contents can link to it, and
 * turn configured keywords into links.
 *
 * The PHP twin is api/article-render.php, which renders posts published
 * since the last build. scripts/test-keyword-parity.mjs runs both over the
 * same fixtures and fails if they disagree - without it the two drift and a
 * post's links change the moment a build happens to run.
 */
import { applyKeywordLinks } from './keywords';

/**
 * Adds an id to every h2 in the article body and returns the list, so the
 * sidebar can link to each section. Authors write plain HTML in the admin
 * panel and should not have to hand-write anchors.
 *
 * Runs on a detached document, so nothing is inserted into the live page
 * before React renders it.
 */
export const buildBody = (html, keywords) => {
  if (!html) return { bodyHtml: '', headings: [] };
  if (typeof DOMParser === 'undefined') return { bodyHtml: html, headings: [] };

  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
  const used = new Set();
  const headings = [];

  doc.body.querySelectorAll('h2').forEach((h) => {
    const text = h.textContent.trim();
    if (!text) return;

    let id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'section';
    let n = 2;
    while (used.has(id)) id = `${id}-${n++}`;
    used.add(id);

    h.id = id;
    headings.push({ id, text });
  });

  // After the ids, so a keyword inside a heading is skipped by name rather
  // than by whether it happened to be processed yet. Mirrored in
  // api/article.php for posts that are not prerendered yet.
  applyKeywordLinks(doc.body, keywords);

  return { bodyHtml: doc.body.innerHTML, headings };
};
