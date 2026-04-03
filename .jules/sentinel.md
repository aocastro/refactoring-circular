## 2025-02-17 - Prevent XSS in Anchor Tags via Malicious URIs
**Vulnerability:** User-supplied URLs (`store.storeUrl` and `link.url`) were being directly injected into `href` attributes without sanitization. An attacker could exploit this by using malicious protocols (e.g., `javascript:alert(1)`), leading to Cross-Site Scripting (XSS).
**Learning:** React does not automatically sanitize `href` strings; it only escapes text content. Any user-generated string used as a URL must be explicitly validated.
**Prevention:** Created a centralized `sanitizeUrl` utility in `src/lib/utils.ts` that explicitly blocks `javascript:`, `vbscript:`, and `data:` schemes. Implemented this across all affected components rendering user links.
