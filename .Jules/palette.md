## 2024-04-03 - Added ARIA labels to PaginationControls
**Learning:** Found that `PaginationControls` and other buttons throughout the UI lacked `aria-label` attributes on icon-only buttons (like pagination arrows). Without `aria-label`s on buttons like `<ChevronLeft />`, screen readers just announce 'button', rendering navigation confusing or inaccessible.
**Action:** Consistently add `aria-label` attributes with descriptive text to any button that uses icons exclusively for functionality, ensuring screen readers can articulate the intended interaction.
