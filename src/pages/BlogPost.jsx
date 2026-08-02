import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { postsApiUrl, postImageSrc, postMeta } from '../seo/posts';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '../seo/siteMeta';

/**
 * A CMS-authored article at /learn/:slug.
 *
 * Metadata is emitted here rather than from the central route map, because
 * the title and description come from the post itself. Tags carry data-seo
 * so main.jsx can clear the prerendered copies on boot, same as Seo.jsx.
 */
/**
 * Adds an id to every h2 in the article body and returns the list, so the
 * sidebar can link to each section. Authors write plain HTML in the admin
 * panel and should not have to hand-write anchors.
 *
 * Runs on a detached document, so nothing is inserted into the live page
 * before React renders it.
 */
const buildBody = (html) => {
  if (!html) return { bodyHtml: '', headings: [] };
  if (typeof DOMParser === 'undefined') return { bodyHtml: html, headings: [] };

  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
  const used = new Set();
  const headings = [];

  doc.body.querySelectorAll('h2').forEach((h) => {
    const text = h.textContent.trim();
    if (!text) return;

    let id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'section';
    let n = 2;
    while (used.has(id)) id = `${id}-${n++}`;
    used.add(id);

    h.id = id;
    headings.push({ id, text });
  });

  return { bodyHtml: doc.body.innerHTML, headings };
};

const BlogPost = () => {
  const { slug } = useParams();

  // Keep the slug alongside the result so navigating between posts shows a
  // loading state without setState running synchronously inside the effect.
  const [loaded, setLoaded] = useState({ slug: null, post: null, state: 'loading' });
  const { post, state } = loaded.slug === slug ? loaded : { post: null, state: 'loading' };

  useEffect(() => {
    let cancelled = false;

    fetch(postsApiUrl(slug))
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('not found'))))
      .then((d) => !cancelled && setLoaded({ slug, post: d, state: 'ready' }))
      .catch(() => !cancelled && setLoaded({ slug, post: null, state: 'missing' }));

    return () => { cancelled = true; };
  }, [slug]);

  // Computed before the early returns below so the scroll-spy hook that
  // depends on it stays unconditional.
  const { bodyHtml, headings } = useMemo(() => buildBody(post?.content), [post?.content]);
  const [activeId, setActiveId] = useState(null);

  // Highlights the section currently being read. Uses scroll position rather
  // than IntersectionObserver so the last section still activates even when
  // it is too short to cross an observer threshold.
  useEffect(() => {
    if (!headings.length) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const offset = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-offset'), 10,
      ) || 128;

      // A heading counts as current once it enters the upper quarter of the
      // viewport, not only when it touches the navbar - otherwise the
      // previous section stays lit well after you have moved past it.
      const threshold = offset + window.innerHeight * 0.25;

      let current = headings[0].id;
      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (el && el.getBoundingClientRect().top <= threshold) current = h.id;
      }

      // Near the bottom the final section may never reach the top of the
      // viewport, so pin the highlight to it.
      const atBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 80;
      if (atBottom) current = headings[headings.length - 1].id;

      setActiveId((prev) => (prev === current ? prev : current));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [headings]);

  if (state === 'loading') {
    return (
      <>
        {/* Keep this out of the index until we know the post resolves. */}
        <meta data-seo="1" name="robots" content="noindex" />
        <section><div className="wrap" style={{ padding: '120px 0', textAlign: 'center', color: 'var(--muted)' }}>Loading…</div></section>
      </>
    );
  }

  if (state === 'missing' || !post) {
    return (
      <>
        <title data-seo="1">Article not found - {SITE_NAME}</title>
        <meta data-seo="1" name="robots" content="noindex, follow" />
        <section>
          <div className="wrap" style={{ padding: '120px 0', textAlign: 'center' }}>
            <h1 className="display">We couldn't find that article</h1>
            <p style={{ marginTop: '18px', color: 'var(--muted)' }}>It may have been unpublished or moved.</p>
            <div style={{ marginTop: '32px' }}>
              <Link className="btn" to="/learn">Back to Learn</Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  const canonical = `${SITE_URL}/learn/${post.slug}`;
  const cover = postImageSrc(post.image);
  const description = (post.excerpt || '').slice(0, 300);
  const metaLine = postMeta(post);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description,
    image: cover ? [cover.startsWith('http') ? cover : `${SITE_URL}${cover}`] : [DEFAULT_OG_IMAGE],
    datePublished: post.published_at || undefined,
    author: { '@type': post.author ? 'Person' : 'Organization', name: post.author || SITE_NAME },
    publisher: { '@id': `${SITE_URL}/#organization` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
  };

  return (
    <>
      <title data-seo="1">{`${post.title} | ${SITE_NAME}`}</title>
      <meta data-seo="1" name="description" content={description} />
      <link data-seo="1" rel="canonical" href={canonical} />
      <meta data-seo="1" name="robots" content="index, follow, max-image-preview:large" />
      <meta data-seo="1" property="og:type" content="article" />
      <meta data-seo="1" property="og:title" content={post.title} />
      <meta data-seo="1" property="og:description" content={description} />
      <meta data-seo="1" property="og:url" content={canonical} />
      <meta data-seo="1" property="og:image" content={cover && cover.startsWith('http') ? cover : `${SITE_URL}${cover || '/pictures/logo.png'}`} />
      <meta data-seo="1" name="twitter:card" content="summary_large_image" />
      <script
        data-seo="1"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <header className="article-hero">
        <div className="wrap">
          <Link className="article-back" to="/learn">
            <span className="arrow">←</span> Back to Learn
          </Link>
          <div className="article-head">
            {post.tag && <span className="post-tag">{post.tag}</span>}
            <h1>{post.title}</h1>
            {metaLine && <div className="article-meta">{metaLine}</div>}
            {post.excerpt && <p className="article-standfirst">{post.excerpt}</p>}
          </div>
        </div>
      </header>

      <article className="article">
        <div className="wrap article-layout">
          {headings.length > 1 && (
            <nav className="toc" aria-label="On this page">
              <p className="toc-label">On this page</p>
              <ul>
                {headings.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className={h.id === activeId ? 'active' : undefined}>{h.text}</a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div className="article-main">
            {cover && (
              <div className="article-cover">
                <img src={cover} alt={post.title} />
              </div>
            )}
            {/* Body is authored in the admin panel and may contain basic HTML.
                Headings are given ids above so the table of contents can link
                to them. */}
            <div className="prose" dangerouslySetInnerHTML={{ __html: bodyHtml }} />

            <div className="article-foot">
              <Link className="link-arrow" to="/learn">
                <span className="arrow">←</span> Back to all articles
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  );
};

export default BlogPost;
