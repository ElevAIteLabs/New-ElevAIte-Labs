import { useLocation } from 'react-router-dom';
import { IS_PRERENDER } from '../seo/prerender';
import {
  ROUTE_META,
  NOINDEX_ROUTES,
  SITE_URL,
  SITE_NAME,
  DEFAULT_OG_IMAGE,
} from '../seo/siteMeta';

/**
 * Emits the per-page search metadata.
 *
 * React 19 hoists <title>, <meta> and <link> rendered anywhere in the tree
 * into <head>, so this needs no helmet library - and because the prerender
 * pass captures the rendered DOM, crawlers get these tags in the raw HTML.
 */
const Seo = () => {
  const { pathname } = useLocation();

  // Normalise "/services/" -> "/services" so trailing slashes share metadata.
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  const isNoIndex = NOINDEX_ROUTES.some((r) => path === r || path.startsWith(`${r}/`));

  // Article pages under /learn/:slug build their metadata from the post
  // itself, so stay out of the way rather than marking them "not found".
  if (/^\/learn\/[^/]+$/.test(path)) {
    return null;
  }

  const meta = ROUTE_META[path];

  // Unknown route: keep it out of the index rather than letting it inherit
  // the homepage's metadata as a soft duplicate.
  // data-seo marks these as build-time output so main.jsx can clear the
  // prerendered copies before React starts managing them itself.
  if (!meta || isNoIndex) {
    return (
      <>
        <title data-seo="1">
          {isNoIndex ? `Admin - ${SITE_NAME}` : `Page not found - ${SITE_NAME}`}
        </title>
        {IS_PRERENDER && <meta data-seo="1" name="robots" content="noindex, nofollow" />}
      </>
    );
  }

  const canonical = `${SITE_URL}${path === '/' ? '/' : path}`;

  /**
   * The homepage and /global are the same offer written for two audiences, so
   * they are declared as alternates of each other. Google then picks by the
   * searcher's region instead of us redirecting by IP, which would send
   * Googlebot - which crawls largely from the US - to the wrong version and
   * risk the India pages never being crawled properly.
   *
   * Deliberately limited to this one pair. Claiming an international variant
   * for every URL would be false, and hreflang has to be reciprocal to work.
   */
  const hasGlobalAlternate = path === '/' || path === '/global';

  return (
    <>
      <title data-seo="1">{meta.title}</title>
      <meta data-seo="1" name="description" content={meta.description} />
      <link data-seo="1" rel="canonical" href={canonical} />
      {IS_PRERENDER && <meta data-seo="1" name="robots" content="index, follow, max-image-preview:large" />}

      {hasGlobalAlternate && (
        <>
          <link data-seo="1" rel="alternate" hrefLang="en-IN" href={`${SITE_URL}/`} />
          <link data-seo="1" rel="alternate" hrefLang="en" href={`${SITE_URL}/global`} />
          <link data-seo="1" rel="alternate" hrefLang="x-default" href={`${SITE_URL}/global`} />
        </>
      )}

      <meta data-seo="1" property="og:type" content="website" />
      <meta data-seo="1" property="og:site_name" content={SITE_NAME} />
      <meta data-seo="1" property="og:title" content={meta.title} />
      <meta data-seo="1" property="og:description" content={meta.description} />
      <meta data-seo="1" property="og:url" content={canonical} />
      <meta data-seo="1" property="og:image" content={DEFAULT_OG_IMAGE} />
      <meta data-seo="1" property="og:locale" content="en_IN" />

      <meta data-seo="1" name="twitter:card" content="summary_large_image" />
      <meta data-seo="1" name="twitter:title" content={meta.title} />
      <meta data-seo="1" name="twitter:description" content={meta.description} />
      <meta data-seo="1" name="twitter:image" content={DEFAULT_OG_IMAGE} />
    </>
  );
};

export default Seo;
