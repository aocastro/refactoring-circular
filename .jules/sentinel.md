## 2024-04-05 - [Fix XSS in Linktree]
**Vulnerability:** XSS vulnerability where users could supply `javascript:` URIs in their custom link URLs, which would execute when clicked or opened via `window.open()`.
**Learning:** React escapes HTML correctly, but using untrusted strings directly in `href` or `window.open` is a classic XSS vector if not sanitized, especially in user-customizable areas like a Linktree page.
**Prevention:** Implement a reusable `sanitizeUrl` function in `src/lib/utils.ts` and wrap all dynamic URL attributes (such as user-provided links) with it.
