import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
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
