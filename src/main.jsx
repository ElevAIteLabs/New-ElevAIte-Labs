import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// The prerendered HTML already carries the SEO tags React hoisted at build
// time. React does not adopt them on mount, so without this they linger:
// the page ends up with two <title> tags and a canonical/description frozen
// on whichever route was prerendered, even after client-side navigation.
// Crawlers read the static tags before this runs; the app owns them after.
//
// The robots directive is excluded on purpose. Removing it handed ownership
// to a component that only learns whether an article exists after an API
// fetch, and a fetch that does not resolve inside Googlebot's renderer put
// "noindex" on all 16 articles. The static value is correct for every entry
// point, so it stays exactly as the build wrote it. See src/seo/prerender.js.
document
  .querySelectorAll('head [data-seo]:not(meta[name="robots"])')
  .forEach((el) => el.remove())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
