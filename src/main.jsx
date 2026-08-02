import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// The prerendered HTML already carries the SEO tags React hoisted at build
// time. React does not adopt them on mount, so without this they linger:
// the page ends up with two <title> tags and a canonical/description frozen
// on whichever route was prerendered, even after client-side navigation.
// Crawlers read the static tags before this runs; the app owns them after.
document.querySelectorAll('head [data-seo]').forEach((el) => el.remove())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
