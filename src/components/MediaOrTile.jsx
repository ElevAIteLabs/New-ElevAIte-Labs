import { useState } from 'react';
import { isRealArtwork } from '../lib/artwork';

// A cover-crop only flatters images shaped roughly like their container.
// Past this much deviation the source is a logo or a tall page capture, and
// cropping it produces a slab — those get contained and padded instead.
const SHAPE_TOLERANCE = 1.5;

// CMS rows can carry a mascot placeholder, a missing filename, or nothing at
// all. Any of those falls back to a branded tile rather than a broken image.
const MediaOrTile = ({ src, alt, label, className = '', tileClassName = 'media-tile' }) => {
  const [failed, setFailed] = useState(false);
  const [contain, setContain] = useState(false);
  const usable = isRealArtwork(src) && !failed;

  // The container's shape is only known once laid out, so the decision has to
  // happen on load rather than from the filename.
  const measure = (e) => {
    const img = e.currentTarget;
    const box = img.getBoundingClientRect();
    if (!img.naturalWidth || !box.height) return;
    const natural = img.naturalWidth / img.naturalHeight;
    const rendered = box.width / box.height;
    const deviation = Math.max(natural / rendered, rendered / natural);
    setContain(deviation > SHAPE_TOLERANCE);
  };

  if (!usable) {
    return (
      <div className={tileClassName}>
        <span>{(alt || '?').trim().charAt(0).toUpperCase()}</span>
        {label ? <em>{label}</em> : null}
      </div>
    );
  }

  return (
    <img
      src={src.startsWith('http') ? src : `/pictures/${src}`}
      alt={alt}
      className={`${className}${contain ? ' is-contained' : ''}`}
      loading="lazy"
      onLoad={measure}
      onError={() => setFailed(true)}
    />
  );
};

export default MediaOrTile;
