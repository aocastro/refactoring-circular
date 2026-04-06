## 2025-02-17 - Prevent XSS in Anchor Tags via Malicious URIs
**Vulnerability:** User-supplied URLs (`store.storeUrl` and `link.url`) were being directly injected into `href` attributes without sanitization. An attacker could exploit this by using malicious protocols (e.g., `javascript:alert(1)`), leading to Cross-Site Scripting (XSS).
**Learning:** React does not automatically sanitize `href` strings; it only escapes text content. Any user-generated string used as a URL must be explicitly validated.
**Prevention:** Created a centralized `sanitizeUrl` utility in `src/lib/utils.ts` that explicitly blocks `javascript:`, `vbscript:`, and `data:` schemes. Implemented this across all affected components rendering user links.
## 2024-04-05 - [Fix XSS in Linktree]
**Vulnerability:** XSS vulnerability where users could supply `javascript:` URIs in their custom link URLs, which would execute when clicked or opened via `window.open()`.
**Learning:** React escapes HTML correctly, but using untrusted strings directly in `href` or `window.open` is a classic XSS vector if not sanitized, especially in user-customizable areas like a Linktree page.
**Prevention:** Implement a reusable `sanitizeUrl` function in `src/lib/utils.ts` and wrap all dynamic URL attributes (such as user-provided links) with it.
## 2024-05-18 - Prevent XSS via Unsanitized `href` attributes
**Vulnerability:** User-supplied URLs (e.g., from Linktree configurations) were being rendered directly into the `href` attributes of `<a>` tags in `LinktreeContent`, `LinktreePublic`, and `AdminLojasContent`.
**Learning:** This is a classic Cross-Site Scripting (XSS) vulnerability. If a malicious user supplies a URL like `javascript:alert(1)`, it will execute when clicked. This pattern is common when displaying user-configured links or external references.
**Prevention:** Always sanitize user-supplied URLs before placing them in `href` attributes. A `sanitizeUrl` utility function was added to `src/lib/utils.ts` to ensure only safe protocols (http, https, mailto, tel) or relative paths are allowed, falling back to `about:blank` for dangerous protocols like `javascript:`, `vbscript:`, and `data:`. This function must be used universally for external links.
