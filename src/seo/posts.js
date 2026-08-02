/**
 * Shared helpers for blog posts, used by the Learn listing, the post page,
 * and the build-time prerenderer.
 */

const IS_DEV = import.meta.env?.DEV;
const API_URL = import.meta.env?.VITE_API_URL;

/** Listing endpoint, or a single post when a slug is given. */
export function postsApiUrl(slug) {
  if (IS_DEV) {
    return slug
      ? `http://localhost:5000/posts?slug=${encodeURIComponent(slug)}`
      : 'http://localhost:5000/posts';
  }
  return slug
    ? `${API_URL}/posts.php?slug=${encodeURIComponent(slug)}`
    : `${API_URL}/posts.php`;
}

/**
 * Cover images come from the admin uploader as bare filenames, but the older
 * hardcoded posts use absolute Unsplash URLs — accept both.
 */
export function postImageSrc(image) {
  if (!image) return null;
  return /^https?:\/\//.test(image) ? image : `/pictures/${image}`;
}

/** "Product · 7 min read · ElevAIte Labs", skipping whatever is missing. */
export function postMeta(post) {
  return [post.tag, post.read_time, post.author].filter(Boolean).join(' · ');
}

export const postPath = (slug) => `/learn/${slug}`;
