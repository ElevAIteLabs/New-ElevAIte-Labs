/**
 * Renders every public route to static HTML after the Vite build.
 *
 * Why: this is a client-rendered SPA, so without this step Google receives
 * an empty 459-byte shell for every URL and has to schedule a second
 * render pass that is delayed, rate-limited, and easily aborted. Shipping
 * populated HTML removes that dependency entirely.
 *
 * Output shape: dist/services/index.html, dist/about/index.html, ...
 * Apache then serves each as a real file, which also lets unknown URLs
 * return a genuine 404 instead of the SPA shell with a 200.
 *
 * Visitors still get the SPA — the prerendered file loads the same bundle
 * and React Router takes over on hydration.
 */
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import { PUBLIC_ROUTES } from '../src/seo/siteMeta.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const PORT = 4183;

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.gif': 'image/gif',
  '.json': 'application/json', '.ico': 'image/x-icon',
};

// Minimal static server that mimics the production SPA fallback.
// Cache the pristine shell BEFORE any prerendered file is written. Reading
// it per-request would serve an already-prerendered page as the SPA fallback,
// so each route would inherit the previous route's <title> and canonical.
const SHELL = await readFile(path.join(dist, 'index.html'), 'utf8');

const server = createServer(async (req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  const filePath = path.join(dist, urlPath);
  const isAsset = path.extname(urlPath) !== '';

  if (!isAsset || !existsSync(filePath)) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(SHELL);
    return;
  }

  try {
    const body = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end('not found');
  }
});

await new Promise((resolve) => server.listen(PORT, resolve));

const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
const results = [];

try {
  for (const route of PUBLIC_ROUTES) {
    const page = await browser.newPage();

    // The pages fetch live content; without a network idle wait the
    // prerendered HTML would capture empty lists.
    await page.goto(`http://127.0.0.1:${PORT}${route}`, {
      waitUntil: 'networkidle0',
      timeout: 45000,
    });

    // Ensure React has committed the metadata it hoists into <head>.
    await page.waitForFunction(
      () => document.querySelector('link[rel="canonical"]') !== null,
      { timeout: 15000 },
    );

    const html = await page.content();
    const title = await page.title();

    const outDir = route === '/' ? dist : path.join(dist, route);
    await mkdir(outDir, { recursive: true });
    await writeFile(path.join(outDir, 'index.html'), html, 'utf8');

    results.push({ route, bytes: html.length, title });
    await page.close();
  }
} finally {
  await browser.close();
  server.close();
}

// Admin routes are client-rendered on purpose, so they must not fall back to
// dist/index.html — that file now holds the prerendered homepage, which would
// make /admin look like a duplicate of / to anything that reads the raw HTML.
const noindexShell = SHELL.replace(
  '</head>',
  '  <title>Admin — ElevAIte Labs</title>\n    <meta name="robots" content="noindex, nofollow" />\n  </head>',
);
await writeFile(path.join(dist, 'app-shell.html'), noindexShell, 'utf8');

const pad = Math.max(...results.map((r) => r.route.length));
console.log('\nPrerendered:');
for (const r of results) {
  console.log(`  ${r.route.padEnd(pad)}  ${String(r.bytes).padStart(7)} B  ${r.title}`);
}

const tooSmall = results.filter((r) => r.bytes < 5000);
if (tooSmall.length) {
  console.error(`\nFAILED: ${tooSmall.map((r) => r.route).join(', ')} rendered suspiciously small.`);
  process.exit(1);
}
