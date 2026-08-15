import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Offers the international page to visitors who are probably not in India.
 *
 * Deliberately a suggestion rather than a redirect. Googlebot crawls largely
 * from US addresses, so redirecting by region would send the crawler to the
 * wrong version of the site and could leave the India pages uncrawled. This
 * renders identical HTML for everyone and only appears after hydration, so
 * there is nothing for a crawler to be shown differently.
 *
 * Region comes from the browser's own timezone rather than a geo-IP lookup:
 * no third-party request, nothing to disclose in a privacy policy, and it
 * cannot fail closed. Anyone it guesses wrong about simply dismisses it.
 */
const DISMISS_KEY = 'elevaite.region-hint.dismissed';

const RegionHint = () => {
  const { pathname } = useLocation();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Never on the page it points at, and never once dismissed.
    if (pathname === '/global') return;

    let dismissed = false;
    try {
      dismissed = localStorage.getItem(DISMISS_KEY) === '1';
    } catch {
      // Private browsing can throw on access. Treat it as not dismissed.
    }
    if (dismissed) return;

    let zone = '';
    try {
      zone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    } catch {
      return;
    }

    // Asia/Calcutta is the older alias for the same zone and is still what
    // some browsers report.
    const inIndia = zone === 'Asia/Kolkata' || zone === 'Asia/Calcutta';
    if (!inIndia && zone !== '') setShow(true);
  }, [pathname]);

  if (!show) return null;

  const dismiss = () => {
    setShow(false);
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      // Nothing to do; it will simply appear again next visit.
    }
  };

  return (
    <div className="region-hint" role="region" aria-label="International visitors">
      <span>
        Looks like you are outside India. We work with teams in the US, UK, Canada and
        Australia.
      </span>
      <Link className="region-hint-cta" to="/global" onClick={dismiss}>
        See our international page
      </Link>
      <button type="button" className="region-hint-close" onClick={dismiss} aria-label="Dismiss">
        ✕
      </button>
    </div>
  );
};

export default RegionHint;
