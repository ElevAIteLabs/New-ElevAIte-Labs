/**
 * The pre-publish checklist shown beside the editor.
 *
 * Every check runs on the post in front of the writer - no external APIs, no
 * keys, no rate limits. The point is not to score the article but to catch
 * the handful of mistakes that stop a good article ranking: a title Google
 * truncates, a description it rewrites, a keyword configured but never
 * mentioned, images with no alt text.
 *
 * Levels are 'pass', 'warn' and 'fail'. Nothing here blocks publishing; a
 * writer who knows why they are breaking a rule should be able to.
 */

import { parseKeywords } from '../seo/keywords';

/** Strip tags so word counts and keyword checks see prose, not markup. */
export const toText = (html) => {
  if (!html) return '';
  if (typeof DOMParser === 'undefined') return String(html).replace(/<[^>]*>/g, ' ');
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
  doc.body.querySelectorAll('script, style').forEach((el) => el.remove());
  return doc.body.textContent || '';
};

export const wordCount = (html) => {
  const words = toText(html).trim().split(/\s+/).filter(Boolean);
  return words.length;
};

const range = (value, min, max, label) => {
  const n = (value || '').length;
  if (n === 0) return { level: 'fail', detail: `${label} is empty` };
  if (n < min) return { level: 'warn', detail: `${n} characters - aim for ${min}-${max}` };
  if (n > max) return { level: 'warn', detail: `${n} characters - Google will cut it off after about ${max}` };
  return { level: 'pass', detail: `${n} characters` };
};

/**
 * `post` is the editor's working copy, so fields may be undefined while the
 * writer is still filling it in. Every check has to tolerate that.
 */
export function runSeoChecks(post = {}) {
  const html = post.content || '';
  const text = toText(html).toLowerCase();
  const words = wordCount(html);
  const keywords = parseKeywords(post.keywords);

  const checks = [];

  // Google renders roughly 60 characters of a title and 160 of a description.
  // Beyond that the text still counts, it just stops being visible in the
  // result - which is where the click decision is made.
  checks.push({
    id: 'meta-title',
    label: 'Meta title length',
    ...range(post.meta_title?.trim() || post.title, 30, 60, 'Title'),
  });

  checks.push({
    id: 'meta-description',
    label: 'Meta description length',
    ...range(post.excerpt, 120, 160, 'Excerpt'),
  });

  checks.push({
    id: 'word-count',
    label: 'Article length',
    ...(words === 0
      ? { level: 'fail', detail: 'Nothing written yet' }
      : words < 300
        ? { level: 'fail', detail: `${words} words - too thin to rank for anything` }
        : words < 700
          ? { level: 'warn', detail: `${words} words - fine for a news post, short for a guide` }
          : { level: 'pass', detail: `${words} words` }),
  });

  // A keyword configured but never written is the most common cause of a
  // link that silently never appears on the page.
  if (keywords.length) {
    const missing = keywords.filter((k) => !text.includes(k.keyword.toLowerCase()));
    checks.push({
      id: 'keywords-present',
      label: 'Keywords appear in the article',
      ...(missing.length
        ? { level: 'warn', detail: `Not mentioned: ${missing.map((k) => k.keyword).join(', ')}` }
        : { level: 'pass', detail: `All ${keywords.length} found in the body` }),
    });
  }

  // Headings are how a reader scans and how Google reads structure. One long
  // block of prose ranks worse than the same words under sub-headings.
  const headings = (html.match(/<h2/gi) || []).length;
  checks.push({
    id: 'headings',
    label: 'Sub-headings',
    ...(headings === 0
      ? { level: words > 400 ? 'warn' : 'pass', detail: headings === 0 && words > 400 ? 'No H2s - long articles need them' : 'None needed at this length' }
      : { level: 'pass', detail: `${headings} section${headings === 1 ? '' : 's'}` }),
  });

  // Internal links are the strongest on-site ranking signal available, and
  // the whole reason the keyword feature exists.
  const internal = (html.match(/href="\//g) || []).length + keywords.filter((k) => !/^https?:\/\//i.test(k.url)).length;
  checks.push({
    id: 'internal-links',
    label: 'Internal links',
    ...(internal === 0
      ? { level: 'warn', detail: 'None - link to a service or landing page' }
      : { level: 'pass', detail: `${internal} link${internal === 1 ? '' : 's'} to our own pages` }),
  });

  // Alt text is an accessibility requirement first and an image-search
  // opportunity second.
  const imgs = (html.match(/<img\b[^>]*>/gi) || []);
  const noAlt = imgs.filter((t) => !/\salt\s*=\s*["'][^"']+["']/i.test(t)).length;
  if (imgs.length) {
    checks.push({
      id: 'alt-text',
      label: 'Image alt text',
      ...(noAlt
        ? { level: 'warn', detail: `${noAlt} of ${imgs.length} image${imgs.length === 1 ? '' : 's'} missing alt text` }
        : { level: 'pass', detail: `All ${imgs.length} have alt text` }),
    });
  }

  checks.push({
    id: 'cover',
    label: 'Cover image',
    ...(post.image
      ? { level: 'pass', detail: 'Set' }
      : { level: 'warn', detail: 'None - the Learn card and social previews will fall back to the logo' }),
  });

  checks.push({
    id: 'slug',
    label: 'URL',
    ...(!post.slug
      ? { level: 'pass', detail: 'Will be generated from the title' }
      : post.slug.length > 60
        ? { level: 'warn', detail: 'Long - shorter URLs are easier to share' }
        : { level: 'pass', detail: `/learn/${post.slug}` }),
  });

  return checks;
}

export const summarise = (checks) => ({
  fail: checks.filter((c) => c.level === 'fail').length,
  warn: checks.filter((c) => c.level === 'warn').length,
  pass: checks.filter((c) => c.level === 'pass').length,
});
