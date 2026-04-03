import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Sanitizes a URL by removing dangerous protocols (javascript:, vbscript:, data:).
 * Returns '#' if the URL is deemed unsafe.
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
      return "#";
    }
    return url;
  }
}
