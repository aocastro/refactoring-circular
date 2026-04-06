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
export function sanitizeUrl(url?: string): string {
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
