import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Sanitizes a URL by removing dangerous protocols (javascript:, vbscript:, data:).
 * Returns '#' if the URL is deemed unsafe.
 * Sanitizes URLs to prevent XSS attacks.
 * Disallows javascript:, vbscript:, data: and other potentially harmful protocols.
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '#';
  try {
    const parsedUrl = new URL(url, window.location.origin);
    const protocol = parsedUrl.protocol.toLowerCase();

    // Allow only http, https, mailto, tel
    if (['http:', 'https:', 'mailto:', 'tel:'].includes(protocol)) {
      return url;
    }

    // If it's a relative path that doesn't start with / but doesn't have a protocol
    return '#';
  } catch (e) {
    // If URL parsing fails, it might be a relative path like "/about"
    // Let's do a basic regex check for dangerous protocols at the beginning
    const dangerousProtocols = /^(javascript|vbscript|data):/i;
    if (dangerousProtocols.test(url.trim())) {
      return '#';
    }

    // Return original url if it seems like a valid relative path or fragment
    if (url.startsWith('/') || url.startsWith('#') || url.startsWith('?')) {
      return url;
    }

    // Fallback to safe
    return '#';
 * Sanitizes a URL to prevent XSS via malicious schemes like javascript:
 */
export function sanitizeUrl(url?: string): string {
  if (!url) return "#";
  try {
    const parsedUrl = new URL(url, "http://localhost"); // fallback base for relative urls
    if (["javascript:", "vbscript:", "data:"].includes(parsedUrl.protocol)) {
      return "#";
    }
    return url;
  } catch (e) {
    // If URL parsing fails, default to a safe value or return the original if it's a simple path
    // For safety, we can just do a regex check as fallback
    const invalidProtocolRegex = /^(javascript|vbscript|data):/i;
    if (invalidProtocolRegex.test(url.trim())) {
    const parsedUrl = new URL(url, window.location.origin);
    if (parsedUrl.protocol === "javascript:" || parsedUrl.protocol === "vbscript:" || parsedUrl.protocol === "data:") {
      return "about:blank";
    }
    return url;
  } catch (e) {
    // Fallback manual check if URL parsing fails (e.g. invalid base)
    const lowerUrl = url.toLowerCase().trim();
    if (lowerUrl.startsWith("javascript:") || lowerUrl.startsWith("vbscript:") || lowerUrl.startsWith("data:")) {
      return "about:blank";
 * Sanitizes a URL to prevent XSS via javascript: or data: URIs.
 * Only allows http:, https:, mailto:, and tel: protocols.
 * Relative URLs are also allowed.
 */
export function sanitizeUrl(url: string): string {
  if (!url) return "#";
  try {
    const parsedUrl = new URL(url, window.location.origin);
    const allowedProtocols = ["http:", "https:", "mailto:", "tel:"];
    if (allowedProtocols.includes(parsedUrl.protocol)) {
      return url;
    }
    return "#";
  } catch (e) {
    // If it's a relative URL or invalid, checking for explicit malicious prefixes
    const lowerUrl = url.toLowerCase().trim();
    if (lowerUrl.startsWith("javascript:") || lowerUrl.startsWith("data:") || lowerUrl.startsWith("vbscript:")) {
      return "#";
    }
    return url;
  }
}
