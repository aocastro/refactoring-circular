import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
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
  }
}
