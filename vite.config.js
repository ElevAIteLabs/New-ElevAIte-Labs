import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * The GA4 tag, injected at build time.
 *
 * It lives here rather than in index.html for two reasons. A missing
 * VITE_GA_ID then produces no tag at all, instead of one pointing at a
 * literal "%VITE_GA_ID%" that would send data nowhere. And the tag becomes
 * part of the build, so it can no longer be wiped by a deploy - which is
 * exactly how measurement was lost before: it existed only in the copy of
 * index.html sitting on the server.
 *
 * The hostname guard matters more than it looks. scripts/prerender.mjs loads
 * every route through a real browser at 127.0.0.1:4183, so without it each
 * build would report a full set of pageviews from a visitor who is a build
 * step. It also keeps `npm run dev` out of the numbers.
 */
const gaSnippet = (id) => `
(function () {
  var host = location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', '${id}');
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=${id}';
  document.head.appendChild(s);
})();`

const ga4 = (id) => ({
  name: 'ga4-tag',
  transformIndexHtml: () =>
    (id ? [{ tag: 'script', injectTo: 'head', children: gaSnippet(id) }] : []),
})

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    plugins: [react(), ga4(env.VITE_GA_ID)],
    css: {
      transformer: 'postcss',
    },
    build: {
      cssMinify: false,
    },
  }
})
