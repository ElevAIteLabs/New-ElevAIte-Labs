// The admin image picker only offers Arkin mascot files, so a lot of CMS rows
// carry one by default. Arkin is a brand accent, not a substitute for a product
// shot - pages call this to decide between showing the image and falling back to
// a branded tile.
export const isMascot = (src) => !!src && /arkin/i.test(src);

export const isRealArtwork = (src) => !!src && !isMascot(src);
