import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Sanitizes user-supplied URLs to prevent Cross-Site Scripting (XSS).
 * Blocks 'javascript:', 'vbscript:', and 'data:' URIs.
 */
export function sanitizeUrl(url: string): string {
  if (!url) return "about:blank";
  try {
    // Check if it's a relative URL or absolute
    const parsedUrl = new URL(url, window.location.origin);
    const protocol = parsedUrl.protocol.toLowerCase();

    // Block potentially malicious protocols
    if (["javascript:", "vbscript:", "data:"].includes(protocol)) {
      return "about:blank";
    }

    return url;
  } catch (err) {
    // Fallback if URL parsing fails but might be a valid relative path like "/about"
    // Also block starting with malicious schemes even if not parseable
    const lowerUrl = url.trim().toLowerCase();
    if (
      lowerUrl.startsWith("javascript:") ||
      lowerUrl.startsWith("vbscript:") ||
      lowerUrl.startsWith("data:")
    ) {
      return "about:blank";
    }
    return url;
  }
}
