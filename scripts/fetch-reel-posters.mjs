/**
 * Saves the cover frame of each Instagram reel into public/pictures/reels/.
 *
 * Why not just point an <img> at Instagram: the CDN URLs are signed and carry
 * an expiry (oe=...), so a hotlinked thumbnail works for a few hours and then
 * turns into a broken image. The embed's own JSON endpoints are gone and
 * /media/?size=l now 404s, so the cover is only reachable by rendering the
 * embed page and reading the image it loads.
 *
 * These are our own reels, re-hosted on our own domain. Nothing third-party is
 * loaded by visitors at runtime.
 *
 * Usage:  node scripts/fetch-reel-posters.mjs
 * Re-run whenever the reels on the homepage or /learn change.
 */
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'public', 'pictures', 'reels');

// Keep in sync with REELS in src/pages/Home.jsx and the cards on /learn.
const IDS = [
  'DPblf0dD_T0',
  'DS7ph4rD9LM',
  'DS-PVTTjyxQ',
  'DUlGdjLjWaG',
  'DV0-5lfDx2_',
];

await mkdir(outDir, { recursive: true });

const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
const results = [];

try {
  for (const id of IDS) {
    const page = await browser.newPage();
    // A desktop UA: the mobile embed serves a smaller cover.
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    );

    try {
      await page.goto(`https://www.instagram.com/reel/${id}/embed/`, {
        waitUntil: 'networkidle2',
        timeout: 45000,
      });

      await page.waitForSelector('img.EmbeddedMediaImage', { timeout: 20000 });

      const src = await page.$eval('img.EmbeddedMediaImage', (i) => i.src);

      // Fetched from inside the page context so the request carries the same
      // origin and referer the CDN just served the image to.
      const dataUrl = await page.evaluate(async (u) => {
        const res = await fetch(u);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buf = await res.arrayBuffer();
        let bin = '';
        const bytes = new Uint8Array(buf);
        const chunk = 0x8000;
        for (let i = 0; i < bytes.length; i += chunk) {
          bin += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
        }
        return btoa(bin);
      }, src);

      const bytes = Buffer.from(dataUrl, 'base64');
      const file = path.join(outDir, `${id}.jpg`);
      await writeFile(file, bytes);
      results.push({ id, ok: true, kb: Math.round(bytes.length / 1024) });
    } catch (err) {
      results.push({ id, ok: false, error: err.message.split('\n')[0] });
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
}

console.log('\nReel posters:');
for (const r of results) {
  console.log(
    r.ok
      ? `  ok      ${r.id}.jpg  ${String(r.kb).padStart(4)} KB`
      : `  FAILED  ${r.id}  ${r.error}`,
  );
}

const failed = results.filter((r) => !r.ok);
if (failed.length === results.length) {
  console.error('\nEvery poster failed. Instagram may have changed the embed markup.');
  process.exit(1);
}
