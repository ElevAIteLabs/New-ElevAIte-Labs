import { useState } from 'react';
import { isRealArtwork } from '../lib/artwork';

// CMS rows can carry a mascot placeholder, a missing filename, or nothing at
// all. Any of those falls back to a branded tile rather than a broken image.
const MediaOrTile = ({ src, alt, label, className = '', tileClassName = 'media-tile' }) => {
  const [failed, setFailed] = useState(false);
  const usable = isRealArtwork(src) && !failed;

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
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
};

export default MediaOrTile;
