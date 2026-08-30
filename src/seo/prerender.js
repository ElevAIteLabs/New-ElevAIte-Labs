/**
 * True only inside the build-time prerender browser.
 *
 * The robots directive is the one piece of metadata a crawler must never see
 * change. Everything else (title, canonical, og:*) is safe to re-emit at
 * runtime, because the worst case is a duplicate of the same value. A robots
 * tag is different: React only knows whether an article exists after an API
 * fetch resolves, and if that fetch does not complete inside Googlebot's
 * renderer the component reaches its "not found" branch and writes
 * "noindex" over a page that is perfectly fine. That is what removed all 16
 * articles from the index.
 *
 * So the directive is emitted once, at prerender time, and from then on the
 * static HTML owns it: main.jsx leaves robots tags alone, and no runtime
 * render path can contradict them. Every server entry point already carries
 * the correct value - articles are prerendered as index/follow, unknown
 * slugs 404 before React boots, and /admin is served the noindex shell.
 *
 * scripts/prerender.mjs sets the flag via evaluateOnNewDocument, which runs
 * before any page script, so this is already true by module evaluation.
 */
export const IS_PRERENDER =
  typeof window !== 'undefined' && window.__PRERENDER__ === true;
