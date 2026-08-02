/**
 * Discovers published blog posts so they can be prerendered and listed in
 * the sitemap.
 *
 * Without this, a post published from the admin panel would exist only as a
 * client-rendered page - invisible to crawlers, which is the exact problem
 * the prerender pass was added to solve.
 *
 * Reads VITE_API_URL from .env rather than importing Vite's env handling,
 * since this runs as a plain Node script.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function apiBase() {
  try {
    const env = await readFile(path.join(root, '.env'), 'utf8');
    const match = env.match(/^\s*VITE_API_URL\s*=\s*(.+)$/m);
    return match ? match[1].trim().replace(/\/+$/, '') : null;
  } catch {
    return null;
  }
}

/**
 * @returns {Promise<{routes: string[], posts: object[]}>}
 */
export async function fetchPostRoutes() {
  const base = await apiBase();
  if (!base || base.startsWith('/')) {
    console.warn('  post discovery skipped: VITE_API_URL is not an absolute URL');
    return { routes: [], posts: [] };
  }

  try {
    const res = await fetch(`${base}/posts.php`, { signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const posts = await res.json();
    if (!Array.isArray(posts)) throw new Error('unexpected payload');

    const withSlug = posts.filter((p) => p && p.slug);
    return {
      routes: withSlug.map((p) => `/learn/${p.slug}`),
      posts: withSlug,
    };
  } catch (err) {
    // A published post missing from the build is a real SEO regression, so
    // make it loud rather than silently shipping an incomplete sitemap.
    console.warn(`  WARNING: could not fetch posts (${err.message}) - no article pages will be prerendered`);
    return { routes: [], posts: [] };
  }
}
