import { useEffect, useState } from 'react';
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

      <article>
        <section>
          <div className="wrap" style={{ maxWidth: '760px' }}>
            <div className="fade-up">
              <Link className="link-arrow" to="/learn" style={{ marginBottom: '24px', display: 'inline-block' }}>
                <span className="arrow">←</span> Back to Learn
              </Link>
              {postMeta(post) && <div className="meta" style={{ marginTop: '12px' }}>{postMeta(post)}</div>}
              <h1 className="display" style={{ marginTop: '12px' }}>{post.title}</h1>
              {post.excerpt && (
                <p style={{ fontSize: '20px', marginTop: '20px', color: 'var(--muted)', lineHeight: 1.6 }}>
                  {post.excerpt}
                </p>
              )}
            </div>

            {cover && (
              <div className="fade-up" style={{ margin: '40px 0', borderRadius: '20px', overflow: 'hidden' }}>
                <img src={cover} alt={post.title} style={{ width: '100%', display: 'block' }} />
              </div>
            )}

            {/* Body is authored in the admin panel and may contain basic HTML. */}
            <div
              className="post-body fade-up"
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />
          </div>
        </section>
      </article>
    </>
  );
};

export default BlogPost;
