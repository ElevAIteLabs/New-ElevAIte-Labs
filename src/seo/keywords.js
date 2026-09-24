/**
 * Turns keyword mentions in an article body into links.
 *
 * Writers add { keyword, url, rel } rows in the editor and never touch the
 * HTML. This is the piece that makes a phrase like "AI automation company in
 * Hyderabad" link to the landing page from every article that mentions it -
 * which is how that page reached the first result page - without anyone
 * hand-writing anchors.
 *
 * The same rules are implemented in PHP in api/article.php, which renders a
 * post before the next build has prerendered it. If you change the matching
 * here, change it there too: a reader and a crawler seeing different links
 * on the same URL is worse than the feature not existing.
 *
 * What it deliberately will not touch:
 *   - text already inside an <a>, so an existing link is never nested
 *   - headings, because a linked heading reads as navigation, not prose
 *   - <code> and <pre>, where a link would corrupt a sample
 * and by default only the first occurrence of each keyword is linked.
 * Linking every mention is the classic over-optimisation signal, so "all
 * occurrences" is opt-in per keyword rather than the default.
 */

const SKIP_ANCESTORS = new Set(['A', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'CODE', 'PRE']);

/** Escape a writer-supplied phrase for use inside a RegExp. */
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Accepts the raw column, which is TEXT holding JSON, and is tolerant of the
 * column being empty, null, or already-parsed - the admin panel holds it as
 * an array in state while the API returns it as a string.
 */
export function parseKeywords(raw) {
  if (!raw) return [];
  let list = raw;

  if (typeof raw === 'string') {
    try {
      list = JSON.parse(raw);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(list)) return [];

  return list
    .map((k) => ({
      keyword: String(k?.keyword ?? '').trim(),
      url: String(k?.url ?? '').trim(),
      rel: k?.rel === 'nofollow' || k?.rel === 'sponsored' ? k.rel : 'dofollow',
      all: k?.all === true,
    }))
    .filter((k) => k.keyword !== '' && k.url !== '')
    // Longest first, so "AI automation company in Hyderabad" wins over the
    // shorter "AI automation" when both are configured and both match.
    .sort((a, b) => b.keyword.length - a.keyword.length);
}

/** True for a URL pointing somewhere other than this site. */
const isExternal = (url) => /^https?:\/\//i.test(url) && !/^https?:\/\/(www\.)?elevaitelabs\.in/i.test(url);

/**
 * Builds the rel attribute. noopener is always present on a new tab - without
 * it the opened page can reach back through window.opener - and the writer's
 * choice is appended for external targets only. "dofollow" is not a real rel
 * value; it just means "add nothing", which is the default Google assumes.
 */
function relFor(url, rel) {
  if (!isExternal(url)) return null;
  const parts = ['noopener'];
  if (rel === 'nofollow' || rel === 'sponsored') parts.push(rel);
  return parts.join(' ');
}

/**
 * Rewrites text nodes in `root` in place. Works on a detached document, so
 * nothing half-linked is ever visible on the page.
 */
export function applyKeywordLinks(root, keywords) {
  const list = parseKeywords(keywords);
  if (!list.length || !root) return;

  const doc = root.ownerDocument || root;
  const linked = new Set();

  for (const entry of list) {
    const re = new RegExp(`\\b${escapeRe(entry.keyword)}\\b`, entry.all ? 'gi' : 'i');

    // Collected first: replacing a node while walking invalidates the walker.
    const walker = doc.createTreeWalker(root, 4 /* SHOW_TEXT */);
    const targets = [];
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      if (!re.test(n.nodeValue)) continue;
      re.lastIndex = 0;

      let skip = false;
      for (let p = n.parentNode; p && p !== root; p = p.parentNode) {
        if (SKIP_ANCESTORS.has(p.nodeName)) { skip = true; break; }
      }
      if (!skip) targets.push(n);
    }

    for (const node of targets) {
      if (!entry.all && linked.has(entry.keyword.toLowerCase())) break;

      const text = node.nodeValue;
      const frag = doc.createDocumentFragment();
      let last = 0;
      re.lastIndex = 0;

      // A non-global regex has no lastIndex to advance, so the single-match
      // case is handled by breaking out after the first hit.
      let m;
      while ((m = re.exec(text)) !== null) {
        frag.appendChild(doc.createTextNode(text.slice(last, m.index)));

        const a = doc.createElement('a');
        a.setAttribute('href', entry.url);
        a.textContent = m[0];
        const rel = relFor(entry.url, entry.rel);
        if (rel) {
          a.setAttribute('rel', rel);
          a.setAttribute('target', '_blank');
        }
        frag.appendChild(a);

        last = m.index + m[0].length;
        linked.add(entry.keyword.toLowerCase());
        if (!entry.all) break;
        if (m[0].length === 0) break; // guard against a zero-width match looping
      }

      frag.appendChild(doc.createTextNode(text.slice(last)));
      node.parentNode.replaceChild(frag, node);

      if (!entry.all) break;
    }
  }
}
