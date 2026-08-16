/**
 * An Instagram reel, shown as our own card rather than an embed.
 *
 * The homepage previously rendered four instagram.com/reel/ID/embed/ iframes.
 * That put Instagram's chrome inside our page (like and comment icons, "Add a
 * comment...", a likes count), stacked their play button under ours, and
 * swallowed clicks meant for the wrapping link. Four third-party frames also
 * loaded their tracking on first paint.
 *
 * This is the design /learn was already using, lifted into one component so
 * both pages stay identical and there is a single place to change it.
 *
 * poster is optional: drop a 9:16 image in public/pictures/reels/ and pass its
 * path. Without one the tinted card renders, which is a designed state rather
 * than an empty box.
 */
const InstagramGlyph = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const ReelCard = ({ href, cat, title, poster = null }) => (
  <a
    className="reel-card-clean fade-up"
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`Watch on Instagram: ${title}`}
  >
    <div className="reel-thumb">
      {poster
        ? <img className="reel-thumb-img" src={poster} alt="" loading="lazy" width="270" height="480" />
        : <div className="reel-thumb-bg" />}
      <div className="reel-thumb-cat">{cat}</div>
      <div className="reel-thumb-play">
        {/* A glyph would depend on the font being loaded and shifts between
            platforms; the path renders identically everywhere. */}
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
          <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
        </svg>
      </div>
      <div className="reel-thumb-ig">
        <InstagramGlyph />
        Watch on Instagram
      </div>
    </div>
    <div className="reel-cat">{cat}</div>
    <h3>{title}</h3>
  </a>
);

export default ReelCard;
