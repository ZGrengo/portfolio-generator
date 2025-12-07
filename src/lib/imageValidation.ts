// List of allowed image hostnames from next.config.ts
const ALLOWED_IMAGE_HOSTNAMES = [
  'auth0.com',
  'auth0usercontent.com',
  'googleusercontent.com',
  'imgur.com',
  'unsplash.com',
  'cloudinary.com',
  'githubusercontent.com',
  'amazonaws.com',
  'gravatar.com',
];

/**
 * Checks if an image URL is from an allowed domain
 */
export function isImageUrlAllowed(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    // Check if hostname matches any allowed pattern
    return ALLOWED_IMAGE_HOSTNAMES.some(allowed => {
      // Exact match
      if (hostname === allowed) return true;
      // Subdomain match (e.g., *.imgur.com matches i.imgur.com)
      if (hostname.endsWith(`.${allowed}`)) return true;
      return false;
    });
  } catch {
    return false;
  }
}

/**
 * Filters out invalid image URLs
 */
export function filterValidImageUrls(urls: string[]): string[] {
  return urls.filter(url => {
    if (!url || typeof url !== 'string' || !url.trim()) return false;
    return isImageUrlAllowed(url);
  });
}

