/**
 * Canonical public origin for sitemap, robots, and metadata.
 * Override with NEXT_PUBLIC_SITE_URL (no trailing slash).
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://zaz.agency"
).replace(/\/$/, "");

export function absoluteUrl(path: string): string {
  if (path === "/" || path === "") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
