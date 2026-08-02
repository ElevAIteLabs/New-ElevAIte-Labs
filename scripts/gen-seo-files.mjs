/**
 * Generates robots.txt and sitemap.xml from the route map, so they can
 * never drift out of sync with the app's actual routes.
 *
 * These previously did not exist at all — requests for them fell through
 * the SPA rewrite and returned the HTML shell with a 200, which reads to a
 * crawler as a malformed robots.txt rather than a missing one.
 */
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PUBLIC_ROUTES, ROUTE_META, SITE_URL } from '../src/seo/siteMeta.js';
import { fetchPostRoutes } from './post-routes.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = process.argv[2] ? path.resolve(process.argv[2]) : path.join(root, 'dist');

// Build date only — avoids a pointless diff on every rebuild.
const lastmod = new Date().toISOString().slice(0, 10);

const { posts } = await fetchPostRoutes();

const entries = [
  ...PUBLIC_ROUTES.map((route) => ({
    loc: `${SITE_URL}${route === '/' ? '/' : route}`,
    lastmod,
    changefreq: ROUTE_META[route].changefreq,
    priority: ROUTE_META[route].priority,
  })),
  ...posts.map((post) => ({
    loc: `${SITE_URL}/learn/${post.slug}`,
    lastmod: post.published_at || lastmod,
    changefreq: 'monthly',
    priority: '0.7',
  })),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map((e) => `  <url>
    <loc>${e.loc}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

const robots = `User-agent: *
Allow: /

# Admin surfaces carry no search value and must stay out of the index.
Disallow: /admin
Disallow: /admin/
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml
`;

await writeFile(path.join(outDir, 'sitemap.xml'), sitemap, 'utf8');
await writeFile(path.join(outDir, 'robots.txt'), robots, 'utf8');

console.log(
  `Wrote robots.txt and sitemap.xml (${entries.length} URLs: ` +
  `${PUBLIC_ROUTES.length} pages + ${posts.length} posts) to ${path.relative(root, outDir)}/`,
);
